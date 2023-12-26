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
      confirmUidCorrectData = '',
      productId = '',
      email = '',
    } = req.body;
    let amount = req.body.amount;

    if (!UID || !productId || !email) {
      return res.json({
        error: true,
        message: 'UID, продукт и email являются обязательными полями для заполнения',
      });
    }

    if (!confirmUidCorrectData) {
      return res.json({
        error: true,
        message: 'Необходимо подтвердить, что Вы указали верный UID',
      });
    }

    amount = parseInt(amount);
    const total = amount;

    const fillUp = new FillUp({
      UID,
      total,
      email,
      confirmUidCorrectData: true,
      productId,
      status: 'paymentAwaiting',
    });

    if (req.session.isAuth) {
      fillUp.user = res.locals.person._id;
    }

    let initPay = await fetch('https://genshin-pay.kupikod.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': 'cc00453a85e8911a715c961d6067e364',
      },
      body: JSON.stringify({
        product_id: fillUp.productId,
        p_uuid: fillUp.user,
        uid: fillUp.UID,
      })
    })

    const initPayData = await initPay.json();

    if (initPayData.status !== 'pending' && initPayData.status !== 'complete') {
      return res.json({
        error: true,
        message: 'Что-то пошло не так, попробуйте позже',
      });
    }

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

