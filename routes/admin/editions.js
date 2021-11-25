const {Router} = require('express');
const {
  pageEditions,
  pageAddEdition,
  addEdition,
} = require("../../controllers/admin/editions");

const router = Router();

router.get('/', pageEditions);
router.get('/add', pageAddEdition);
router.post('/add', addEdition);

module.exports = router;