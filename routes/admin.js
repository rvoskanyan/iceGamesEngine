const {Router} = require('express');
const indexRoute = require('./admin/index');
const productsRoute = require('./admin/products');
const uspRoute = require('./admin/usp');
const categoriesRoute = require('./admin/categories');
const genresRoute = require('./admin/genres');
const namesKitsRoute = require('./admin/namesKits');
const keysRoute = require('./admin/keys');
const extendsRoute = require('./admin/extends');
const languagesRoute = require('./admin/languages');
const regionsRoute = require('./admin/regions');
const activationServicesRoute = require('./admin/activationServices');

const router = Router();

router.use('/', indexRoute);
router.use('/products', productsRoute);
router.use('/usp', uspRoute);
router.use('/categories', categoriesRoute);
router.use('/genres', genresRoute);
router.use('/names-kits', namesKitsRoute);
router.use('/keys', keysRoute);
router.use('/extends', extendsRoute);
router.use('/languages', languagesRoute);
router.use('/regions', regionsRoute);
router.use('/activation-services', activationServicesRoute);

module.exports = router;