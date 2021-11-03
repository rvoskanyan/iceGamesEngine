const {Language} = require('./../../models/index');

const pageLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список языков',
      section: 'languages',
      elements: languages.map(item => item.dataValues),
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