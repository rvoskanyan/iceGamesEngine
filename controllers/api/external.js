import fetch from "node-fetch";
import crypto from "crypto";
import Order from "./../../models/Order.js";
import Product from "./../../models/Product.js";

export const assignOrderPay = async (req, res) => {
  try {
    const params = req.body;
    const invoiceId = params['ID_I'];
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const dsProductId = params['ID_D'];
    const buyerEmail = params['Email'];
    const addParams = Buffer.from(params['Through'], 'base64').toString('ascii').split('&');
    let dsCartId = null;
    
    addParams.find(item => {
      const param = item.split('=');
      const nameParam = param[0];
      
      if (nameParam === 'dsCartId' || nameParam === 'cart_uid') {
        dsCartId = param[1];
        return true;
      }
    });
    
    const order = await Order.findOne({dsCartId});
  
    console.log(dsCartId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
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
    const product = await Product.findOne({dsId: dsProductId});
    const productByOrder = {
      productId: product._id,
      purchasePrice: priceProduct,
    };
    
    if (order.status !== 'paid') {
      order.status = 'paid';
      order.products = [productByOrder];
    } else {
      order.products.push(productByOrder);
    }
    
    if (!order.buyerEmail) {
      order.buyerEmail = buyerEmail;
    }
    
    order.save();
    
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