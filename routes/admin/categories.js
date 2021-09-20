const {Router} = require('express');
const {
  pageCategories,
  pageAddCategories,
  addCategories,
} = require("../../controllers/admin/categoies");

const router = Router();

router.get('/', pageCategories);
router.get('/add', pageAddCategories);
router.post('/add', addCategories);

module.exports = router;