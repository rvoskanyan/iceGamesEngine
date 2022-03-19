const Category = require('./../../models/Category');

const pageCategories = async (req, res) => {
  try {
    const categories = await Category.find().select(['name']);
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список категорий',
      section: 'categories',
      elements: categories,
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
    const category = new Category({name});
    
    await category.save();
    
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