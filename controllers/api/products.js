import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Guest from "../../models/Guest.js";
import Order from "../../models/Order.js";
import {achievementEvent} from "../../services/achievement.js";
import {validationResult} from "express-validator";
import fetch from "node-fetch";
import {getAlias, getChangeLayout, getGrams, toRoman} from "../../utils/functions.js";
import Review from "../../models/Review.js";
import Category from "../../models/Category.js";
import Genre from "../../models/Genre.js";
import ActivationService from "../../models/ActivationService.js";

export const getProducts = async (req, res) => {
  try {
    let {
      searchString = '',
      priceFrom = '',
      priceTo = '',
      sort = '',
      onlyStock = '',
      noCommission = '',
      categories = [],
      genres = [],
      activationServices = [],
      limit = 20,
      skip = 0,
    } = req.query;
    
    searchString = searchString.trim();
  
    const allCategories = await Category.find().select(['name', 'alias']).lean();
    const allGenres = await Genre.find().select(['name', 'alias']).lean();
    const allActivationServices = await ActivationService.find().select(['name', 'alias']).lean();
    
    const recIds = [];
    const recProducts = [];
    const numsSearch = searchString.match(/\d/g);
  
    const latin = getAlias(searchString, false);
    const changeLayout = getChangeLayout(searchString);
    const romaNumsSearch = toRoman(searchString, numsSearch);
  
    const shortNamesMatch = new RegExp(searchString, 'i');
    const latinShortNamesMatch = new RegExp(latin, 'i');
    const changeLayoutShortNamesMatch = new RegExp(changeLayout, 'i');
    const romaNumsShortNamesMatch = new RegExp(romaNumsSearch, 'i');
    
    const searchMatch = new RegExp(searchString, 'i');
    const latinMatch = new RegExp(latin, 'i');
    const changeLayoutMatch = new RegExp(changeLayout, 'i');
    const romaNumsSearchMatch = new RegExp(romaNumsSearch, 'i');
    
    const searchGrams = getGrams(searchString);
    const latinGrams = getGrams(latin);
    const changeLayoutGrams = getGrams(changeLayout);
    const romaNumsSearchGrams = getGrams(romaNumsSearch);
    
    const filter = {
      active: true,
    }
    
    const getWithoutSort = async (filter) => {
      let stageFilter = {
        $or: [
          {shortNames: shortNamesMatch},
          {shortNames: latinShortNamesMatch},
          {shortNames: changeLayoutShortNamesMatch},
          {shortNames: romaNumsShortNamesMatch},
        ],
      }
      
      let result = await Product.find({
        ...filter,
        ...stageFilter,
      }).skip(+skip).limit(+limit).sort({priceTo: -1, createdAt: -1}).lean();
      
      recProducts.push(...result);
  
      if (recProducts.length === +limit) {
        return recProducts;
      }
  
      const countShortNames = await Product.countDocuments({
        ...filter,
        ...stageFilter,
      });
  
      recIds.push(...result.map(item => item._id));
      
      stageFilter = {
        _id: {$nin: recIds},
        $or: [
          {name: searchMatch},
          {name: latinMatch},
          {name: changeLayoutMatch},
          {name: romaNumsSearchMatch},
        ],
      }
  
      result = await Product.find({
        ...filter,
        ...stageFilter,
      }).skip(recProducts.length ? 0 : +skip - countShortNames).limit(+limit - recProducts.length).sort({priceTo: -1, createdAt: -1}).lean();
  
      recProducts.push(...result);
  
      if (recProducts.length === +limit) {
        return recProducts;
      }
  
      const countName = await Product.countDocuments({
        ...filter,
        ...stageFilter,
      });
  
      recIds.push(...result.map(item => item._id));
      
      stageFilter = {
        _id: {$nin: recIds},
        nameGrams: {$in: searchGrams},
      }
      
      result = await Product.aggregate([
        {
          $match: {
            ...filter,
            ...stageFilter,
          }
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
            inStock: 1,
            SCORE: {
              $subtract: [
                {
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
                      searchGrams.length,
                    ]
                  }, 2],
                },
                {
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
                }
              ],
            },
          },
        },
      ]).sort({SCORE: -1}).skip(recProducts.length ? 0 : +skip - countShortNames - countName).limit(+limit - recProducts.length);
      
      recProducts.push(...result);
      
      return recProducts;
    }
  
    let person = null;
    let products;
  
    categories = Array.isArray(categories) ? categories : [categories];
    genres = Array.isArray(genres) ? genres : [genres];
    activationServices = Array.isArray(activationServices) ? activationServices : [activationServices];
  
    const categoryFilterIds = categories.map(categoryAlias => {
      return allCategories.find(item => item.alias === categoryAlias)._id
    });
    const genreFilterIds = genres.map(genreAlias => {
      return allGenres.find(item => item.alias === genreAlias)._id
    });
    const activationServicesIds = activationServices.map(activationServiceAlias => {
      return allActivationServices.find(item => item.alias === activationServiceAlias)._id
    });
    
    if (res.locals && res.locals.person) {
      person = res.locals.person;
    }
  
    if (categoryFilterIds.length) {
      filter.categories = {$in: categoryFilterIds};
    }
  
    if (genreFilterIds.length) {
      filter.genres = {$in: genreFilterIds};
    }
  
    if (activationServicesIds.length) {
      filter.activationServiceId = {$in: activationServicesIds};
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
    
    if (noCommission) {
      filter.countKeys = {$gt: 0};
    }
    
    if (searchString.length) {
      const paramsFilter = {...filter};
      
      filter['$or'] = [
        {shortNames: {$in: [searchString.toUpperCase()]}},
        {shortNames: {$in: [latin.toUpperCase()]}},
        {shortNames: {$in: [changeLayout.toUpperCase()]}},
        {shortNames: {$in: [romaNumsSearch.toUpperCase()]}},
        {name: searchMatch},
        {name: latinMatch},
        {name: changeLayoutMatch},
        {name: romaNumsSearchMatch},
        {nameGrams: {$in: searchGrams}},
        {nameGrams: {$in: latinGrams}},
        {nameGrams: {$in: changeLayoutGrams}},
        {nameGrams: {$in: romaNumsSearchGrams}},
      ];
      
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
  
        products = await Product.find(filter).sort(sortObjs).skip(+skip).limit(+limit).lean();
      } else {
        products = await getWithoutSort(paramsFilter);
      }
    } else {
      let sortObj = {};
      
      if (sort) {
        switch (sort) {
          case 'date': {
            sortObj.releaseDate = -1;
            break;
          }
          case 'price': {
            sortObj.priceTo = 1;
            break;
          }
          case 'discount': {
            sortObj.discount = -1;
            break;
          }
        }
      } else {
        sortObj = {priceTo: -1};
      }
  
      sortObj.createdAt = -1;
    
      products = await Product.find(filter).sort({...sortObj}).skip(+skip).limit(+limit).lean();
    }
    
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
    const order = await Order.findOne({status: 'paid', userId: user._id, items: {$elemMatch: {productId}}});
    
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
      targetId: productId,
      target: 'Product',
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