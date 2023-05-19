import fetch from "node-fetch";
import FillUp from "../../models/FillUp.js";

export const fillUpAnalyticsPage = async (req, res) => {
  try {
    const response = await fetch('https://steam.kupikod.com/api/v3/partner-balance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
      },
    });
  
    const data = await response.json();
    
    res.render('admFillUpAnalyticsPage', {
      layout: 'admin',
      balance: data.balance,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const updateStatuses = async (req, res) => {
  try {
    const pendingFillUps = await FillUp.find({status: 'pending'}).select(['orderId', 'status']);
  
    for (const fillUp of pendingFillUps) {
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
  
    res.redirect('/admin/fill-up-analytics');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/fill-up-analytics');
  }
}