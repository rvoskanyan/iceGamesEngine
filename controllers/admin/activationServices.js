const {ActivationService} = require('./../../models/index');

const pageActivationServices = async (req, res) => {
  res.json('Activation services page');
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