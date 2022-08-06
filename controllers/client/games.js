import fetch from "node-fetch";

import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Genre from '../../models/Genre.js';
import ActivationService from '../../models/ActivationService.js';
import Order from '../../models/Order.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';
import Review from "../../models/Review.js";

export const gamesPage = async (req, res) => {
  try {
    const categories = await Category.find().select(['name']);
    const genres = await Genre.find().select(['name']);
    const activationServices = await ActivationService.find().select(['name']);
    
    res.render('catalog', {
      title: 'ICE GAMES — Каталог игр',
      metaDescription: 'Каталог лучших игр со скидками и удобным поиском. Топ продаж от магазина лицензионных ключей ICE GAMES.',
      isCatalog: true,
      noIndex: true,
      noIndexGoogle: true,
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
        'activationRegions',
        'genres',
        'categories',
        'platformId',
        'activationServiceId',
        'publisherId',
        'editionId',
        'dlcForId',
        {
          path: 'elements',
          populate: {
            path: 'productId',
            select: ['name', 'alias', 'img'],
          }
        }
      ]);
    const reviews = await Review
      .find({product: product._id, active: true})
      .limit(5)
      .sort({createdAt: -1})
      .select(['eval', 'text'])
      .populate([{
        path: 'user',
        select: ['login'],
      }])
      .lean();
    const countReviews = await Review.countDocuments({product: product._id, active: true});
    const countSales = product.inStock ? Math.floor(Math.floor(product.priceFrom) / 3 * 0.005 * (Math.floor(new Date().getHours() / 5)) * (product.top ? 1.3 : 1)) : 0;
    const comments = await Comment
      .find({subjectId: product.id, ref: 'product'})
      .populate(['author'])
      .sort({'createdAt': -1})
      .limit(3);
    const countComments = await Comment.estimatedDocumentCount();
    const person = res.locals.person;
    const genreIds = product.genres.map(genre => genre._id);
    const recProductsFilter = { //Фильтры для подборки рекомендаций
      _id: {$ne: product._id}, //Отсеивает товар, на котором сейчас находимся
      active: true,
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
    let subscribed = false;
    let favoritesProducts;
    let cart;
    let typeTrailerCover;
  
    if (person) {
      const email = person.email;
      const productId = product._id.toString();
      cart = person.cart;
      favoritesProducts = person.favoritesProducts;
      
      if (cart && cart.includes(productId)) {
        currentProductInCart = true;
      }
      
      if (product.subscribesInStock.includes(email)) {
        subscribed = true;
      }
    }
  
    if (req.session.isAuth) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
      const order = await Order.findOne({status: 'paid', userId: res.locals.person._id, products: {$elemMatch: {productId: product._id}}});
  
      if (order) {
        isProductNotPurchased = false;
      }
  
      const viewedProductsResult = await User
        .findById(person._id)
        .select('viewedProducts')
        .slice('viewedProducts', 7)
        .populate('viewedProducts', ['alias', 'name', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock'])
        .lean();
  
      lastViewedProducts = viewedProductsResult.viewedProducts;
  
      lastViewedProducts = lastViewedProducts && lastViewedProducts.map(viewedProduct => {
        const productId = viewedProduct._id.toString();
        
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          viewedProduct.inFavorites = true;
        }
    
        if (cart && cart.includes(productId)) {
          viewedProduct.inCart = true;
        }
        
        if (productId === product._id.toString()) {
          viewedProduct.currentPorductPage = true;
        }
    
        return viewedProduct;
      });
      
      isProductNoReview = await Review.find({product: product._id, user: res.locals.person._id});
      isProductNoReview = !isProductNoReview.length;
      
      let viewedProducts = person.viewedProducts;
      const viewedProductIndex = viewedProducts.findIndex(viewedProductId => {
        return viewedProductId.toString() === product._id.toString();
      });
      
      if (viewedProductIndex !== -1) {
        viewedProducts.splice(viewedProductIndex, 1);
      }
  
      viewedProducts.unshift(product._id);
      
      person.viewedProducts = viewedProducts;
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
        .select(['name', 'alias', 'elements', 'editionId'])
        .populate('editionId', ['name'])
        .lean();
  
      bundleProducts = bundleProducts.map(bundleProduct => {
        if (bundleProduct._id.toString() === product.id) {
          bundleProduct.isCurrent = true;
        }

        bundleProduct.moreElements = bundleProduct.elements.length - 5;
        bundleProduct.elements = bundleProduct.elements.slice(0, 5);
        
        return bundleProduct;
      });
    }
    
    if (product.seriesId) {
      recProductsFilter.seriesId = {$ne: product.seriesId}; //Отсеиваем товары, которые есть в серии текущей игры
      seriesProducts = await Product
        .find({_id: {$ne: product.id}, seriesId: product.seriesId, active: true})
        .select(['name', 'alias', 'priceTo', 'priceFrom', 'img', 'inStock'])
        .lean();
    } else if (product.bundleId) {
      const originalProduct = await Product.findOne({bundleId: product.bundleId, isOriginalInBundle: true});
      
      if (originalProduct && originalProduct.seriesId) {
        recProductsFilter.seriesId = {$ne: originalProduct.seriesId, active: true}; //Отсеиваем товары, которые есть в серии исходной игры связки, если текущая не принадлежит серии
        seriesProducts = await Product
          .find({_id: {$ne: originalProduct.id}, seriesId: originalProduct.seriesId, active: true})
          .select(['name', 'alias', 'priceTo', 'priceFrom', 'img', 'inStock'])
          .lean();
      }
    }
    
    let recProducts = await Product.aggregate([
      {$match: recProductsFilter},
      {$project: {name: 1, alias: 1, inStock: 1, img: 1, priceTo: 1, priceFrom: 1}},
      {$sample: {size: 8}},
    ]);
  
    recProducts = recProducts.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    })
  
    seriesProducts = seriesProducts && seriesProducts.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    })
  
    const seriesIsSlider = seriesProducts && seriesProducts.length > 5;
    
    if (trailerId) {
      const responseTrailerCover = await fetch(`https://img.youtube.com/vi/${trailerId}/maxresdefault.jpg`);
      const statusTrailerCover = responseTrailerCover.status;
      
      typeTrailerCover = statusTrailerCover === 404 ? 'mqdefault' : 'maxresdefault';
    }
    
    res.render('game', {
      title: `ICE GAMES — ${product.name}`,
      metaDescription: `Купить игру ${product.name} c активацией в ${product.activationServiceId.name} со скидкой. Широкий выбор лицензионных ключей с гарантией от поставщиков в ICE GAMES.`,
      typeTrailerCover,
      product,
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
      seriesIsSlider,
      subscribed,
      countSales,
      reviews,
      countReviews,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/games');
  }
}