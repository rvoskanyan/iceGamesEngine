const {Router} = require('express');
const {
  pageDevelopers,
  pageAddDeveloper,
  addDeveloper,
} = require("../../controllers/admin/developrs");

const router = Router();

router.get('/', pageDevelopers);
router.get('/add', pageAddDeveloper);
router.post('/add', addDeveloper);

module.exports = router;