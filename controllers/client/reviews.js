import User from "../../models/User.js";
import Review from "../../models/Review.js";

export const reviewsPage = async (req, res) => {
  try {
    let lastViewedProducts = [];
    const bestReviews = await Review
      .find({
        active: true,
        status: 'taken',
        is_best: true
      })
      .limit(3)
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
        .populate('viewedProducts', ['alias', 'name', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock', 'preOrder'])
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
      title: 'Отзывы о магазине ICE GAMES',
      metaDescription: 'Место для ваших отзывов. Помогите нам стать лучше — напишите своё мнение о магазине компьютерных игр ICE GAMES.',
      ogPath: 'reviews',
      isReviews: true,
      breadcrumbs: [{
        name: 'Отзывы',
        current: true,
      }],
      lastViewedProducts,
      bestReviews,
      isProductNotPurchased: !req.session.isAuth
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}