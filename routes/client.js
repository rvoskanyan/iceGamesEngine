const {Router} = require('express');
const indexRoute =  require('./client/index');
const catalogRoute =  require('./client/catalog');

const router = Router();

router.use('/', indexRoute);
router.use('/games', catalogRoute);

module.exports = router;