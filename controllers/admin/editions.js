/*const {Edition} = require("./../../models/index");*/

const pageEditions = async (req, res) => {
  try {
    const editions = await Edition.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список версий',
      section: 'editions',
      elements: editions.map(item => item.dataValues),
      addTitle: "Добавить версию",
    });
  } catch (e) {
    res.redirect('/admin')
  }
}

const pageAddEdition = async (req, res) => {
  res.render('addEdition', {
    layout: 'admin',
    title: 'Добавление новой версии',
  })
}

const addEdition = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Edition.create({name});
    
    res.redirect('/admin/editions');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/editions/add');
  }
}

module.exports = {
  pageEditions,
  pageAddEdition,
  addEdition,
}