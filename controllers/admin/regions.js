const {Region} = require('./../../models/index');

const pageRegions = async (req, res) => {
  try {
    const regions = await Region.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список регионов',
      section: 'regions',
      elements: regions.map(item => item.dataValues),
      addTitle: "Добавить регион",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddRegion = async (req, res) => {
  res.render('addRegion', {layout: 'admin'});
}

const addRegion = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Region.create({name});
    
    res.redirect('/admin/regions');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/regions/add');
  }
}

module.exports = {
  pageRegions,
  pageAddRegion,
  addRegion,
}