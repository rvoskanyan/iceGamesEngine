const {Router} = require('express');
const {
  cartPage,
} = require('./../../controllers/client/cart');

const router = Router();

router.get('/', cartPage);

module.exports = router;