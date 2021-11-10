const {
  Product,
  Usp,
  Category,
  Genre,
} = require('../../models/index');

const renderHome = async (req, res) => {
  const sliderGames = await Product.findAll({
    attributes: ['id', 'name', 'description', 'price', 'img', 'coverImg', 'coverVideo'],
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
      attributes: ['id', 'name', 'img', 'price'],
      limit: 10,
    });
  
    catalog.push({
      ...categories[i].dataValues,
      products: products.map(item => item.dataValues),
    });
  }
  
  res.render('home', {
    title: "ICE Games -- магазин ключей",
    sliderGames: sliderGames.map(item => item.dataValues),
    usp: usp.map(item => item.dataValues),
    genres: genres.map(item => item.dataValues),
    catalog,
  });
}

module.exports = {
  renderHome,
};