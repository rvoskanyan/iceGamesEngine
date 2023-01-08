import fetch from "node-fetch";
import exceljs from "exceljs";
import path from "path";

import {achievementEvent} from "../../services/achievement.js";
import {getToken} from "../../services/digiseller.js";
import {mailingBuyProduct} from "../../services/mailer.js";
import {getTurboArticlesRssFeedText, getYmlFeed} from "../../utils/functions.js";
import Turn from "../../services/Turn.js";

import Order from "./../../models/Order.js";
import Product from "./../../models/Product.js";
import User from "./../../models/User.js";
import Genre from "../../models/Genre.js";
import Article from "../../models/Article.js";

import {__dirname} from "../../rootPathes.js";

export const assignOrderPay = async (req, res) => {
  const turn = new Turn();
  
  turn.push(async () => {
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
      
      if (!dsCartId) {
        return;
      }
    
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
      const product = await Product.findOne({dsId: dsProductId}).select(['_id']).lean();
      
      if (!product) {
        throw new Error('Product not found')
      }
      
      const productByOrder = {
        productId: product._id,
        purchasePrice: priceProduct,
      };
      const firstDsPay = !order.paidTypes.includes('ds');
      
      if (firstDsPay) {
        order.paidTypes.push('ds');
        order.products = order.products.filter(product => product.dbi);
        order.dsBuyerEmail = buyerEmail;
  
        switch (order.paymentType) {
          case 'mixed': {
            switch (order.status) {
              case 'notPaid': {
                order.status = 'partiallyPaid';
                break;
              }
              case 'partiallyPaid': {
                order.status = 'paid';
                break;
              }
              case 'canceled': {
                order.status = 'partiallyPaid';
                break;
              }
            }
      
            break;
          }
          case 'ds': {
            order.status = order.status !== 'paid' ? 'paid' : order.status;
      
            break;
          }
        }
      }
  
      order.products.push(productByOrder);
    
      await order.save();
    
      if (order.userId) {
        const user = await User.findById(order.userId);
        
        if (user) {
          user.purchasedProducts += 1;
          await user.save();
          await user.increaseRating(10);
          await achievementEvent('productPurchase', user);
        }
      }
    
      await mailingBuyProduct(product._id, buyerEmail).then();
    
      res.json({
        success: true,
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: true,
      });
    }
  })
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
      .lean();
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Products In Stock');
  
    worksheet.columns = [
      {header: 'ID', key: 'ID'},
      {header: 'Title', key: 'Title'},
      {header: 'URL', key: 'URL'},
      {header: 'Image', key: 'Image'},
      {header: 'Description', key: 'Description'},
      {header: 'Price', key: 'Price'},
      {header: 'Old Price', key: 'OldPrice'},
      {header: 'Currency', key: 'Currency'},
    ];
  
    products.forEach((product, index) => {
      worksheet.addRow({
        ID: index + 1,
        Title: product.name,
        URL: `${res.locals.websiteAddress}games/${product.alias}`,
        Image: `${res.locals.websiteAddress}${product.img}`,
        Description: `Купить игру ${product.name} c активацией в ${product.activationServiceId.name} со скидкой.`,
        Price: product.priceTo,
        OldPrice: product.priceFrom > product.priceTo ? product.priceFrom : product.priceTo + 1,
        Currency: 'RUB',
      })
    });
  
    await workbook.csv.writeFile(path.join(__dirname, 'uploadedFiles/feed.csv'), {
      formatterOptions: {
        delimiter: ',',
        quote: false,
      }
    });
  
    res.sendFile(path.join(__dirname, 'uploadedFiles/feed.csv'));
  } catch (e) {
    console.log(e);
    res.sendFile(path.join(__dirname, 'uploadedFiles/feed.csv'));
  }
}

export const getFeedYML = async (req, res) => {
  try {
    const genres = await Genre.find().select(['alias', 'name']).lean();
    const products = await Product
      .find({active: true, inStock: true})
      .select(['name', 'alias', 'img', 'description', 'priceTo', 'priceFrom', 'discount'])
      .populate(['activationServiceId', 'genres'])
      .lean();
    
    const ymlFeed = getYmlFeed(products, genres);
  
    res.set('Content-Type', 'text/xml');
    res.send(ymlFeed);
  } catch (e) {
    console.log(e);
  }
}

export const getTurboArticlesRssFeed = async (req, res) => {
  try {
    const articles = await Article.find({active: true}).select(['name', 'alias', 'img', 'blocks', 'createdAt']).lean();
    const turboArticlesRssFeedText = getTurboArticlesRssFeedText(articles);
    
    res.set('Content-Type', 'text/xml');
    res.send(turboArticlesRssFeedText);
  } catch (e) {
    console.log(e);
  }
}