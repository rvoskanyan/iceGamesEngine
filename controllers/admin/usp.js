import Usp from './../../models/Usp.js';

export const pageUsp = async (req, res) => {
  try {
    const usps = await Usp.find().select('text');
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список УТП',
      section: 'usp',
      elements: usps,
      addTitle: "Добавить УТП",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddUsp = async (req, res) => {
  res.render('addUsp', {layout: 'admin'});
}

export const addUsp = async (req, res) => {
  try {
    const {text} = req.body;
  
    await Usp.create({text});
    
    res.redirect('/admin/usp');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/usp/add');
  }
}