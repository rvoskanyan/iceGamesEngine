const {Publisher} = require("./../../models/index");

const pagePublishers = async (req, res) => {
  try {
    const publishers = await Publisher.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список издателей',
      section: 'publishers',
      elements: publishers.map(item => item.dataValues),
      addTitle: "Добавить издателя",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddPublishers = async (req, res) => {
  res.render('addPublisher', {layout: 'admin'});
}

const addPublishers = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Publisher.create({name});
    
    res.redirect('/admin/publishers');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/publishers/add');
  }
}

module.exports = {
  pagePublishers,
  pageAddPublishers,
  addPublishers,
}