import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Genre from '../../models/Genre.js';
import ActivationService from '../../models/ActivationService.js';
import Order from '../../models/Order.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';

export const gamesPage = async (req, res) => {
  try {
    const categories = await Category.find().select(['name']);
    const genres = await Genre.find().select(['name']);
    const activationServices = await ActivationService.find().select(['name']);
    
    res.render('catalog', {
      title: 'ICE Games — Каталог игр',
      metaDescription: 'Каталог лучших игр со скидками от ICE Games',
      isCatalog: true,
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
        'reviews.userId',
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
  
      const viewedProductsResult = await User
        .findById(person._id)
        .select('viewedProducts')
        .slice('viewedProducts', 7)
        .populate('viewedProducts', ['alias', 'name', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock'])
        .lean();
  
      lastViewedProducts = viewedProductsResult.viewedProducts;
  
      lastViewedProducts = lastViewedProducts && lastViewedProducts.map(viewedProduct => {
        if (favoritesProducts && favoritesProducts.includes(viewedProduct._id.toString())) {
          viewedProduct.inFavorites = true;
        }
    
        if (cart && cart.includes(viewedProduct._id.toString())) {
          viewedProduct.inCart = true;
        }
        
        if (viewedProduct._id.toString() === product._id.toString()) {
          viewedProduct.currentPorductPage = true;
        }
    
        return viewedProduct;
      });
      
      isProductNoReview = product.reviews.findIndex(review => review.userId.id === res.locals.person.id) === -1;
      
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
  
    const seriesIsSlider = seriesProducts && seriesProducts.length > 5
    
    res.render('game', {
      title: `ICE Games — ${product.name}`,
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
    });
  } catch (e) {
    console.log(e);
    res.redirect('/games');
  }
}