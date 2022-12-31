import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Genre from "../../models/Genre.js";
import Article from "../../models/Article.js";
import User from "../../models/User.js";
import Partner from "../../models/Partner.js";
import {achievementEvent} from "../../services/achievement.js";
import Review from "../../models/Review.js";
import Order from "../../models/Order.js";
import ProductCategory from "../../models/Product_Category.js";

export const homepage = async (req, res) => {
  const inviter = req.query.inviter;
  const successPayment = req.query.successPayment;
  
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
    .find({inHomeSlider: true, inStock: true})
    .limit(5)
    .select(['name', 'alias', 'description', 'priceTo', 'priceFrom', 'img', 'coverImg', 'coverVideo', 'discount', 'dsId'])
    .lean();
  const categories = await Category.find().select('name').lean();
  const genres = await Genre.find().select(['name', 'img', 'bgColor', 'alias']).sort({order: 1}).lean();
  const partners = await Partner.find().select(['name', 'img', 'link']).sort({createdAt: 1}).lean();
  const countReviews = await Review.countDocuments({active: true, status: 'taken'});
  const countProducts = await Product.countDocuments({active: true});
  const orders = await Order.find({status: 'paid'}).select(['products']).lean();
  const countSales = orders.reduce((countSales, order) => countSales + order.products.length, 9000);
  const articles = await Article
    .find({active: true})
    .sort({createdAt: -1})
    .select(['name', 'alias', 'introText', 'type', 'createdAt', 'img'])
    .limit(9);
  const checkEmailHash = req.query.confirmEmail;
  const catalog = [];
  const day = new Date().getDay();
  const countRecommend = await Product.countDocuments({active: true, top: true, inStock: true, priceTo: {$gt: 300}});
  const skipRecommend = day * 5 + 5;
  let recommend = await Product
    .find({active: true, top: true, inStock: true, priceTo: {$gt: 300}})
    .select(['name', 'alias', 'priceTo', 'priceFrom', 'img', 'dsId', 'inStock'])
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
    .find({preOrder: false, active: true})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock'])
    .sort({'releaseDate': -1})
    .limit(10)
    .lean();
  
  const preOrders = await Product
    .find({preOrder: true, active: true})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock'])
    .limit(10)
    .lean();
  
  const discounts = await Product
    .find({discount: {$gt: 60}, active: true, inStock: true})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock'])
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
        }
      },
      {
        $sort: {
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
        }
      }
    ]);
    
    catalog.push({
      category,
      products,
    });
  }
  
  catalog.push({
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
  
  catalog.push({
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
  
  catalog.push({
    category: {name: 'Предзаказы'},
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
    title: 'Купить лицензионные ключи Steam в магазине компьютерных игр ICE GAMES',
    metaDescription: 'Магазин лицензионных ключей ICE GAMES. Более 2000 игр в каталоге, 16 жанров, сервисная поддержка, активация в Steam, Origin, Epic Games, GOG и других сервисах. Увлекательные статьи и большое активное комьюнити.',
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
  });
}