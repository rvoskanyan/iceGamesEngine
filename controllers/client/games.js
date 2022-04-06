const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Genre = require('../../models/Genre');
const ActivationService = require('../../models/ActivationService');
const {getDiscount} = require("../../utils/functions");

const gamesPage = async (req, res) => {
  try {
    let products = await Product.find().select(['name', 'dsId', 'alias', 'img', 'priceTo', 'priceFrom']).lean().limit(20);
    const categories = await Category.find().select(['name']);
    const genres = await Genre.find().select(['name']);
    const activationServices = await ActivationService.find().select(['name']);
    
    if (req.session.isAuth) {
      const user = await User.findById(req.session.userId);
      const favoritesProducts = user.favoritesProducts;
      const cart = user.cart;
      
      if (favoritesProducts.length || cart.length) {
        products = products.map(item => {
          if (favoritesProducts.includes(item._id.toString())) {
            item.inFavorites = true;
          }
  
          if (cart.includes(item._id.toString())) {
            item.inCart = true;
          }
          
          return item;
        })
      }
    }
    
    res.render('catalog', {
      title: 'Каталог игр',
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

const gamePage = async (req, res) => {
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
      ]);
    
    let trailerId = null;
  
    if (product.trailerLink) {
      trailerId = product.trailerLink.split('v=')[1];
    }
  
    console.log(product);
    
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
      trailerId,
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

module.exports = {
  gamesPage,
  gamePage,
}