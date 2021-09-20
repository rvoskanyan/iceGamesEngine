const {Router} = require('express');
const {
  pageLanguages,
  pageAddLanguage,
  addLanguage,
} = require("../../controllers/admin/languages");

const router = Router();

router.get('/', pageLanguages);
router.get('/add', pageAddLanguage);
router.post('/add', addLanguage);

module.exports = router;