import Edition from "./../../models/Edition.js";

export const pageEditions = async (req, res) => {
  try {
    const editions = await Edition.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список версий',
      section: 'editions',
      elements: editions,
      addTitle: "Добавить версию",
    });
  } catch (e) {
    res.redirect('/admin')
  }
}

export const pageAddEdition = async (req, res) => {
  res.render('addEdition', {
    layout: 'admin',
    title: 'Добавление новой версии',
  })
}

export const addEdition = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Edition.create({name});
    
    res.redirect('/admin/editions');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/editions/add');
  }
}