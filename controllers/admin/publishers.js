import Publisher from "./../../models/Publisher.js";

export const pagePublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список издателей',
      section: 'publishers',
      elements: publishers,
      addTitle: "Добавить издателя",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddPublishers = async (req, res) => {
  res.render('addPublisher', {layout: 'admin'});
}

export const addPublishers = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Publisher.create({name});
    
    res.redirect('/admin/publishers');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/publishers/add');
  }
}