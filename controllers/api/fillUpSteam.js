import fetch from "node-fetch";
import crypto from "crypto";
import FillUp from "../../models/FillUp.js";
import Review from "../../models/Review.js";

export const getPaymentLink = async (req, res) => {
  try {
    const {
      steamLogin = '',
      confirmIndicationCorrectData = '',
      paymentMethod = '',
      email = '',
    } = req.body;
    let amount = req.body.amount;
    
    if (!steamLogin || !amount || !email) {
      return res.json({
        error: true,
        message: 'Логин Steam, сумма для пополнения и email являются обязательными полями для заполнения',
      });
    }
    
    if (!confirmIndicationCorrectData) {
      return res.json({
        error: true,
        message: 'Необходимо подтвердить, что Вы указали именно логин Steam',
      });
    }
    
    if (paymentMethod !== 'sbp' && paymentMethod !== 'card') {
      return res.json({
        error: true,
        message: 'Некорректно выбран способ оплаты',
      });
    }
  
    amount = parseInt(amount);
    
    if (amount < 100 || amount > 10000) {
      return res.json({
        error: true,
        message: 'Сумма пополнения должна быть не менее 100₽ и не более 10 000₽',
      });
    }
    
    const commissionPercent = paymentMethod === 'sbp' ? 24.5 : 30;
    const commissionAmount = Math.floor(amount / 100 * commissionPercent);
    const total = amount + commissionAmount;
    
    const fillUp = new FillUp({
      steamLogin,
      amount,
      paymentMethod,
      commissionPercent,
      total,
      email,
      confirmIndicationCorrectData: true,
      type: 'steam',
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
        NotificationURL: "https://icegames.store/api/fillUpSteam/notifications",
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
    
    if (paymentMethod !== 'sbp') {
      await fillUp.save();
      
      return res.json({
        success: true,
        card: true,
        link: initPayData.PaymentURL,
      });
    }
  
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
          'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
        },
        body: JSON.stringify({
          login: fillUp.steamLogin,
          value: fillUp.amount,
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
      target: 'FillUpSteam',
      eval: evalValue,
      text,
    });
  
    await review.save();
  
    res.json({
      success: true,
    });
  
    async function checkCanAddReview(person) {
      const review = await Review.findOne({user: person._id, target: 'FillUpSteam'}).select(['_id']).lean();
    
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