import Platform from "./../../models/Platform.js";

export const pagePlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find().select('name').lean();
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список платформ',
      section: 'platforms',
      elements: platforms,
      addTitle: "Добавить платформу",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddPlatform = async (req, res) => {
  res.render('addPlatform', {
    layout: 'admin',
    title: 'Добавление новой платформы',
  });
}

export const addPlatform = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Platform.create({name});
    
    res.redirect('/admin/platforms');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/platforms/add');
  }
}