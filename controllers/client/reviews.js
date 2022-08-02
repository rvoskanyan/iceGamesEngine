import Product from "./../../models/Product.js";
import User from "../../models/User.js";
import Review from "../../models/Review.js";

export const reviewsPage = async (req, res) => {
  try {
    let lastViewedProducts = [];
    const products = await Product.aggregate([
      {$unwind: '$reviews'},
      {$sort: {createdAt: 1}},
      {
        $lookup: {
          from: 'users',
          localField: 'reviews.userId',
          foreignField: '_id',
          as: 'reviews.user',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          alias: 1,
          'reviews.eval': 1,
          'reviews.text': 1,
          'reviews.user.login': 1,
          'reviews.user._id': 1,
        },
      },
      {$unwind: '$reviews.user'},
    ]);
    
    for (const item of products) {
      const candidate = await Review.find({product: item._id, user: item.reviews.user._id});
      
      if (candidate.length) {
        continue;
      }
      
      const review  = new Review({
        user: item.reviews.user._id,
        product: item._id,
        eval: item.reviews.eval,
        text: item.reviews.text,
      });
  
      await review.save();
    }
  
    const reviews = await Review
      .find({active: true})
      .limit(5)
      .sort({createdAt: -1})
      .select(['eval', 'text'])
      .populate([
        {
          path: 'product',
          select: ['name', 'alias'],
        },
        {
          path: 'user',
          select: ['login'],
        }
      ])
      .lean();
  
    if (req.session.isAuth) {
      const person = res.locals.person;
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
  
      const {viewedProducts} = await User
        .findById(person._id)
        .select('viewedProducts')
        .slice('viewedProducts', 7)
        .populate('viewedProducts', ['alias', 'name', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock'])
        .lean();
    
      lastViewedProducts = viewedProducts && viewedProducts.map(product => {
        const productId = product._id.toString();
        
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          product.inFavorites = true;
        }
      
        if (cart && cart.includes(productId)) {
          product.inCart = true;
        }
      
        return product;
      });
    }
    
    res.render('reviews', {
      title: 'ICE GAMES — Отзывы',
      metaDescription: 'Место для ваших отзывов. Помогите нам стать лучше — напишите своё мнение о магазине компьютерных игр ICE GAMES.',
      isReviews: true,
      reviews,
      lastViewedProducts,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}