const {Router} = require('express');
const {index} = require('../../controllers/admin/index');
const router = Router();

router.get('/', index);

module.exports = router;