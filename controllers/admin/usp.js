const Usp = require('./../../models/Usp');

const pageUsp = async (req, res) => {
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

const pageAddUsp = async (req, res) => {
  res.render('addUsp', {layout: 'admin'});
}

const addUsp = async (req, res) => {
  try {
    const {text} = req.body;
  
    await Usp.create({text});
    
    res.redirect('/admin/usp');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/usp/add');
  }
}

module.exports = {
  pageUsp,
  pageAddUsp,
  addUsp,
}