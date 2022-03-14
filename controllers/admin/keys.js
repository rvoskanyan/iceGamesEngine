/*const {
  Product,
  Key,
} = require('./../../models/index');*/

const pageKeys = async (req, res) => {
  try {
    const keys = await Key.findAll({attributes: ['id', 'key']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список ключей',
      section: 'keys',
      elements: keys.map(item => item.dataValues),
      addTitle: "Добавить ключ",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
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
    const {key, gameId} = req.body;
    
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