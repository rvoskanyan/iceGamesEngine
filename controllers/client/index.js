const {
  Product,
  Usp,
  Category,
  Genre,
} = require('../../models/index');

const renderHome = async (req, res) => {
  const games = await Product.findAll({limit: 5, offset: 6});
  const usp = await Usp.findAll();
  const genres = await Genre.findAll();
  const categories  = await Category.findAll();
  const gamesCategories = [];
  
  for (let i = 0; i < categories.length; i++) {
    gamesCategories.push(await categories[i].getProducts());
  }
  
  res.render('index', {
    title: "ICE Games -- магазин ключей",
    games,
    usp,
    categories,
    gamesCategories,
    genres,
  });
}

module.exports = {
  renderHome,
};