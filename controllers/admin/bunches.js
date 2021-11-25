const {
  Bunch,
  Product,
} = require('./../../models/index');

const pageBunches = async (req, res) => {
  try {
    const bunches = await Bunch.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список связок',
      section: 'bunches',
      elements: bunches.map(item => item.dataValues),
      addTitle: "Добавить связку",
    });
  } catch (e) {
    res.redirect('/admin')
  }
}

const pageAddBunch = async (req, res) => {
  res.render('addBunch', {
    layout: 'admin',
    title: 'Добавление новой связки',
  })
}

const addBunch = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Bunch.create({name});
    
    res.redirect('/admin/bunches');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/bunches/add');
  }
}

const pageEditBunch = async (req, res) => {
  try {
    const {id} = req.params;
    const bunch = await Bunch.findByPk(id, {attributes: ['id', 'name']});
    const games = await bunch.getProducts({attributes: ['id', 'name']});
  
    res.render('addBunch', {
      layout: 'admin',
      title: 'Добавление новой связки',
      bunch: bunch.dataValues,
      isEdit: true,
      games: games.map(item => item.dataValues),
    })
  } catch (e) {
    console.log(e);
    res.redirect('/admin/bunches');
  }
}

const editBunch = async (req, res) => {
  const {id} = req.params;
  
  try {
    const {name} = req.body;
    
    await Bunch.update({name}, {
      where: {
        id,
      }
    });
    
    res.redirect('/admin/bunches');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bunches/edit/${id}`);
  }
}

const pageAddProductBunch = async (req, res) => {
  const {bunchId} = req.params;
  
  try {
    const games = await Product.findAll({attributes: ['id', 'name'],
      where: {
        bunchId: null,
      }
    });
    
    res.render('addProductBunch', {
      layout: 'admin',
      title: 'Добавление новой игры в связку',
      games: games.map(item => item.dataValues),
      bunchId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bunches/edit/${bunchId}`);
  }
}

const addProductBunch = async (req, res) => {
  const {bunchId} = req.params;
  
  try {
    const {gameId, orderInBundle} = req.body;
    const values = {bunchId};
    
    if (orderInBundle) {
      values.orderInBundle = orderInBundle;
    }
    
    await Product.update(values, {
      where: {
        id: gameId,
      }
    });
  
    res.redirect(`/admin/bunches/edit/${bunchId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bunches/${bunchId}/addProduct`);
  }
}

module.exports = {
  pageBunches,
  pageAddBunch,
  addBunch,
  pageEditBunch,
  editBunch,
  pageAddProductBunch,
  addProductBunch,
}