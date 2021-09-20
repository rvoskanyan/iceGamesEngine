const {
  Product,
  Key, Category,
} = require('./../../models/index');

const pageKeys = async (req, res) => {
  res.json('Keys page');
}

const pageAddKey = async (req, res) => {
  try {
    const games = await Product.findAll({attributes: ['id', 'name']});
  
    res.render('addKey', {
      layout: 'admin',
      games: games.map(item => item.dataValues),
    });
  } catch (e) {
    console.log(e);
    res.json('Page error');
  }
}

const addKey = async (req, res) => {
  try {
    console.log(req.body);
    const {key, gameId} = req.body;
  
    console.log(key);
    
    await Key.create({key, productId: gameId});
    
    res.redirect('/admin/keys');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/keys/add');
  }
}

module.exports = {
  pageKeys,
  pageAddKey,
  addKey,
}