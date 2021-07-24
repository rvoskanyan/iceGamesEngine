const {Router} = require('express');
const {getPage} = require('../../controllers/admin/products');
const router = Router();

router.get('/', getPage);

module.exports = router;