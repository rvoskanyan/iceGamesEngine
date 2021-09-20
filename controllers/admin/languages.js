const {Language} = require('./../../models/index');

const pageLanguages = async (req, res) => {
  res.json('Languages page');
}

const pageAddLanguage = async (req, res) => {
  res.render('addLanguage', {layout: 'admin'});
}

const addLanguage = async (req, res) => {
  try {
    const {name} = req.body;
  
    await Language.create({name});
  
    res.redirect('/admin/languages');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/languages/add');
  }
}

module.exports = {
  pageLanguages,
  pageAddLanguage,
  addLanguage,
}