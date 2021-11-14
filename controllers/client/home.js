const {
  Product,
  Usp,
  Category,
  Genre,
} = require('../../models/index');
const Config = require('./../../config');

const renderHome = async (req, res) => {
  const sliderGames = await Product.findAll({
    attributes: ['id', 'name', 'description', 'priceTo', 'priceFrom', 'img', 'coverImg', 'coverVideo'],
    limit: 5,
    where: {
      inHomeSlider: true,
    }
  });
  const usp = await Usp.findAll({attributes: ['text']});
  const categories = await Category.findAll({attributes: ['id', 'name']});
  const genres = await Genre.findAll({attributes: ['id', 'name', 'img', 'url']});
  
  const catalog = [];
  
  for (let i = 0; i < categories.length; i++) {
    const products = await categories[i].getProducts({
      attributes: ['id', 'name', 'img', 'priceTo', 'priceFrom'],
      limit: 10,
    });
  
    catalog.push({
      ...categories[i].dataValues,
      products: products.map(item => item.dataValues),
    });
  }
  
  res.render('home', {
    title: "ICE Games -- магазин ключей",
    websiteAddress: Config.websiteAddress,
    isHome: true,
    sliderGames: sliderGames.map(item => item.dataValues),
    usp: usp.map(item => item.dataValues),
    genres: genres.map(item => item.dataValues),
    catalog,
  });
}

module.exports = {
  renderHome,
};