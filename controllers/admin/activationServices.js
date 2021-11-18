const {
  ActivationService,
  ActivationStage,
} = require('./../../models/index');

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

const pageEditActivationService = async (req, res) => {
  try {
    const {id} = req.params;
    const activationService = await ActivationService.findByPk(id);
    const activationStages = await activationService.getActivationStages();
  
    res.render('addActivationService', {
      layout: 'admin',
      title: 'Редактирование сервиса активации',
      isEdit: true,
      activationService: activationService.dataValues,
      activationStages: activationStages.map(item => item.dataValues),
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/activation-services')
  }
}

const editActivationService = async (req, res) => {
  const {id} = req.params;
  
  try {
    const {name} = req.body;
  
    await ActivationService.update({name},
      {
        where: {
          id: id,
        },
      },
    );
    
    res.redirect('/admin/activation-services');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/activation-services/edit/${id}`);
  }
}

const pageAddActivationStage = async (req, res) => {
  const {id} = req.params;
  
  try {
    const activationService = await ActivationService.findByPk(id, {attributes: ['id', 'name']});
    
    res.render('addActivationStage', {
      layout: 'admin',
      title: 'Добавление этапа в сервис активации',
      activationService: activationService.dataValues,
    })
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/activation-services/edit/${id}`);
  }
}

const addActivationStage = async (req, res) => {
  const {id} = req.params;
  
  try {
    const {text} = req.body;
    
    await ActivationStage.create({
      text,
      activationServiceId: id,
    });
    
    res.redirect(`/admin/activation-services/edit/${id}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/activation-services/${id}/add`);
  }
}

module.exports = {
  pageActivationServices,
  pageAddActivationService,
  addActivationService,
  pageEditActivationService,
  editActivationService,
  pageAddActivationStage,
  addActivationStage,
}