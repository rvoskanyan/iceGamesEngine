const {Router} = require('express');
const {renderHome} = require('./../../controllers/client/home');
const router = Router();

router.get('/', renderHome);

module.exports = router;