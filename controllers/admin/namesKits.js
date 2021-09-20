const {NamesKit} = require('./../../models/index');

const pageNamesKits = async (req, res) => {
  res.json('Page names kits');
}

const pageAddNameKit = async (req, res) => {
  res.render('addNameKit', {layout: 'admin'});
}

const addNameKit = async (req, res) => {
  try {
    const {name} = req.body;
  
    await NamesKit.create({name});
  
    res.redirect('/admin/names-kits');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/names-kits/add');
  }
}

module.exports = {
  pageNamesKits,
  pageAddNameKit,
  addNameKit,
}