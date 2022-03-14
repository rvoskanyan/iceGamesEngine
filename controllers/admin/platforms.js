/*const {Platform} = require("./../../models/index");*/


const pagePlatforms = async (req, res) => {
  try {
    const platforms = await Platform.findAll();
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список платформ',
      section: 'platforms',
      elements: platforms.map(item => item.dataValues),
      addTitle: "Добавить платформу",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddPlatform = async (req, res) => {
  res.render('addPlatform', {
    layout: 'admin',
    title: 'Добавление новой платформы',
  });
}

const addPlatform = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Platform.create({name});
    
    res.redirect('/admin/platforms');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/platforms/add');
  }
}

module.exports = {
  pagePlatforms,
  pageAddPlatform,
  addPlatform,
}