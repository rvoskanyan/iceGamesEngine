const {Router} = require('express');
const productsRoute = require('./api/products');
const articlesRoute = require('./api/articles');

const router = Router();

router.use('/products', productsRoute);
router.use('/articles', articlesRoute);

module.exports = router;