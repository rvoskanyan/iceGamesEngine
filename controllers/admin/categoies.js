const {Category} = require('./../../models/index');

const pageCategories = async (req, res) => {
  res.json('Categories page');
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