const {Router} = require('express');
const indexRoute =  require('./client/index');

const router = Router();

router.use('/', indexRoute);

module.exports = router;