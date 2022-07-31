import fetch from "node-fetch";
import Order from "./../../models/Order.js";
import Product from "./../../models/Product.js";
import User from "./../../models/User.js";
import {achievementEvent} from "../../services/achievement.js";
import {getToken} from "../../services/digiseller.js";
import {mailingBuyProduct} from "../../services/mailer.js";
import exceljs from "exceljs";
import path from "path";
import {__dirname} from "../../rootPathes.js";

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
      const user = await User.findById(order.userId);
  
      user.purchasedProducts += 1;
      await user.save();
      await user.increaseRating(10);
      await achievementEvent('productPurchase', user);
    }
  
    mailingBuyProduct(product._id, buyerEmail).then();
    
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

export const getFeedCsv = async (req, res) => {
  try {
    const products = await Product
      .find({active: true})
      .select(['name', 'alias', 'img', 'description', 'priceTo', 'priceFrom'])
      .populate(['activationServiceId'])
      .limit(4)
      .skip(1)
      .lean();
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Products In Stock');
  
    worksheet.columns = [{header: 'ID,Title,URL,Image,Description,Price,Old Price,Currency', key: 'row'}];
  
    products.forEach((product, index) => {
      worksheet.addRow({row: `${index + 1},${product.name},${res.locals.websiteAddress}games/${product.alias},${res.locals.websiteAddress}${product.img},Купить игру ${product.name} c активацией в ${product.activationServiceId.name} со скидкой.,${product.priceTo},${product.priceFrom},RUB`}, 'i');
    });
  
    await workbook.csv.writeFile(path.join(__dirname, 'uploadedFiles/feed.csv'), {encoding: 'UTF-8'});
  
    res.sendFile(path.join(__dirname, 'uploadedFiles/feed.csv'));
  } catch (e) {
    console.log(e);
    res.sendFile(path.join(__dirname, 'uploadedFiles/feed.csv'));
  }
}