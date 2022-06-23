import fetch from "node-fetch";
import Order from "./../../models/Order.js";
import Product from "./../../models/Product.js";
import User from "./../../models/User.js";
import {achievementEvent} from "../../services/achievement.js";
import {getToken} from "../../services/digiseller.js";

export const assignOrderPay = async (req, res) => {
  try {
    const params = req.body;
    const invoiceId = params['ID_I'];
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
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    const token = await getToken();
  
    const responseOrder = await fetch(`https://api.digiseller.ru/api/purchase/info/${invoiceId}?token=${token['token']}`, {
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
    
    await order.save();
    
    if (order.userId) {
      const user = User.findById(order.userId);
  
      user.purchasedProducts += 1;
      await user.save();
      await user.increaseRating(10);
      await achievementEvent('productPurchase', user);
    }
    
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

export const acceptAgreement = (req, res) => {
  res.cookie('agreementAccepted', 1);
  res.json({
    success: true,
  });
}