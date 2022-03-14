/*const {
  Product,
  Usp,
  Category,
  Genre,
} = require('../../models/index');*/

const homepage = async (req, res) => {
  /*const sliderGames = await Product.findAll({
    attributes: ['id', 'name', 'description', 'priceTo', 'priceFrom', 'img', 'coverImg', 'coverVideo'],
    limit: 5,
    where: {
      inHomeSlider: true,
    }
  });
  const usp = await Usp.findAll({attributes: ['text']});
  const categories = await Category.findAll({attributes: ['id', 'name']});
  const genres = await Genre.findAll({attributes: ['id', 'name', 'img', 'url']});*/
  
  /*const catalog = [];
  
  for (let i = 0; i < categories.length; i++) {
    const products = await categories[i].getProducts({
      attributes: ['id', 'name', 'img', 'priceTo', 'priceFrom'],
      limit: 10,
    });
  
    catalog.push({
      ...categories[i].dataValues,
      products: products.map(item => item.dataValues),
    });
  }*/
  
  const inviter = req.query.inviter;
  
  if (inviter && !req.session.isAuth) {
    res.cookie('inviterId', inviter).redirect('/');
  }
  
  res.render('home', {
    title: "ICE Games -- магазин ключей",
    isHome: true,
    sliderGames: [],
    usp: [],
    genres: [],
    catalog: [],
  });
}

module.exports = {
  homepage,
};