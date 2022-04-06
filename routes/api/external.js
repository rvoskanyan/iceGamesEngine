const {Router} = require('express');
const {
  assignOrderPay,
} = require('./../../controllers/api/external');

const router = Router();

router.post('/payNotice', assignOrderPay);

module.exports = router;