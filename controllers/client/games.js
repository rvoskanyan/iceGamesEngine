import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Genre from '../../models/Genre.js';
import ActivationService from '../../models/ActivationService.js';
import Order from '../../models/Order.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';
import {getDiscount} from "../../utils/functions.js";

export const gamesPage = async (req, res) => {
  try {
    let products = await Product.find().select(['name', 'dsId', 'alias', 'img', 'priceTo', 'priceFrom']).lean().limit(20);
    const categories = await Category.find().select(['name']);
    const genres = await Genre.find().select(['name']);
    const activationServices = await ActivationService.find().select(['name']);
    const person = res.locals.person;
    
    if (person) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
  
      products = products.map(item => {
        if (favoritesProducts && favoritesProducts.includes(item._id.toString())) {
          item.inFavorites = true;
        }
    
        if (cart && cart.includes(item._id.toString())) {
          item.inCart = true;
        }
    
        return item;
      });
    }
    
    res.render('catalog', {
      title: 'Каталог игр',
      isCatalog: true,
      products,
      categories,
      genres,
      activationServices,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/')
  }
}

export const gamePage = async (req, res) => {
  try {
    const {alias} = req.params;
    const product = await Product
      .findOne({alias})
      .populate([
        'extends',
        'languages',
        'activationRegions',
        'genres',
        'developers',
        'categories',
        'platformId',
        'activationServiceId',
        'publisherId',
        'reviews.userId'
      ]);
    const comments = await Comment
      .find({subjectId: product.id, ref: 'product'})
      .populate(['author'])
      .sort({'createdAt': -1})
      .limit(3);
    const countComments = await Comment.estimatedDocumentCount();
    const person = res.locals.person;
    const genreIds = product.genres.map(genre => genre._id);
    const recProductsFilter = { //Фильтры для подборки рекомендаций
      _id: {$ne: product._id}, //Отсеивает открытый продукт
      genres: {$in: genreIds}, //Находит продукты содержащие хотя бы один из жанров текущего товара
      $or: [ //"ИЛИ" для связок
        {bundleId: {$ne: null}, isOriginalInBundle: true}, //Если товар состоит в связке, то он должен быть исходным
        {bundleId: null}, //Иначе он не должен состоять в связке вовсе
      ],
    };
    let isProductNoReview = true;
    let isProductNotPurchased = true;
    let lastViewedProducts = [];
    let currentProductInCart = false;
    let bundleProducts = null;
    let seriesProducts = null;
  
    if (person) {
      const cart = person.cart;
      
      if (cart && cart.includes(product._id.toString())) {
        currentProductInCart = true;
      }
    }
  
    if (req.session.isAuth) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
      const order = await Order.findOne({status: 'paid', userId: res.locals.person._id, products: {$elemMatch: {productId: product._id}}});
  
      if (order) {
        isProductNotPurchased = false;
      }
      
      lastViewedProducts = await User.aggregate([
        {$match: {_id: res.locals.person._id}},
        {$project: {_id: 0, viewedProducts: 1}},
        {$unwind: '$viewedProducts'},
        {$match: {viewedProducts: {$ne: product._id}}},
        {$group: {_id: '$viewedProducts'}},
        {$limit: 7},
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'viewedProduct',
          },
        },
        {
          $project: {
            'viewedProduct._id': 1,
            'viewedProduct.alias': 1,
            'viewedProduct.name': 1,
            'viewedProduct.img': 1,
            'viewedProduct.priceTo': 1,
            'viewedProduct.priceFrom': 1,
            'viewedProduct.dsId': 1,
          },
        },
        {$unwind: '$viewedProduct'},
      ]);
  
      lastViewedProducts = lastViewedProducts.map(product => {
        if (favoritesProducts && favoritesProducts.includes(product._id.toString())) {
          product.viewedProduct.inFavorites = true;
        }
    
        if (cart && cart.includes(product._id.toString())) {
          product.viewedProduct.inCart = true;
        }
    
        return product;
      });
      
      isProductNoReview = product.reviews.findIndex(review => review.userId.id === res.locals.person.id) === -1;
      person.viewedProducts.push(product._id);
      await person.save();
    }
    
    let trailerId = null;
  
    if (product.trailerLink) {
      trailerId = product.trailerLink.split('v=')[1];
    }
    
    if (product.bundleId) {
      recProductsFilter.bundleId = {$ne: product.bundleId}; //Отсеиваем товары, которые выводятся в блоке связок
      bundleProducts = await Product
        .find({bundleId: product.bundleId})
        .sort({'priceFrom': 1})
        .populate('editionId', ['name'])
        .select(['name', 'alias', 'elements', 'editionId'])
        .lean();
  
      bundleProducts = bundleProducts.map(bundleProduct => {
        if (bundleProduct._id.toString() === product.id) {
          bundleProduct.isCurrent = true;
        }
        
        return bundleProduct;
      });
    }
    
    if (product.seriesId) {
      recProductsFilter.seriesId = {$ne: product.seriesId}; //Отсеиваем товары, которые есть в серии текущей игры
      seriesProducts = await Product
        .find({_id: {$ne: product.id}, seriesId: product.seriesId})
        .select(['name', 'alias', 'priceTo', 'priceFrom', 'img', 'dsId'])
        .lean();
    } else if (product.bundleId) {
      const originalProduct = await Product.findOne({bundleId: product.bundleId, isOriginalInBundle: true});
      
      if (originalProduct && originalProduct.seriesId) {
        recProductsFilter.seriesId = {$ne: originalProduct.seriesId}; //Отсеиваем товары, которые есть в серии исходной игры связки, если текущая не принадлежит серии
        seriesProducts = await Product
          .find({_id: {$ne: originalProduct.id}, seriesId: originalProduct.seriesId})
          .select(['name', 'alias', 'priceTo', 'priceFrom', 'img'])
          .lean();
      }
    }
    
    const recProducts = await Product.aggregate([
      {$match: recProductsFilter},
      {$project: {name: 1, alias: 1, dsId: 1, img: 1, priceTo: 1, priceFrom: 1}},
      {$sample: {size: 8}},
    ]);
  
    res.render('game', {
      title: "ICE Games -- магазин ключей",
      product,
      discount: getDiscount(product.priceTo, product.priceFrom),
      trailerId,
      isProductNotPurchased,
      isProductNoReview,
      comments,
      countComments,
      lastViewedProducts,
      currentProductInCart,
      bundleProducts,
      seriesProducts,
      recProducts,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/games');
  }
}