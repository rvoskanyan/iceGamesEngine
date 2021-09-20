const {Router} = require('express');
const {
  pageNamesKits,
  pageAddNameKit,
  addNameKit,
} = require("../../controllers/admin/namesKits");

const router = Router();

router.get('/', pageNamesKits);
router.get('/add', pageAddNameKit);
router.post('/add', addNameKit);

module.exports = router;