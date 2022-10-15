import fetch from "node-fetch";

import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Genre from '../../models/Genre.js';
import ActivationService from '../../models/ActivationService.js';
import Order from '../../models/Order.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';
import Review from "../../models/Review.js";
import Article from "../../models/Article.js";

export const gamesPage = async (req, res) => {
  try {
    const categories = await Category.find().select(['name']);
    const genres = await Genre.find().select(['name']);
    const activationServices = await ActivationService.find().select(['name']);
    
    res.render('catalog', {
      title: 'Каталог игр ICE GAMES',
      metaDescription: 'Каталог лучших игр со скидками и удобным поиском. Топ продаж от магазина лицензионных ключей ICE GAMES.',
      isCatalog: true,
      noIndex: true,
      noIndexGoogle: true,
      categories,
      genres,
      activationServices,
      breadcrumbs: [{
        name: 'Каталог',
        current: true,
      }],
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
          path: 'recommends',
          select: ['name', 'alias', 'inStock', 'img', 'priceTo', 'priceFrom'],
        },
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
    
    if (!product.active) {
      return res.status(404).render('404', {
        title: 'ICE GAMES — Страница не найдена',
        breadcrumbs: [{
          name: 'Страница не найдена',
          current: true,
        }],
      });
    }
    
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
    const maxPrice = await Product.findOne({active: true}).sort({priceTo: -1}).select(['priceTo']).lean();
    const scatter = 600;
    const articles = await Article
      .find({products: {$in: [product._id.toString()]}})
      .select(['alias', 'img', 'name', 'type', 'created', 'createdAt', 'introText']);
    const rangePriceRecProducts = product.priceTo > scatter
      ? product.priceTo >= maxPrice.priceTo - scatter
        ? {min: product.priceTo - scatter - (product.priceTo - (maxPrice.priceTo - scatter)), max: maxPrice.priceTo}
        : {min: product.priceTo - scatter, max: product.priceTo + scatter}
      : {min: 0, max: scatter - product.priceTo + scatter};
    const recProductsFilter = { //Фильтры для подборки рекомендаций
      _id: {$ne: product._id}, //Отсеивает товар, на котором сейчас находимся
      inStock: true,
      active: true,
      genres: {$in: genreIds}, //Находит продукты содержащие хотя бы один из жанров текущего товара
      $and: [
        {priceTo: {$gte: rangePriceRecProducts.min}},
        {priceTo: {$lte: rangePriceRecProducts.max}},
      ],
      /*$or: [ //"ИЛИ" для связок
        {bundleId: {$ne: null}, isOriginalInBundle: true}, //Если товар состоит в связке, то он должен быть исходным
        {bundleId: null}, //Иначе он не должен состоять в связке вовсе
      ],*/
    };
    let isProductNoReview = true;
    let isProductNotPurchased = true;
    let lastViewedProducts = [];
    let currentProductInCart = false;
    let currentProductInFavorite = false;
    let bundleProducts = null;
    let seriesProducts = null;
    let subscribed = false;
    let favoritesProducts;
    let cart;
    let typeTrailerCover;
    let additions = await Product
      .find({dlc: true, dlcForId: product._id})
      .select(['name', 'img', 'priceTo', 'priceFrom', 'dlc', 'inStock', 'alias'])
      .lean();
  
    if (person) {
      const email = person.email;
      const productId = product._id.toString();
      
      cart = person.cart;
      favoritesProducts = person.favoritesProducts;
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        currentProductInFavorite = true;
      }
      
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
    
    let recProducts = product.recommends.map(item => {
      return {...item.toObject()};
    });
    
    if (recProducts.length < 8) {
      const dopRect = await Product
        .find(recProductsFilter)
        .select(['name', 'alias', 'inStock', 'img', 'priceTo', 'priceFrom'])
        .limit(8 - recProducts.length)
        .lean();
      
      recProducts = [...recProducts, ...dopRect];
    }
  
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
  
    additions = additions.map(item => {
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
      title: `Купить лицензионный ключ ${product.name} для ${product.activationServiceId.name} по цене ${product.priceTo}₽. в магазине ICE GAMES`,
      metaDescription: `${product.name} дешево для активации в ${product.activationServiceId.name}. Лицензионный ключ в магазине ICE GAMES со скидкой. Мгновенная доставка ключа активации на почту. Оплата удобным способом.`,
      typeTrailerCover,
      product,
      trailerId,
      isProductNotPurchased,
      isProductNoReview,
      comments,
      countComments,
      lastViewedProducts,
      currentProductInCart,
      currentProductInFavorite,
      bundleProducts,
      seriesProducts,
      recProducts,
      seriesIsSlider,
      subscribed,
      countSales,
      reviews,
      countReviews,
      articles,
      additions,
      ogImage: product.img,
      breadcrumbs: [
        {
          name: 'Каталог',
          path: 'games',
        },
        {
          name: product.name,
          current: true,
        },
      ],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/games');
  }
}