import fetch from "node-fetch";
import crypto from "crypto";
import FillUp from "../../models/FillUp.js";
import Review from "../../models/Review.js";
import metrica from "../../services/metrica.js";

export const getPaymentLink = async (req, res) => {
  try {
    const activeFillUp = req.app.get('activeFillUp');

    if (!activeFillUp && activeFillUp !== undefined) {
      return res.json({
        error: true,
        message: 'Уважаемый клиент, в данным момент ведутся тех.работы, в связи с этим пополнение временно не доступно. Приносим свои извинения за доставленные неудобства, надеемся на Ваше понимание!',
      });
    }

    const {
      UID = '',
      confirmIndicationCorrectData = '',
      paymentMethod = '',
      email = '',
      yaClientId = undefined,
    } = req.body;
    const minAmount = 100;
    const maxAmount =  10000;
    let amount = req.body.amount;
    let rate;

    if (!UID || !amount || !email) {
      return res.json({
        error: true,
        message: 'UID, сумма для пополнения и email являются обязательными полями для заполнения',
      });
    }

    if (!confirmIndicationCorrectData) {
      return res.json({
        error: true,
        message: 'Необходимо подтвердить, что Вы указали верный UID',
      });
    }

    amount = parseInt(amount);

    if (amount < minAmount || amount > maxAmount) {
      return res.json({
        error: true,
        message: `Сумма пополнения должна быть не менее ${minAmount} и не более ${maxAmount}`,
      });
    }

    const commissionPercent = paymentMethod === 'sbp' ? 21.5 : 23.5;
    const commissionAmount = Math.floor(amount / 100 * commissionPercent);
    const total = amount;

    const fillUp = new FillUp({
      UID,
      amount,
      paymentMethod,
      commissionPercent,
      total,
      email,
      rate,
      yaClientId,
      confirmIndicationCorrectData: true,
      type: '',
      status: 'paymentAwaiting',
    });

    if (req.session.isAuth) {
      fillUp.user = res.locals.person._id;
      fillUp.email = res.locals.person.email;
    }

    let initPay = await fetch('https://securepay.tinkoff.ru/v2/Init/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        TerminalKey: '1670348277997',
        Token: 'icegames',
        Amount: total * 100,
        NotificationURL: "https://icegames.store/api/fillUpGame/notifications",
        OrderId: fillUp._id,
        SuccessURL: `https://icegames.store/fill-up-steam/check-status?fillUpId=${fillUp._id}`,
        Receipt: {
          Email: fillUp.email,
          Taxation: 'usn_income',
          Items: [{
            Name: 'Пополнение баланса Steam',
            Quantity: 1,
            Amount: total * 100,
            Price: total * 100,
            Tax: 'none',
          }],
        },
      })
    })

    const initPayData = await initPay.json();

    if (!initPayData.Success) {
      return res.json({
        error: true,
        message: 'Что-то пошло не так, попробуйте позже',
      });
    }

    fillUp.paymentUrl = initPayData.PaymentURL;
    fillUp.paymentId = initPayData.PaymentId;

    const sign = crypto.createHash('sha256').update(`kj9rl5ywpz0by380${initPayData.PaymentId}1670348277997`).digest('hex');

    let getQr = await fetch('https://securepay.tinkoff.ru/v2/GetQr', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        TerminalKey: '1670348277997',
        Token: sign,
        PaymentId: initPayData.PaymentId,
      })
    })

    const getQrData = await getQr.json();

    fillUp.sbpUrl = getQrData.Data;

    await fillUp.save();

    return res.json({
      success: true,
      fillUpId: fillUp._id,
      link: getQrData.Data,
    });

  } catch (e) {
    console.log(e);
    res.json({error: true});
  }
}

export const notifications = async (req, res) => {
  try {
    const {OrderId, Success, Status, Amount} = req.body;
    const fillUp = await FillUp.findById(OrderId);

    res.send("OK");

    if (!fillUp) {
      return res.status(404).json({err:true, messages:"Forbidden"}); //Сделать логирование и уведомление, что пришло уведомление по не существующему заказу
    }

    if (Success && Status === 'CONFIRMED') {
      if (fillUp.status === 'success') {
        return;
      }

      const response = await fetch('https://steam.kupikod.com/api/v3/partner-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': 'cc00453a85e8911a715c961d6067e364',
        },
        body: JSON.stringify({
          login: fillUp.UID,
          value: fillUp.amount,
          currency: 'rub',
        }),
      });

      if (!response.ok) {
        fillUp.codeOrderError = response.status;
        fillUp.status = 'createOrderError';

        return await fillUp.save();
      }

      const data = await response.json();

      fillUp.orderId = data.id;
      fillUp.status = 'pending';

      await fillUp.save();

      if (fillUp.yaClientId) {
        const target = 'payment_success_fillup_ru';
        metrica.offlineConversation(fillUp.yaClientId, target, Amount / 100, "RUB").then()
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({err: true, message: e});
  }
}

export const addReview = async (req, res) => {
  try {
    if (!req.session.isAuth) {
      throw new Error('No auth');
    }

    const person = res.locals.person;
    const text = req.body.text;
    const evalValue = parseInt(req.body.eval);
    const validErrors = [];

    if (!evalValue || evalValue < 1 || evalValue > 5) {
      validErrors.push('eval');
    }

    if (!text || typeof text !== 'string') {
      validErrors.push('text');
    }

    if (validErrors.length) {
      return res.json({
        error: true,
        validErrors,
      });
    }

    const canAddReview = await checkCanAddReview(person);

    if (!canAddReview) {
      throw new Error('Can not add review');
    }

    const review = new Review({
      user: person._id,
      target: 'FillUpGame',
      eval: evalValue,
      text,
    });

    await review.save();

    res.json({
      success: true,
    });

    async function checkCanAddReview(person) {
      const review = await Review.findOne({user: person._id, target: 'fillUpGame'}).select(['_id']).lean();

      if (review) {
        return false;
      }

      const fillUp = await FillUp.findOne({user: person._id, type: 'steam', status: 'success'}).select(['_id']).lean();

      return !!fillUp;
    }
  } catch (e) {
    console.log(e);
    res.json({
      err: true,
    });
  }
}
