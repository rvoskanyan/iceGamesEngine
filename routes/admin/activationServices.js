const {Router} = require('express');
const {
  pageActivationServices,
  pageAddActivationService,
  addActivationService,
} = require("../../controllers/admin/activationServices");

const router = Router();

router.get('/', pageActivationServices);
router.get('/add', pageAddActivationService);
router.post('/add', addActivationService);

module.exports = router;