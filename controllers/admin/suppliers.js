import fetch from "node-fetch";
import { startSyncKupiKod } from "../../services/parsing.js";

export const suppliersPage = async (req, res) => {
  try {
    const response = await fetch('https://partner.kupikod.com/api/partner/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Basic cGFydG5lcl9pY2VnYW1lOmFqY3o5X1NZVE5oWFdid0s=',
      },
    });
  
    const result = await response.json();
    
    res.render('admSuppliersPage', {
      layout: 'admin',
      catalog: result.catalog,
      balance: result.balance,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const syncKupiKod = async (req, res) => {
  try {
    req.app.set('syncKupiKod', true);
    startSyncKupiKod(req).then();
    res.redirect('/admin/parsing');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing');
  }
}