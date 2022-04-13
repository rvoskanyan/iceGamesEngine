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
        'bunchId',
        'seriesId',
        'reviews.userId'
      ]);
    const comments = await Comment
      .find({subjectId: product.id, ref: 'product'})
      .populate(['author'])
      .sort({'createdAt': -1})
      .limit(3);
    const countComments = await Comment.estimatedDocumentCount();
    let isProductNoReview = true;
    let isProductNotPurchased = true;
    let lastViewedProducts = [];
  
    if (req.session.isAuth) {
      const person = res.locals.person;
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
      
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
    
    if (req.session.isAuth) {
      const order = await Order.findOne({status: 'paid', userId: res.locals.person._id, products: {$elemMatch: {productId: product._id}}});
      
      if (order) {
        isProductNotPurchased = false;
      }
    }
    
    let trailerId = null;
  
    if (product.trailerLink) {
      trailerId = product.trailerLink.split('v=')[1];
    }
    
    /*if (bunch) {
      gamesBunch = await bunch.getProducts({
        attributes: ['id', 'name'],
        order: [['orderInBundle', 'DESC']],
        include: [
          {
            model: GameElement,
            separate: true,
            attributes: ['name'],
            order: [['productId', 'DESC']],
            include: {
              model: Product,
              as: 'Entity',
              attributes: ['id', 'name'],
            },
          },
          {
            model: Edition,
            attributes: ['name'],
          },
        ]
      });
  
      gamesBunch = gamesBunch.map(item => {
        const gameData = item.dataValues;
        const values = {};
  
        if (item.Edition) {
          values.edition = item.Edition.dataValues.name;
        }
        
        if (+gameData.id === +gameId) {
          values.isCurrent = true;
          
          if (values.edition) {
            gameEdition = values.edition;
          }
          
          if (item.GameElements) {
            gameElements = item.GameElements.map(item => {
              const dataValues = item.dataValues;
  
              if (!dataValues.Entity) {
                return dataValues;
              }
  
              const gameData = dataValues.Entity.dataValues;
  
              return {
                id: dataValues.id,
                gameId: gameData.id,
                name: gameData.name,
              };
            })
          }
          
          return values;
        }
        
        values.id = gameData.id;
        values.name = gameData.name;
        
        if (item.GameElements) {
          values.elements = item.GameElements.map(item => {
            const dataValues = item.dataValues;
  
            if (!dataValues.Entity) {
              return dataValues;
            }
            
            return {
              name: dataValues.Entity.dataValues.name,
            };
          })
        }
        
        return values;
      });
    }
    
    if (series) {
      gamesSeries = await series.getProducts({attributes: ['id', 'name', 'img', 'priceTo', 'priceFrom']});
    } else if (bunch) {
      const seriesIdOnBundle = await Product.findAll({
        attributes: ['seriesId'],
        where: {
          bunchId: bunch.dataValues.id,
          isOriginalInBundle: true,
        }
      });
      
      if (seriesIdOnBundle.length) {
        gamesSeries = await Product.findAll({
          attributes: ['id', 'name', 'img', 'priceTo', 'priceFrom'],
          where: {
            seriesId: seriesIdOnBundle[0].dataValues.seriesId,
          }
        });
      }
    }
    
    if (gamesSeries) {
      gamesSeries = gamesSeries.map(item => item.dataValues);
    }
    
    gameData.discount = getDiscount(gameData.priceTo, gameData.priceFrom);*/
  
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
      /*
      gamesBunch,
      gameEdition,
      */
    });
  } catch (e) {
    console.log(e);
    res.redirect('/games');
  }
}