export const pageNamesKits = async (req, res) => {
  try {
    const namesKits = await NamesKit.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список названий пакетов',
      section: 'names-kits',
      elements: namesKits.map(item => item.dataValues),
      addTitle: "Добавить название пакетов",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddNameKit = async (req, res) => {
  res.render('addNameKit', {layout: 'admin'});
}

export const addNameKit = async (req, res) => {
  try {
    const {name} = req.body;
  
    await NamesKit.create({name});
  
    res.redirect('/admin/names-kits');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/names-kits/add');
  }
}