import FillUp from "../../models/FillUp.js";
import fetch from "node-fetch";

export const fillUpSteamPage = (req, res) => {
  res.render('fillUpSteam', {
    title: 'ICE GAMES — Пополнить баланс Steam',
    metaDescription: 'Здесь Вы сможете быстро и просто пополнить баланс Вашего аккаунта Steam',
    breadcrumbs: [{
      name: 'Пополнить Steam',
      current: true,
    }],
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