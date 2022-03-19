const Bunch = require('./../../models/Bunch');

const pageBunches = async (req, res) => {
  try {
    const bunches = await Bunch.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список связок',
      section: 'bunches',
      elements: bunches,
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
    const {gameId, orderInBundle, isOriginalInBundle} = req.body;
    const values = {bunchId};
    
    if (isOriginalInBundle) {
      const currentOriginal = await Product.findAll({
        attributes: ['id'],
        where: {
          bunchId,
          isOriginalInBundle: true,
        }
      });
      
      if (currentOriginal) {
        await currentOriginal.update({isOriginalInBundle: false});
      }
  
      values.isOriginalInBundle = true;
    }
    
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

const pageEditProductBunch = async (req, res) => {
  const {bunchId, productId} = req.params;
  
  try {
    const game = await Product.findByPk(productId, {attributes: ['id', 'name', 'orderInBundle', 'isOriginalInBundle']});
    
    res.render('addProductBunch', {
      layout: 'admin',
      title: 'Редактирование игры связки',
      game: game.dataValues,
      isEdit: true,
      bunchId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bunches/edit/${bunchId}`);
  }
}

const editProductBunch = async (req, res) => {
  const {bunchId, productId} = req.params;
  
  try {
    const {orderInBundle, isOriginalInBundle} = req.body;
    const values = {};
  
    if (orderInBundle) {
      values.orderInBundle = orderInBundle;
    }
  
    if (isOriginalInBundle) {
      const currentOriginal = await Product.findAll({
        attributes: ['id'],
        where: {
          bunchId,
          isOriginalInBundle: true,
        }
      });
    
      if (currentOriginal.length) {
        await currentOriginal[0].update({isOriginalInBundle: false});
      }
    
      values.isOriginalInBundle = true;
    }
    
    await Product.update(values, {
      where: {
        id: productId,
      }
    })
    
    res.redirect(`/admin/bunches/edit/${bunchId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bunches/${bunchId}/${productId}`);
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
  pageEditProductBunch,
  editProductBunch,
}