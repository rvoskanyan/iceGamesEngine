const {Router} = require('express');
const {
  pageUsp,
  pageAddUsp,
  addUsp
} = require("../../controllers/admin/usp");

const router = Router();

router.get('/', pageUsp);
router.get('/add', pageAddUsp);
router.post('/add', addUsp);

module.exports = router;