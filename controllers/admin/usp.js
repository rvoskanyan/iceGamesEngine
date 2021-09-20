const {Usp} = require('./../../models/index');

const pageUsp = async (req, res) => {
  res.json("Usp page");
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