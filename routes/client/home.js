const {Router} = require('express');
const {homepage} = require('./../../controllers/client/home');
const router = Router();

router.get('/', homepage);

module.exports = router;