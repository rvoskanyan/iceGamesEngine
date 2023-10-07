import fetch from "node-fetch";
import FillUp from "../../models/FillUp.js";

export const fillUpAnalyticsPage = async (req, res) => {
  try {
    const activeFillUp = req.app.get('activeFillUp');
    
    try {
      const response = await fetch('https://steam-api.kupikod.com/api/v3/partner-balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'steam-api.kupikod.com',
          'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
        },
      });
  
      console.log(response.status);
  
      const data = await response.json();
  
      res.render('admFillUpAnalyticsPage', {
        layout: 'admin',
        balance: data.balance,
        activeFillUp: activeFillUp === undefined ? true : activeFillUp,
      });
    } catch (e) {
      console.log(e);
      res.render('admFillUpAnalyticsPage', {
        layout: 'admin',
        balance: 'Ошибка загрузки',
        activeFillUp: activeFillUp === undefined ? true : activeFillUp,
      });
    }
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const updateStatuses = async (req, res) => {
  try {
    const pendingFillUps = await FillUp.find({status: 'pending'}).select(['orderId', 'status']);
  
    for (const fillUp of pendingFillUps) {
      const response = await fetch(`https://steam-api.kupikod.com/api/v3/partner-order/${fillUp.orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
        },
      });
  
      const stateData = await response.json();
  
      if (stateData.state !== 'pending') {
        try {
          fillUp.status = stateData.state;
          await fillUp.save();
        } catch (e) {
          console.log(e);
        }
      }
    }
  
    res.redirect('/admin/fill-up-analytics');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/fill-up-analytics');
  }
}

export const setActive = (req, res) => {
  req.app.set('activeFillUp', req.body.activeFillUp === 'on');
  
  res.redirect('/admin');
}