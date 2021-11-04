const {Developer} = require("./../../models/index");

const pageDevelopers = async (req, res) => {
  try {
    const developers = await Developer.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список разработчиков',
      section: 'developers',
      elements: developers.map(item => item.dataValues),
      addTitle: "Добавить разработчика",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddDeveloper = async (req, res) => {
  res.render('addDeveloper', {layout: 'admin'});
}

const addDeveloper = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Developer.create({name});
    
    res.redirect('/admin/developers');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/developers/add');
  }
}

module.exports = {
  pageDevelopers,
  pageAddDeveloper,
  addDeveloper,
}