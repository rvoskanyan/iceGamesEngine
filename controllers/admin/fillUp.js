import fetch from "node-fetch";

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