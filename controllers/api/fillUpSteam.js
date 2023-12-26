import fetch from "node-fetch";
import crypto from "crypto";
import FillUp from "../../models/FillUp.js";
import Review from "../../models/Review.js";
import TurkeyFillUp from "../../models/TurkeyFillUp.js";
import TurkeyFillUpKey from "../../models/TurkeyFillUpKey.js";
import {mailingBuyTurkeyFillUpKey} from "../../services/mailer.js";
import metrica from "../../services/metrica.js";

export const getPaymentLink = async (req, res) => {
  try {
    const activeFillUp = req.app.get('activeFillUp');
    
    if (!activeFillUp && activeFillUp !== undefined) {
      return res.json({
        error: true,
        nodes:[{name: 'activeFillUp', message:'Уважаемый клиент, в данным момент ведутся тех.работы, в связи с этим пополнение кошелька Steam временно не доступно. Приносим свои извинения за доставленные неудобства, надеемся на Ваше понимание!'}]
      });
    }
    
    const {
      steamLogin = null,
      confirmIndicationCorrectData = '',
      paymentMethod = '',
      email = null,
      yaClientId = undefined,
    } = req.body;
    const isKazakhstan = !!(req.query && req.query.kazakhstan);
    const minAmount = isKazakhstan ? 500 : 100;
    const maxAmount = isKazakhstan ? 50000 : 10000;
    let amount = req.body.amount;
    let rate;
    const nodesWithError = []
    const notFillUpMessage = 'Поле обязательно должно быть заполнено'
    const notSteamLogin = 'Необходимо подтвердить, что Вы указали именно логин Steam'
    const wrongPaymentMethodMessage = 'Некорректно выбран способ оплаты'
    const wrongAmount = `Сумма пополнения должна быть не менее ${minAmount} и не более ${maxAmount}`
    
    if (!steamLogin) nodesWithError.push({name: 'steamLogin', message: notFillUpMessage})
    if (!amount) nodesWithError.push({name: 'amount', message: notFillUpMessage})
    if (!email) nodesWithError.push({name: 'email', message: notFillUpMessage})
    if (!confirmIndicationCorrectData) nodesWithError.push({name: 'confirmIndicationCorrectData', message: notSteamLogin})
    if (paymentMethod !== 'sbp' && paymentMethod !== 'card') nodesWithError.push({name: 'paymentMethod', message: wrongPaymentMethodMessage})
    if (amount < minAmount || amount > maxAmount) nodesWithError.push({name: 'amount', message: wrongAmount})
    
    if (nodesWithError.length) {
      return res.json({
        nodes:nodesWithError,
        error: true,
      });
    }
  
    amount = parseInt(amount);
    
    if (isKazakhstan) {
      const responseRate = await fetch('https://steam-api.kupikod.com/api/v3/partner-kzt', { headers: {
          'Content-Type': 'application/json',
          'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
        }});
      const { rubKzt } = await responseRate.json();
    
      rate = (1 / parseFloat(rubKzt)).toFixed(2);
    }
    
    const commissionPercent = paymentMethod === 'sbp' ? 21.5 : 23.5;
    const commissionAmount = Math.floor(amount / 100 * commissionPercent);
    const total = isKazakhstan ? Math.floor((amount + commissionAmount) * rate) : amount + commissionAmount;
    
    const fillUp = new FillUp({
      steamLogin,
      amount,
      paymentMethod,
      commissionPercent,
      total,
      email,
      rate,
      isKazakhstan,
      yaClientId,
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
          currency: fillUp.isKazakhstan ? 'kzt' : 'rub',
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
        const target = fillUp.isKazakhstan ? 'payment_success_fillup_kz' : 'payment_success_fillup_ru';
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

export const createTurkeyFillUpOrder = async (req, res) => {
  try {
    const person = res.locals.person;
    const isAuth = req.session.isAuth;
    let email = person.email;
    
    if (!isAuth && !person.emailChecked) {
      email = undefined;
    }
    
    if (!email) {
      return res.json({
        error: true,
        message: 'E-mail не указан',
      });
    }
    
    const variant = req.body.variant;
    const yaClientId = req.body.yaClientId;
    const ids = {
      '20': {
        value: 'STEAMGС20TRY',
        price: 469,
      },
      '50': {
        value: 'STEAMGС50TRY',
        price: 629,
      },
      '100': {
        value: 'STEAMGС100TRY',
        price: 1189,
      },
      '200': {
        value: 'STEAMGС200TRY',
        price: 1999,
      },
      '250': {
        value: 'STEAMGС250TRY',
        price: 2199,
      },
      '300': {
        value: 'STEAMGС300TRY',
        price: 3299,
      },
    };
    const id = ids[variant];
    
    if (!id) {
      return res.json({
        error: true,
        message: 'Ошибка выбора номинала, попробуйте выбрать другой!',
      });
    }
    
    const turkeyFillUp = new TurkeyFillUp({ buyerEmail: email, denomination: parseInt(variant), yaClientId });
  
    if (isAuth) {
      turkeyFillUp.userId = person._id;
    }
    
    await turkeyFillUp.save();
  
    const response = await fetch(`https://partner.kupikod.com/api/partner/orders/${ turkeyFillUp._id }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Basic cGFydG5lcl9pY2VnYW1lOmFqY3o5X1NZVE5oWFdid0s=',
        'Host': 'partner.kupikod.com',
        'Origin': 'https://icegames.store',
      },
      body: JSON.stringify([{sku: id.value, qtt: 1}]),
    });
  
    if (!response.ok) {
      return res.json({
        error: true,
        message: `На данный момент купона в ${variant}₺ нет в наличии. Пожалуйста, выберите другой или попробуйте позже. Спасибо за понимание!`,
      });
    }
    
    const result = await response.json();
    const { price, secret } = result[0];
    
    const turkeyFillUpKey = new TurkeyFillUpKey({
      value: secret,
      purchasePrice: price,
      denomination: parseInt(variant),
    });
    
    await turkeyFillUpKey.save();
  
    const initPay = await fetch('https://securepay.tinkoff.ru/v2/Init/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        TerminalKey: '1670348277997',
        Token: 'icegames',
        Amount: id.price * 100,
        NotificationURL: "https://icegames.store/api/fillUpSteam/turkey-notifications",
        OrderId: turkeyFillUp._id,
        SuccessURL: 'https://icegames.store?successPayment=true',
        Receipt: {
          Email: email,
          Taxation: 'usn_income',
          Items: [{
            Name: `Подарочная карта с номиналом ${variant}₺ на пополнение турецкого Steam`,
            Quantity: 1,
            Amount: id.price * 100,
            Price: id.price * 100,
            Tax: 'none',
          }],
        },
      })
    })
  
    const initPayData = await initPay.json();
  
    if (!initPayData.Success) {
      return res.json({
        error: true,
        message: 'Ошибка перехода к оплате. Пожалуйста, обратитесь в поддержку!',
      });
    }
  
    turkeyFillUp.paymentUrl = initPayData.PaymentURL;
    turkeyFillUp.paymentId = initPayData.PaymentId;
    
    await turkeyFillUp.save();
  
    return res.json({
      success: true,
      link: initPayData.PaymentURL,
    });
  } catch (e) {
    console.log(e);
    
    res.json({
      error: true,
      message: 'Неизвестная ошибка, попробуйте позже'
    });
  }
}

export const turkeyNotifications = async (req, res) => {
  try {
    const { OrderId, Success, Status, Amount } = req.body;
    const turkeyFillUp = await TurkeyFillUp.findById(OrderId);
    
    res.send("OK");
    
    if (!turkeyFillUp) {
      return res.status(404).json({err:true, messages:"Forbidden"}); //Сделать логирование и уведомление, что пришло уведомление по не существующему заказу
    }
    
    if (Success && Status === 'CONFIRMED') {
      if (turkeyFillUp.status === 'paid') {
        return;
      }
      
      const turkeyFillUpKey = await TurkeyFillUpKey.findOne({
        isActive: true,
        isSold: false,
        denomination: turkeyFillUp.denomination,
      });
  
      turkeyFillUp.status = 'paid';
      
      await turkeyFillUp.save();
  
      turkeyFillUpKey.turkeyFillUpId = turkeyFillUp._id;
      turkeyFillUpKey.sellingPrice = Amount / 100;
      turkeyFillUpKey.isSold = true;
      
      await turkeyFillUpKey.save();
  
      mailingBuyTurkeyFillUpKey({
        value: turkeyFillUpKey.value,
        denomination: turkeyFillUpKey.denomination,
        email: turkeyFillUp.buyerEmail,
      }).then();
  
      if (turkeyFillUpKey.yaClientId) {
        metrica.offlineConversation(turkeyFillUpKey.yaClientId, 'payment_success_fillup_turk', Amount / 100, "RUB").then()
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({err: true, message: e});
  }
}