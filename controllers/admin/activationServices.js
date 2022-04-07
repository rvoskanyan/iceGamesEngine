import ActivationService from './../../models/ActivationService.js';

export const pageActivationServices = async (req, res) => {
  try {
    const activationServices = await ActivationService.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список сервисов активации',
      section: 'activation-services',
      elements: activationServices,
      addTitle: "Добавить сервис активации",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddActivationService = async (req, res) => {
  res.render('addActivationService', {layout: 'admin'});
}

export const addActivationService = async (req, res) => {
  try {
    const {name} = req.body;
    
    await ActivationService.create({name});
    
    res.redirect('/admin/activation-services');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/activation-services/add');
  }
}

export const pageEditActivationService = async (req, res) => {
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

export const editActivationService = async (req, res) => {
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

export const pageAddActivationStage = async (req, res) => {
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

export const addActivationStage = async (req, res) => {
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