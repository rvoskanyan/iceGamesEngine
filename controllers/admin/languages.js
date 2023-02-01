import Language from './../../models/Language.js';

export const pageLanguages = async (req, res) => {
  try {
    const languages = await Language.find().select(['name']).lean();
    
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

export const pageAddLanguage = async (req, res) => {
  res.render('addLanguage', {layout: 'admin'});
}

export const addLanguage = async (req, res) => {
  try {
    const {name} = req.body;
  
    await Language.create({name});
  
    res.redirect('/admin/languages');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/languages/add');
  }
}