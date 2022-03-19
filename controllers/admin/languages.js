const Language = require('./../../models/Language');

const pageLanguages = async (req, res) => {
  try {
    const languages = await Language.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список языков',
      section: 'languages',
      elements: languages,
      addTitle: "Добавить язык",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
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