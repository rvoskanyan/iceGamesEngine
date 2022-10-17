import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import {achievementEvent} from "../../services/achievement.js";
import exceljs from "exceljs";
import bcrypt from "bcryptjs";
import Review from "../../models/Review.js";
import Article from "../../models/Article.js";

export const pageAddPurchasesToFavorites = async (req, res) => {
  try {
    res.render('addPurchasesToFavorites', {layout: 'admin'});
  } catch (e) {
    console.log(e);
    res.redirect('/admin/cheat-reviews');
  }
}

export const addPurchasesToFavorites = async (req, res) => {
  const results = [];
  
  try {
    const {emails, categoryProducts} = req.body;
    const arrayEmails = emails.split('\n');
    let products;
    
    switch (categoryProducts) {
      case 'top': {
        products = await Product.find({active: true, top: true});
        break;
      }
      case 'all': {
    
        break;
      }
      case 'genre': {
    
        break;
      }
    }
    
    for (const email of arrayEmails) {
      const order = new Order();
      const user = await User.find({email: email.trim()});
      const countBuy = Math.floor(Math.random() * 3) + 1;
      const orderProducts = [];
  
      order.userId = user[0]._id;
      order.buyerEmail = user[0].email;
      order.status = 'paid';
      
      while (orderProducts.length < countBuy) {
        const productIndex = Math.floor(Math.random() * products.length);
        const isExists = orderProducts.find(product => products[productIndex]._id === product._id);
        
        if (isExists) {
          continue;
        }
  
        order.products.push({
          productId: products[productIndex]._id,
          purchasePrice: products[productIndex].priceTo,
        });
  
        orderProducts.push(products[productIndex]);
      }
      
      await order.save();
      user[0].purchasedProducts += countBuy;
      await user[0].save();
      await user[0].increaseRating(10 * countBuy);
      await achievementEvent('productPurchase', user[0]);
      
      results.push({
        userEmail: email,
        orderProducts,
      })
    }
    
    res.render('addPurchasesToFavoritesList', {
      layout: 'admin',
      results,
    })
    
  } catch (e) {
    console.log(e);
    
    if (results.length) {
      return res.redirect('/admin/cheat-reviews');
    }
  
    res.render('addPurchasesToFavoritesList', {
      layout: 'admin',
      results,
    })
  }
}

export const pageImportReviews = async (req, res) => {
  try {
    res.render('admImportReviews', {layout: 'admin'});
  } catch (e) {
    console.log(e);
    res.redirect('/admin/cheat-reviews');
  }
}

