const {Router} = require('express');
const {
  pageActivationServices,
  pageAddActivationService,
  addActivationService,
  pageEditActivationService,
  editActivationService,
  pageAddActivationStage,
  addActivationStage,
} = require("../../controllers/admin/activationServices");

const router = Router();

router.get('/', pageActivationServices);
router.get('/add', pageAddActivationService);
router.post('/add', addActivationService);
router.get('/edit/:id', pageEditActivationService);
router.post('/edit/:id', editActivationService);
router.get('/:id/add-activation-stage', pageAddActivationStage);
router.post('/:id/add-activation-stage', addActivationStage);

module.exports = router;