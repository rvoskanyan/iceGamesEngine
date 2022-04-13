import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Guest from "../../models/Guest.js";
import Order from "../../models/Order.js";
/*
  Articles.find({_id: {$ne: article._id}})
 */

/*
  const products = await Product.find({
    _id: {
      $nin: article.products,
    }
  }).select(['name']);
*/

/*const result = await Product.aggregate.lookup({
  from: 'users',
  localField: 'userId',
  foreignField: '_id',
  as: 'users',
});*/

export const getProducts = async (req, res) => {
  try {
    const {searchString} = req.query;
    const name = new RegExp(searchString, 'i');
    
    const products = await Product.find({name});
    
    res.json({
      message: 'success',
      products,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: 'Error',
    });
  }
}

export const addToFavorites = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.session.userId;
    
    if (!productId || !userId) {
      throw new Error();
    }
    
    const product = await Product.findById(productId).select(['_id']).lean();
    
    if (!product) {
      throw new Error();
    }
    
    const user = await User.findById(userId);
    
    if (user.favoritesProducts.includes(productId)) {
      throw new Error();
    }
    
    user.favoritesProducts.push(productId);
    await user.save();
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

export const deleteFromFavorites = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.session.userId;
  
    if (!productId || !userId) {
      throw new Error('No auth or no productId');
    }
  
    const user = await User.findById(userId);
    const index = user.favoritesProducts.findIndex(item => item._id.toString() === productId);
  
    if (index === -1) {
      throw new Error('Not found this product in favorites');
    }
    
    user.favoritesProducts.splice(index, 1);
    await user.save();
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

export const addToCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const dsCartId = req.body.dsCartId;
    const userId = req.session.userId;
    let person = null;
  
    if (!productId || !dsCartId) {
      throw new Error('No productId or dsCartId');
    }
  
    const product = await Product.findById(productId).select(['_id']).lean();
  
    if (!product) {
      throw new Error('Product not found in DB');
    }
    
    if (userId) {
      person = await User.findById(userId);
    } else {
      const guestId = req.cookies.guestId;
      
      if (guestId) {
        person = await Guest.findById(guestId);
      } else {
        person = new Guest();
        person.products = [];
        res.cookie('guestId', person.id);
      }
    }
  
    if (person['cart'].includes(productId)) {
      throw new Error('This product exists');
    }
  
    person['cart'].push(productId);
    person.dsCartId = dsCartId;
    await person.save();
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

export const deleteFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const person = res.locals.person;
  
    if (!productId || !person) {
      throw new Error('No productId or personData');
    }
    
    const index = person.cart.findIndex(item => item._id.toString() === productId);
  
    if (index === -1) {
      throw new Error('Not found this product in cart');
    }
  
    person.cart.splice(index, 1);
    await person.save();
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

export const addReview = async (req, res) => {
  try {
    if (!req.session.isAuth) {
      throw new Error('No auth');
    }
    
    const user = res.locals.person;
    const productId = req.params.productId;
    const text = req.body.text;
    const validErrors = [];
    const evalValue = parseInt(req.body.eval);
    const order = await Order.findOne({status: 'paid', userId: user._id, products: {$elemMatch: {productId}}});
  
    if (!order) {
      throw new Error('Product not purchased');
    }
    
    if (!evalValue || evalValue < 1 || evalValue > 5) {
      validErrors.push('eval');
    }
    
    if (!text || typeof text !== 'string') {
      validErrors.push('text');
    }
    
    if (validErrors.length) {
      return res.json({
        error: true,
        validErrors,
      });
    }
    
    const product = await Product.findById(productId).select(['reviews', 'countReviews', 'totalEval']);
    const isNoReview = product.reviews.findIndex(review => review.userId.toString() === user.id) === -1;

    if (!isNoReview) {
      throw new Error('The product has a review from an current user');
    }
    
    product.reviews.push({
      userId: user._id,
      eval: evalValue,
      text,
    });
    
    product.countReviews += 1;
    product.totalEval += evalValue;
    
    await product.save();
    
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