export const importReviews = async (req, res) => {
  try {
    const {startPosition = 1, count = 300} = req.body;
    const {importFile} = req.files;
    const workbook = new exceljs.Workbook();
    const products = await Product.find({active: true, dlc: false, top: true, inStock: true}).select(['name', 'alias', 'priceTo']).lean();
    const articles = await Article.find({active: true}).select(['views', 'likes']);
    const results = [];
  
    await workbook.xlsx.load(importFile.data);
  
    const worksheet = workbook.getWorksheet(1);
    
    for (let i = parseInt(startPosition); i < parseInt(startPosition) + parseInt(count); i++) {
      const email = worksheet.getCell(`A${i}`).value.trim().toLowerCase();
      const login = worksheet.getCell(`B${i}`).value.trim().toLowerCase();
      const text = worksheet.getCell(`C${i}`).value;
      const userByEmail = await User.find({email});
      const userByLogin = await User.find({login: login[0].toUpperCase() + login.slice(1)});
      const result = {success: false};
      
      result.row = i;
      result.noEmail = !email && (result.error = true);
      result.noLogin = !login && (result.error = true);
      result.noText = !text && (result.error = true);
      result.emailBusy = userByEmail.length && (result.error = true);
      result.loginBusy = userByLogin.length && (result.error = true);
      
      if (result.error) {
        results.push(result);
        
        continue;
      }
  
      const hashPassword = await bcrypt.hash('mfSgLwhq', 10);
      const evalValue = worksheet.getCell(`D${i}`).value;
      const countBuy = Math.floor(Math.random() * 3) + 1;
      const indexForReview = Math.floor(Math.random() * countBuy);
      const countReadArticles = Math.floor(Math.random() * (articles.length - 1)) + 1;
      const orderProducts = [];
      
      const user = new User({
        email,
        password: hashPassword,
        login: login[0].toUpperCase() + login.slice(1),
        emailChecked: true,
        bot: true,
      });
      
      await user.save();
  
      const order = new Order({
        userId: user._id,
        buyerEmail: email,
        status: 'paid',
      });
  
      while (orderProducts.length < countBuy) {
        const productIndex = Math.floor(Math.random() * products.length);
        const candidateProduct = products[productIndex];
        const isExists = orderProducts.find(product => candidateProduct._id.toString() === product._id.toString());
    
        if (isExists) {
          continue;
        }
    
        order.products.push({
          productId: candidateProduct._id,
          purchasePrice: candidateProduct.priceTo,
        });
    
        orderProducts.push(candidateProduct);
      }
      
      const review = new Review({
        text,
        eval: evalValue ? parseInt(evalValue) : 5,
        user: user._id,
        product: orderProducts[indexForReview]._id,
      });
  
      await order.save();
      user.purchasedProducts += countBuy;
      await user.save();
      await user.increaseRating(10 * countBuy);
      await achievementEvent('productPurchase', user);
      await review.save();
      
      result.success = true;
      result.name = orderProducts[indexForReview].name;
      result.alias = orderProducts[indexForReview].alias;
      result.text = text;
      result.evalValue = evalValue ? parseInt(evalValue) : 5;
      result.login = login;
      results.push(result);
  
      while (user.viewedArticles.length < countReadArticles) {
        const indexForView = Math.floor(Math.random() * articles.length);
        const article = articles[indexForView];
        const isArticleRead = user.viewedArticles.findIndex(item => item.toString() === article.id) !== -1;
        
        if (isArticleRead) {
          continue;
        }
  
        user.likedArticles.push(article._id);
        user.viewedArticles.push(article._id);
        await user.save();
        await user.increaseRating(2);
  
        article.likes += 1;
        article.views += 1;
        await article.save();
        await achievementEvent('articlesRead', user);
        await achievementEvent('likeArticle', user)
      }
    }
    
    res.render('admImportReviews', {
      layout: 'admin',
      results,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/cheat-reviews/import-reviews');
  }
}

export const pageImportForProducts = (req, res) => {
  res.render('admImportReviewsForProducts', {layout: 'admin'});
}

export const importForProducts = async (req, res) => {
  try {
    const {startPosition = 1, count = 300} = req.body;
    const {importFile} = req.files;
    const workbook = new exceljs.Workbook();
    const results = [];
    
    await workbook.xlsx.load(importFile.data);
    
    const worksheet = workbook.getWorksheet(1);
    
    for (let i = parseInt(startPosition); i < parseInt(startPosition) + parseInt(count); i++) {
      const email = worksheet.getCell(`A${i}`).value.trim().toLowerCase();
      const text = worksheet.getCell(`C${i}`).value;
      const productName = worksheet.getCell(`D${i}`).value;
      
      const product = await Product.findOne({name: productName}).select(['name', 'alias']).lean();
      const user = await User.findOne({email, bot: true});
      const result = {success: false};
      
      result.row = i;
      result.noEmail = !email && (result.error = true);
      result.noText = !text && (result.error = true);
      result.noProductName = !productName && (result.error = true);
      result.userNotFound = !user && (result.error = true);
      result.productNotFound = !product && (result.error = true);
      
      if (result.error) {
        results.push(result);
        
        continue;
      }
      
      const order = new Order({
        userId: user._id,
        buyerEmail: email,
        status: 'paid',
        products: [{
          productId: product._id,
          purchasePrice: product.priceTo,
        }],
      });
      
      const review = new Review({
        text,
        eval: 5,
        user: user._id,
        product: product._id,
      });
      
      await order.save();
      user.purchasedProducts += 1;
      await user.save();
      await user.increaseRating(10);
      await achievementEvent('productPurchase', user);
      await review.save();
      
      result.success = true;
      result.name = product.name;
      result.alias = product.alias;
      result.text = text;
      result.evalValue = 5;
      result.login = user.login;
      results.push(result);
    }
    
    res.render('admImportReviewsForProducts', {
      layout: 'admin',
      results,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/cheat-reviews/import-reviews');
  }
}