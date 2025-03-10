import Region from './../../models/Region.js';

export const pageRegions = async (req, res) => {
  try {
    const regions = await Region.find().select(['name']).lean();
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список регионов',
      section: 'regions',
      elements: regions,
      addTitle: "Добавить регион",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddRegion = async (req, res) => {
  res.render('addRegion', {layout: 'admin'});
}

export const addRegion = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Region.create({name});
    
    res.redirect('/admin/regions');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/regions/add');
  }
}