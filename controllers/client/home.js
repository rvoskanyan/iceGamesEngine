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
  
  res.render('home', {
    title: "ICE Games -- магазин ключей",
    sliderGames: sliderGames.map(item => item.dataValues),
    usp,
  });
}

module.exports = {
  renderHome,
};