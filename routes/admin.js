const {Router} = require('express');
const indexRoute =  require('./admin/index');
const productsRoute =  require('./admin/products');

const router = Router();

router.use('/', indexRoute);
router.use('/products', productsRoute);

module.exports = router;