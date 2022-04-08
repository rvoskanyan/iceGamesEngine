import fetch from "node-fetch";
import crypto from "crypto";
import Order from "./../../models/Order.js";

export const assignOrderPay = async (req, res) => {
  try {
    const params = req.body;
    const invoiceId = params['ID_I'];
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const dsProductId = params['ID_D'];
    const buyerEmail = params['EMAIL'];
    const addParams = Buffer.from(params['THROUGH'], 'base64').toString('ascii');
    const {dsCartId} = addParams;
    
    const responseToken = await fetch('https://api.digiseller.ru/api/apilogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        seller_id: 951647,
        timestamp: timestamp,
        sign: crypto.createHash('sha256').update(`B67D8EB8089C426F9A562CB08FB16151${timestamp}`).digest('hex')
      }),
    });
    const resultToken = await responseToken.json();
  
    const responseOrder = await fetch(`https://api.digiseller.ru/api/purchase/info/${invoiceId}?token=${resultToken['token']}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const resultOrder = await responseOrder.json();
    const priceProduct = resultOrder.content.amount;
    const order = await Order.findOne({dsCartId});
    
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}