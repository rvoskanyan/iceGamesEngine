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
    
      lastViewedProducts = await User.aggregate([
        {$match: {_id: res.locals.person._id}},
        {$project: {_id: 0, viewedProducts: 1}},
        {$unwind: '$viewedProducts'},
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
    }
    
    res.render('reviews', {
      title: 'ICE Games -- Отзывы',
      isReviews: true,
      products,
      lastViewedProducts,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}