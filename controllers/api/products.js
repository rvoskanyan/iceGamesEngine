import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Guest from "../../models/Guest.js";
import Order from "../../models/Order.js";
import {achievementEvent} from "../../services/achievement.js";
import {validationResult} from "express-validator";
import fetch from "node-fetch";
import {getGrams} from "../../utils/functions.js";
import Review from "../../models/Review.js";
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
    const {
      searchString = '',
      priceFrom = '',
      priceTo = '',
      sort = '',
      onlyStock = '',
      categories = [],
      genres = [],
      activationServices = [],
      limit = 20,
      skip = 0,
    } = req.query;
    
    const searchGrams = getGrams(searchString);
    const filter = {
      active: true,
    }
    let person = null;
    let query;
  
    if (res.locals && res.locals.person) {
      person = res.locals.person;
    }
  
    if (categories.length) {
      filter.categories = {$in: categories};
    }
  
    if (genres.length) {
      filter.genres = {$in: genres};
    }
  
    if (activationServices.length) {
      filter.activationServiceId = {$in: activationServices};
    }
  
    if (priceFrom && +priceFrom >= 0) {
      filter.priceTo = {$gte: +priceFrom};
    }
  
    if (priceTo && +priceTo >= 0) {
      filter.priceTo = {
        ...filter.priceTo,
        $lte: +priceTo,
      }
    }
  
    if (onlyStock) {
      filter.inStock = true;
    }
  
    if (searchGrams) {
      filter.nameGrams = {
        $in: searchGrams,
      };
      
      query = Product.aggregate([
        {
          $match: filter,
        },
        {
          $project: {
            name: 1,
            img: 1,
            alias: 1,
            releaseDate: 1,
            priceTo: 1,
            priceFrom: 1,
            discount: 1,
            createdAt: 1,
            SCORE: {
              $round: [{
                $divide: [
                  {
                    $size: {
                      $filter: {
                        input: "$nameGrams",
                        cond: {
                          $in: ["$$this", searchGrams]
                        },
                      },
                    },
                  },
                  {
                    $size: "$nameGrams",
                  },
                ]
              }, 2],
            },
          },
        },
      ]);
    } else {
      query = Product.find(filter).lean();
    }
    
    if (sort) {
      const sortObjs = {};
      
      switch (sort) {
        case 'date': {
          sortObjs.releaseDate = -1;
          break;
        }
        case 'price': {
          sortObjs.priceTo = 1;
          break;
        }
        case 'discount': {
          sortObjs.discount = -1;
          break;
        }
      }
  
      sortObjs.createdAt = -1;
      
      query = query.sort(sortObjs);
    } else if (searchGrams) {
      query = query.sort({SCORE: -1, priceTo: -1, createdAt: -1})
    } else {
      query = query.sort({priceTo: -1, createdAt: -1})
    }
    
    let products = await query.skip(+skip).limit(+limit);
  
    if (person) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
    
      products = products.map(item => {
        const productId = item._id.toString();
        
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          item.inFavorites = true;
        }
      
        if (cart && cart.includes(productId)) {
          item.inCart = true;
        }
      
        return item;
      });
    }
  
    const count = await Product.countDocuments(filter);
    const isLast = +skip + +limit >= count;
    
    res.json({
      message: 'success',
      isAuth: req.session.isAuth,
      products,
      isLast,
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
    const isAuth = req.session.isAuth;
    
    if (!productId || !isAuth) {
      throw new Error();
    }
    
    const product = await Product.findById(productId).select(['_id']).lean();
    
    if (!product) {
      throw new Error();
    }
    
    const user = res.locals.person;
    
    if (user.favoritesProducts.includes(productId)) {
      throw new Error();
    }
    
    user.favoritesProducts.push(productId);
    await user.save();
    await achievementEvent('addProductFavorites', user);
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
    let person = res.locals.person;
  
    if (!productId) {
      throw new Error('No productId');
    }
  
    const product = await Product.findById(productId).select(['_id', 'inStock']).lean();
  
    if (!product) {
      throw new Error('Product not found in DB');
    }

    if (!product.inStock) {
      throw new Error('Product not in stock');
    }
    
    if (!person) {
      person = new Guest();
      res.cookie('guestId', person.id);
    }
  
    if (person['cart'].includes(productId)) {
      throw new Error('This product exists');
    }
  
    person['cart'].push(productId);
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
    
    const product = await Product.findById(productId).select(['countReviews', 'totalEval']);
    let review = await Review.find({product: productId, user: user._id});
    const isNoReview = !review.length;

    if (!isNoReview) {
      throw new Error('The product has a review from an current user');
    }
  
    review = new Review({
      user: user._id,
      product: productId,
      eval: evalValue,
      text,
    });
    
    await review.save();
    
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

export const revise = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).select(['dsId', 'inStock', 'priceTo', 'priceFrom', 'discount']);
    const responseProducts = await fetch('https://api.digiseller.ru/api/products/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ids: [product.dsId]}),
    });
    const resultProducts = await responseProducts.json();
    const dsProduct = resultProducts[0];
    
    await product.changeInStock(!!dsProduct.in_stock);
    await product.changePrice({priceTo: parseInt(dsProduct.price_rub)});
  
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

export const subscribeInStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    const {productId} = req.params;
    let {email = null} = req.body;
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: true,
        msg: errors.array()[0].msg,
      });
    }
    
    if (res.locals.isAuth) {
      email = res.locals.person.email;
    }
    
    if (!email) {
      return res.json({
        error: true,
        msg: 'Не указан E-mail'
      });
    }
    
    const product = await Product.findById(productId).select(['subscribesInStock', 'inStock']);
    
    if (!product || product.inStock) {
      throw new Error();
    }
  
    product.subscribesInStock.addToSet(email);
    await product.save();
    res.json({success: true});
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      msg: 'Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.'
    });
  }
}