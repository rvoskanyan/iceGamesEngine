const Product = require("../../models/Product");
const User = require("../../models/User");
const Guest = require("../../models/Guest");
const {log} = require("webpack-cli/lib/utils/logger");
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

const getProducts = async (req, res) => {
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

const addToFavorites = async (req, res) => {
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

const deleteFromFavorites = async (req, res) => {
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

const addToCart = async (req, res) => {
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

const deleteFromCart = async (req, res) => {
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

module.exports = {
  getProducts,
  addToFavorites,
  deleteFromFavorites,
  addToCart,
  deleteFromCart,
}