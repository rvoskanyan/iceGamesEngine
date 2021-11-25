const {
  Product,
  GameElement,
  Edition,
} = require('./../../models/index');
const {getDiscount} = require("../../utils/functions");
const Config = require('./../../config');

const gamesPage = async (req, res) => {

}

const gamePage = async (req, res) => {
  try {
    const {gameId} = req.params;
    const game = await Product.findByPk(gameId);
    const gameExtends = await game.getExtends();
    const languages = await game.getLanguages();
    const regions = await game.getRegions();
    const service = await game.getActivationService();
    const stages = await service.getActivationStages();
    const genres = await game.getGenres();
    const platform = await game.getPlatform();
    const publisher = await game.getPublisher();
    const images = await game.getImages({attributes: ['name']});
    const bunch = await game.getBunch({attributes: ['id']});
    const gameData = game.dataValues;
    let gameElements = null;
    let gameEdition = null;
    let gamesBunch = null;
    
    if (bunch) {
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
    
    gameData.discount = getDiscount(gameData.priceTo, gameData.priceFrom);
  
    res.render('game', {
      title: "ICE Games -- магазин ключей",
      websiteAddress: Config.websiteAddress,
      game: gameData,
      hasExtends: !!gameExtends.length,
      extends: gameExtends.map(item => item.dataValues),
      languages: languages.map(item => item.dataValues),
      regions: regions.map(item => item.dataValues),
      service: service.dataValues,
      stages: stages.map(item => item.dataValues),
      genres: genres.map(item => item.dataValues),
      platform: platform.dataValues,
      publisher: publisher.dataValues,
      images: images.map(item => item.dataValues),
      gamesBunch,
      gameEdition,
      gameElements,
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