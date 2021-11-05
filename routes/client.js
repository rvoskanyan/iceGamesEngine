const {Router} = require('express');
const homeRoute =  require('./client/home');
const catalogRoute =  require('./client/catalog');

const router = Router();

router.use('/', homeRoute);
router.use('/games', catalogRoute);

module.exports = router;