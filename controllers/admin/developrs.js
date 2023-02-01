import Developer from "./../../models/Developer.js";

export const pageDevelopers = async (req, res) => {
  try {
    const developers = await Developer.find().select('name').lean();
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список разработчиков',
      section: 'developers',
      elements: developers,
      addTitle: "Добавить разработчика",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddDeveloper = async (req, res) => {
  res.render('addDeveloper', {layout: 'admin'});
}

export const addDeveloper = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Developer.create({name});
    
    res.redirect('/admin/developers');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/developers/add');
  }
}