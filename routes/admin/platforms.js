const {Router} = require('express');
const {
  pagePlatforms,
  pageAddPlatform,
  addPlatform,
} = require("../../controllers/admin/platforms");

const router = Router();

router.get('/', pagePlatforms);
router.get('/add', pageAddPlatform);
router.post('/add', addPlatform);

module.exports = router;