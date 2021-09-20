const {Router} = require('express');
const {
  pageGenres,
  pageAddGenres,
  addGenres
} = require("../../controllers/admin/genres");

const router = Router();

router.get('/', pageGenres);
router.get('/add', pageAddGenres);
router.post('/add', addGenres);

module.exports = router;