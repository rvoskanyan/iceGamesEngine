const {
  Product
} = require('./../../models/index');
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
    const genres = await game.getGenres();
    const platform = await game.getPlatform();
    const publisher = await game.getPublisher();
    
    const gameData = game.dataValues;
    
    gameData.discount = Math.floor(100 - gameData.priceTo / (gameData.priceFrom / 100));
  
    res.render('game', {
      title: "ICE Games -- магазин ключей",
      websiteAddress: Config.websiteAddress,
      game: gameData,
      hasExtends: !!gameExtends.length,
      extends: gameExtends.map(item => item.dataValues),
      languages: languages.map(item => item.dataValues),
      regions: regions.map(item => item.dataValues),
      service: service.dataValues,
      genres: genres.map(item => item.dataValues),
      platform: platform.dataValues,
      publisher: publisher.dataValues,
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