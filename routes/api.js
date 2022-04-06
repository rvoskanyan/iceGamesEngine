const {Router} = require('express');
const productsRoute = require('./api/products');
const articlesRoute = require('./api/articles');
const cartRoute = require('./api/cart');
const ordersRoute = require('./api/orders');
const externalRoute = require('./api/external');

const router = Router();

router.use('/products', productsRoute);
router.use('/articles', articlesRoute);
router.use('/cart', cartRoute);
router.use('/order', ordersRoute);
router.use('/external', externalRoute);

module.exports = router;