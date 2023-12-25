import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Genre from "../../models/Genre.js";
import Article from "../../models/Article.js";
import User from "../../models/User.js";
import Partner from "../../models/Partner.js";
import { achievementEvent } from "../../services/achievement.js";
import Review from "../../models/Review.js";
import Order from "../../models/Order.js";
import ProductCategory from "../../models/Product_Category.js";
import Selection from "../../models/Selection.js";

export const homepage = async (req, res) => {
  const platform = req.platform || 'pc';
  const inviter = req.query.inviter;
  const successPayment = req.query.successPayment;
  
  let title = '';
  let metaDescription = '';
  
  switch (platform) {
    case 'pc': {
      title = 'Купить лицензионные ключи Steam в магазине компьютерных игр ICE GAMES';
      metaDescription = 'ICE GAMES - магазин лицензионных ключей активации, предоставляющий удобную корзину с возможностью купить как один ключ так и несколько за одну транзакцию с моментальной доставкой и гарантией для таких сервисов, как Steam, Origin, Epic Games, GOG, Uplay, Battle.net и других, для более, чем 2000 наименований игр в 16 различных жанрах. Сервисная поддержка, увлекательные статьи и большое активное комьюнити гарантированны!';
  
      break;
    }
    case 'xbox': {
      title = 'Купить лицензионные ключи XBOX в магазине видеоигр ICE GAMES';
      metaDescription = 'ICE GAMES - магазин лицензионных ключей активации для XBOX, предоставляющий удобную корзину с возможностью купить как один ключ так и несколько за одну транзакцию с моментальной доставкой и гарантией. Более 2000 наименований игр в 16 различных жанрах. Сервисная поддержка, увлекательные статьи и большое активное комьюнити гарантированны!';
    
      break;
    }
  }
  
  if (inviter) {
    if (!req.session.isAuth) {
      res.cookie('inviterId', inviter);
    }
    
    return res.redirect('/');
  }
  
  if (Object.keys(req.query).length && !req.query.confirmEmail && !req.query.successPayment) {
    return res.redirect('/');
  }
  
  const person = res.locals.person;
  let favoritesProducts;
  let cart;
  let sliderProducts = await Product
    .find({ inHomeSlider: true, inStock: true, platformType: platform })
    .limit(5)
    .select(['name', 'alias', 'description', 'priceTo', 'priceFrom', 'img', 'coverImg', 'coverVideo', 'discount', 'dsId'])
    .lean();
  const categories = await Category.find().select('name').lean();
  const genres = await Genre.find().select(['name', 'img', 'bgColor', 'alias']).sort({order: 1}).lean();
  const partners = await Partner.find().select(['name', 'img', 'link']).sort({createdAt: 1}).lean();
  const countReviews = await Review.countDocuments({active: true, status: 'taken'});
  const countProducts = await Product.countDocuments({active: true});
  const orders = await Order.find({status: 'paid'}).select(['items']).lean();
  const countSales = orders.reduce((countSales, order) => countSales + order.items.length, 5000);
  const articles = await Article
    .find({active: true})
    .sort({createdAt: -1})
    .select(['name', 'alias', 'introText', 'type', 'createdAt', 'img'])
    .limit(9);
  const selections = await Selection
    .find({ inHome: true })
    .limit(4)
    .populate([{
      path: 'products',
      select: ['platformType'],
    }])
    .lean();
  const checkEmailHash = req.query.confirmEmail;
  const catalog = [];
  const day = new Date().getDay();
  const countRecommend = await Product.countDocuments({
    active: true,
    top: true,
    inStock: true,
    priceTo: {$gt: 300},
    platformType: platform,
  });
  const skipRecommend = day * 5 + 5;
  let recommend = await Product
    .find({ active: true, top: true, inStock: true, priceTo: {$gt: 300}, platformType: platform })
    .select(['name', 'alias', 'priceTo', 'priceFrom', 'img', 'dsId', 'inStock', 'preOrder'])
    .skip(countRecommend > skipRecommend ? skipRecommend : countRecommend > 5 ? countRecommend  - 5 : countRecommend)
    .limit(5)
    .lean();
  let checkedEmail = false;
  
  if (person) {
    cart = person.cart;
    favoritesProducts = person.favoritesProducts
    
    sliderProducts = sliderProducts.map(product => {
      if (cart && cart.includes(product._id.toString())) {
        product.inCart = true;
      }
      
      return product;
    });
  
    recommend = recommend.map(product => {
      if (cart && cart.includes(product._id.toString())) {
        product.inCart = true;
      }
  
      if (favoritesProducts && favoritesProducts.includes(product._id.toString())) {
        product.inFavorites = true;
      }
  
      return product;
    })
  }
  
  if (checkEmailHash) {
    const user = await User.findOne({checkEmailHash});
    
    if (user) {
      if (user.inviter) {
        const inviter = await User.findById(user.inviter);
    
        if (inviter) {
          await inviter.increaseRating(5);
          await achievementEvent('friendInvitation', inviter);
        }
  
        user.inviter = undefined;
      }
  
      user.checkEmailHash = undefined;
      user.emailChecked = true;
  
      await user.save();
  
      checkedEmail = true;
    }
  }
  
  const noveltiesProduct = await Product
    .find({preOrder: false, active: true, platformType: platform})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock', 'preOrder'])
    .sort({'releaseDate': -1})
    .limit(10)
    .lean();
  
  const preOrders = await Product
    .find({preOrder: true, active: true, platformType: platform})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock', 'preOrder'])
    .sort({'createdAt': -1})
    .limit(10)
    .lean();
  
  const discounts = await Product
    .find({discount: {$gt: 60}, active: true, inStock: true, platformType: platform})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock', 'preOrder'])
    .sort({'priceFrom': -1})
    .limit(10)
    .lean();
  
  for (let category of categories) {
    const products = await ProductCategory.aggregate([
      {
        $match: {
          category: category._id,
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        }
      },
      {
        $unwind: '$product',
      },
      {
        $match: {
          'product.inStock': true,
          'product.active': true,
          'product.platformType': platform,
        }
      },
      {
        $sort: {
          'product.countKeys': -1,
          order: 1,
          'product.createdAt': -1,
        }
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          alias: '$product.alias',
          img: '$product.img',
          priceTo: '$product.priceTo',
          priceFrom: '$product.priceFrom',
          dlc: '$product.dlc',
          inStock: '$product.inStock',
          preOrder: '$product.preOrder',
        }
      }
    ]);
    
    if (!products.length) {
      continue;
    }
    
    catalog.push({
      category,
      products: products.map(item => {
        const productId = item._id.toString();
  
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          item.inFavorites = true;
        }
  
        if (cart && cart.includes(productId)) {
          item.inCart = true;
        }
  
        return item;
      }),
    });
  }
  
  noveltiesProduct.length && catalog.push({
    category: {name: 'Новинки'},
    products: noveltiesProduct.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    }),
  })
  
  discounts.length && catalog.push({
    category: {name: 'Скидки'},
    products: discounts.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    }),
  })
  
  preOrders.length && catalog.push({
    category: {name: 'Скоро'},
    products: preOrders.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    }),
  });
  
  res.render('home', {
    title,
    metaDescription,
    noIndex: !!checkEmailHash,
    noIndexGoogle: !!checkEmailHash,
    isHome: true,
    successPayment: successPayment === 'true',
    sliderProducts,
    catalog,
    genres,
    articles,
    checkedEmail,
    partners,
    countProducts,
    countReviews,
    countSales,
    recommend,
    selections: selections.map(selection => ({
      ...selection,
      products: selection.products.filter(product => product.platformType === platform)
    })),
  });
}