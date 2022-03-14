/*
const {Category} = require('./../../models/index');
*/

const pageCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({attributes: ['id', 'name']});
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список категорий',
      section: 'categories',
      elements: categories.map(item => item.dataValues),
      addTitle: "Добавить категорию",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddCategories = async (req, res) => {
  res.render('addCategories', {layout: 'admin'});
}

const addCategories = async (req, res) => {
  try {
    const {name} = req.body;
  
    await Category.create({name});
    
    res.redirect('/admin/categories');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/categories/add');
  }
}

module.exports = {
  pageCategories,
  pageAddCategories,
  addCategories,
}