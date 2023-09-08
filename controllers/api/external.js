import fetch from "node-fetch";
import exceljs from "exceljs";
import path from "path";

import {achievementEvent} from "../../services/achievement.js";
import {getToken} from "../../services/digiseller.js";
import {mailingBuyProduct, outStockProduct} from "../../services/mailer.js";
import {getTurboArticlesRssFeedText, getYmlFeed} from "../../utils/functions.js";
import Turn from "../../services/Turn.js";

import Order from "./../../models/Order.js";
import Product from "./../../models/Product.js";
import User from "./../../models/User.js";
import Genre from "../../models/Genre.js";
import Article from "../../models/Article.js";

import {__dirname} from "../../rootPathes.js";
import Key from "../../models/Key.js";
import metrica from "../../services/metrica.js";

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
    
      if (!order || order.isDBI) {
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
        sellingPrice: priceProduct,
      };
      
      if (order.status !== 'paid') {
        order.status = 'paid';
        order.items = [productByOrder];
      } else {
        order.items.push(productByOrder);
      }
      
      order.dsBuyerEmail = buyerEmail;
    
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
    
      await mailingBuyProduct(product._id, buyerEmail);
    
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
    const isFromStock = !!(req.query && req.query.fromStock);
    const filter = {active: true};
    
    if (isFromStock) {
      filter.$or = [
        {countKeys: {$gt: 0}},
        {kupiKodInStock: true},
      ];
    }
    
    const products = await Product
      .find(filter)
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
    const articles = await Article
      .find({active: true})
      .select(['name', 'alias', 'img', 'blocks', 'createdAt', 'products'])
      .populate([{
        path: 'products',
        select: ['name', 'alias'],
      }])
      .lean();
    const turboArticlesRssFeedText = getTurboArticlesRssFeedText(articles);
    
    res.set('Content-Type', 'text/xml');
    res.send(turboArticlesRssFeedText);
  } catch (e) {
    console.log(e);
  }
}

export const yaSplitHandler = async (req, res) => {
  console.log('yaSplitHandler');
  
  try {
    const { operation } = req.body;
    const order = await Order.findById(operation.orderId);
  
    res.json({ "status": "success" });
  
    if (!order) {
      return res.status(400).json({
        "reason": "Order non found",
        "reasonCode": "404",
        "status": "fail"
      }); //Сделать логирование и уведомление, что пришло уведомление по не существующему заказу
    }
  
    if (operation.status === 'SUCCESS') {
      if (order.status === 'paid') {
        return;
      }
    
      const orderItems = order.items;
    
      for (const item of orderItems) {
        const productId = item.productId;
        const key = await Key.findOne({product: productId, isActive: true, isSold: false});
        const product = await Product.findById(productId).populate([{
          path: 'activationServiceId',
          select: 'name',
        }]);
      
        if (!key) {
          order.messages.push(`Не найден в наличии ключ активации для ${product.name}`); //Сделать уведомление в админке
          continue;
        }
      
        key.isSold = true;
        key.soldOrder = order._id;
        key.sellingPrice = item.sellingPrice;
        await key.save();
      
        product.countKeys--;
      
        if (product.isSaleStock) {
          product.isSaleStock = product.countKeys > 0;
        }
      
        await product.save();
        await product.changeInStock(product.countKeys > 0 || product.kupiKodInStock);
      
        await mailingBuyProduct({
          product,
          email: order.buyerEmail,
          key: key.value,
        });
      
        if (product.countKeys < 4 && !product.kupiKodInStock) {
          outStockProduct(product).then();
        }
      }
      
      const amount = order.items.reduce((amount, item) => amount + item.sellingPrice, 0);
    
      if (order.yaClientId) {
        metrica.offlineConversation(order.yaClientId, "payment_success", amount, "RUB").then()
      }
    
      order.status = 'paid';
      await order.save();
    
      if (order.userId) {
        const user = await User.findById(order.userId);
      
        if (user) {
          const countPurchases = orderItems.length;
        
          user.purchasedProducts += countPurchases;
          await user.save();
          await user.increaseRating(countPurchases * 10);
          await achievementEvent('productPurchase', user);
        }
      }
    
      return;
    }
  
    order.status = 'canceled';
    await order.save();
  } catch (e) {
    console.log(e);
  }
}