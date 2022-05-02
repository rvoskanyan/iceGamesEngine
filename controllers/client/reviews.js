import Product from "./../../models/Product.js";
import User from "../../models/User.js";

export const reviewsPage = async (req, res) => {
  try {
    let lastViewedProducts = [];
    const products = await Product.aggregate([
      {$unwind: '$reviews'},
      {$limit: 5},
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
          _id: 0,
          name: 1,
          alias: 1,
          'reviews.eval': 1,
          'reviews.text': 1,
          'reviews.user.login': 1,
        },
      },
      {$unwind: '$reviews.user'},
    ]);
  
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
        if (favoritesProducts && favoritesProducts.includes(product._id.toString())) {
          product.inFavorites = true;
        }
      
        if (cart && cart.includes(product._id.toString())) {
          product.inCart = true;
        }
      
        return product;
      });
    }
    
    res.render('reviews', {
      title: 'ICE Games — Отзывы',
      metaDescription: 'Страница со всеми отзывами к играм',
      isReviews: true,
      products,
      lastViewedProducts,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}