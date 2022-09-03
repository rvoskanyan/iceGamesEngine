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
    const {name, alias, description} = req.body;
    
    await ActivationService.create({name, alias, description});
    
    res.redirect('/admin/activation-services');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/activation-services/add');
  }
}

export const pageEditActivationService = async (req, res) => {
  try {
    const {id} = req.params;
    const activationService = await ActivationService.findById(id).lean();
  
    res.render('addActivationService', {
      layout: 'admin',
      title: 'Редактирование сервиса активации',
      isEdit: true,
      activationService,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/activation-services')
  }
}

export const editActivationService = async (req, res) => {
  const {id} = req.params;
  
  try {
    const {name, alias, description} = req.body;
    const activationService = await ActivationService.findById(id);
  
    activationService.name = name;
    activationService.alias = alias;
    activationService.description = description;
    await activationService.save();
    
    res.redirect('/admin/activation-services');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/activation-services/edit/${id}`);
  }
}

export const pageAddActivationStage = async (req, res) => {
  const {id} = req.params;
  
  try {
    const activationService = await ActivationService.findById(id).lean();
    
    res.render('addActivationStage', {
      layout: 'admin',
      title: 'Добавление этапа в сервис активации',
      activationService,
    })
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/activation-services/edit/${id}`);
  }
}

export const addActivationStage = async (req, res) => {
  const {id} = req.params;
  
  try {
    const {name, order} = req.body;
    const activationService = await ActivationService.findById(id);
  
    activationService.stages.push({
      $each: [{name, order}],
      $sort: {
        order: 1,
      },
    });
    await activationService.save();
    
    res.redirect(`/admin/activation-services/edit/${id}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/activation-services/${id}/add`);
  }
}