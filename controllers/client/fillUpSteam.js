import FillUp from "../../models/FillUp.js";
import fetch from "node-fetch";

export const fillUpSteamPage = async (req, res) => {
  const successFillUps = await FillUp.find({status: 'success'}).select(['amount']).lean();
  const countFillUps = successFillUps.length + 1400;
  const amount = successFillUps.reduce((accum, fillUp) => accum + fillUp.amount, 0) + 850000;
  let seconds = new Date().getHours() + new Date().getMinutes();
  
  seconds = seconds >= 60 ? 17 : seconds;
  
  res.render('fillUpSteam', {
    title: 'ICE GAMES — Пополнение баланса Steam аккаунта',
    metaDescription: '⚡️Быстрое пополнение баланса кошелька Steam в 2023 году. ✔️Пополнение от 100 рублей. ✔️Оплата любым удобным способом: банковские карты, СПБ, Yandex Pay, Tinkoff Pay. ✔️Низкая комиссия. ✔️Зачисление в течение 2х минут. ⌚️Поддержка 24/7',
    breadcrumbs: [{
      name: 'Пополнить Steam',
      current: true,
    }],
    countFillUps,
    amount,
    seconds,
  });
}

export const checkStatus = async (req, res) => {
  try {
    const fillUpId = req.query.fillUpId;
    const fillUp = await FillUp.findById(fillUpId);
    let status = '';
    
    if (!fillUp) {
      res.redirect('/fill-up-steam');
    }
    
    if (fillUp.status === 'pending') {
      const response = await fetch(`https://steam.kupikod.com/api/v3/partner-order/${fillUp.orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
        },
      });
      
      const stateData = await response.json();
      
      if (stateData.state !== 'pending') {
        fillUp.status = stateData.state;
        await fillUp.save();
      }
    }
    
    switch (fillUp.status) {
      case 'paymentAwaiting': {
        status = 'Ожидает оплаты';
        break;
      }
      case 'pending': {
        status = 'Идет пополнение кошелька';
        break;
      }
      case 'success': {
        status = 'Кошелек успешно пополнен';
        break;
      }
      default: status = 'Ошибка при пополнении, обратитесь в поддержку';
    }
    
    res.render('checkFillUpStatus', {
      fillUp,
      status,
      breadcrumbs: [
        {
          name: 'Пополнить Steam',
          path: 'fill-up-steam',
        },
        {
          name: 'Статус пополнения',
          current: true,
        }
      ],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/fill-up-steam');
  }
}