import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import {achievementEvent} from "../../services/achievement.js";

export const pageAddPurchasesSoFavorites = async (req, res) => {
  try {
    res.render('addPurchasesToFavorites', {layout: 'admin'});
  } catch (e) {
    console.log(e);
    res.redirect('/admin/cheat-reviews');
  }
}

export const addPurchasesSoFavorites = async (req, res) => {
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
      const user = await User.find({email});
      const countBuy = Math.floor(Math.random() * 5) + 1;
      const orderProducts = [];
  
      order.userId = user[0]._id;
      order.buyerEmail = user[0].email;
      order.status = 'paid';
      
      while (orderProducts.length < countBuy) {
        const productIndex = Math.floor(Math.random() * (arrayEmails.length - 0)) + arrayEmails.length;
        const isExists = orderProducts.find(product => products[productIndex]._id === product._id);
        
        if (isExists) {
          continue;
        }
  
        order.products.push({
          productId: products[productIndex]._id,
          purchasePrice: products[productIndex].priceTo,
        });
  
        orderProducts.push(products[productIndex]);
        user[0].purchasedProducts += 1;
        await user[0].increaseRating(10);
        await achievementEvent('productPurchase', user[0]);
      }
      
      await order.save();
      await user[0].save();
      
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