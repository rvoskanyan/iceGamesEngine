const {
  Product,
  Kit,
} = require('./../../models/index');

const pageGame = async (req, res) => {
  try {
    const {gameId} = req.params;
    const gameObject = await Product.findByPk(gameId);
    const kitsWithElements = [];
    const gameData = gameObject.dataValues;
    const countKeys = await gameObject.countKeys({where: {active: true}});
    const gameExtends = await gameObject.getExtends();
    const languages = await gameObject.getLanguages({attributes: ['name']});
    const regions = await gameObject.getRegions({attributes: ['name']});
    const activationService = await gameObject.getActivationService({attributes: ['name']});
    let kits = await gameObject.getKits();
    let mainGameId = null;
    let hasKits = false;
    
    if (!kits.length) {
      const kit = await gameObject.getKit();
      
      if (kit) {
        mainGameId = kit.dataValues.mainProductId;
        
        kits = await Kit.findAll({where: {mainProductId: mainGameId}});
      }
    }
    
    if (kits.length) {
      hasKits = true;
      
      for (let i = 0; i < kits.length; i++) {
        const kitObject = kits[i];
        const elements = await kitObject.getElementsKits();
        const nameKit = await kitObject.getNamesKit();
        const kitData = kitObject.dataValues;
        
        kitsWithElements.push({
          kit: kitData,
          elements: elements.map(item => item.dataValues.text),
          isCurrent: gameData.id === kitData.ProductId,
          nameKit: nameKit.dataValues.name,
        })
      }
    }
    
    res.render('game', {
      game: gameData,
      kits: kitsWithElements,
      inStock: countKeys > 0,
      gameExtends: gameExtends.map(item => item.dataValues),
      hasExtends: gameExtends.length > 0,
      languages: languages.map(item => item.dataValues),
      regions: regions.map(item => item.dataValues),
      activationService: activationService.dataValues,
      hasKits,
      mainGameId,
    });
  } catch (e) {
    res.json('Page error');
  }
}

module.exports = {
  pageGame,
}