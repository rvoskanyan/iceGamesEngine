const {Router} = require('express');
const {renderHome} = require('./../../controllers/client/index');
const router = Router();

router.get('/', renderHome);

module.exports = router;