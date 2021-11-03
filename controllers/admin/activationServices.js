const {ActivationService} = require('./../../models/index');

const pageActivationServices = async (req, res) => {
  try {
    const activationServices = await ActivationService.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список сервисов активации',
      section: 'activation-services',
      elements: activationServices.map(item => item.dataValues),
      addTitle: "Добавить сервис активации",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddActivationService = async (req, res) => {
  res.render('addActivationService', {layout: 'admin'});
}

const addActivationService = async (req, res) => {
  try {
    const {name} = req.body;
    
    await ActivationService.create({name});
    
    res.redirect('/admin/activation-services');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/activation-services/add');
  }
}

module.exports = {
  pageActivationServices,
  pageAddActivationService,
  addActivationService,
}