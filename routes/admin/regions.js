const {Router} = require('express');
const {
  pageRegions,
  pageAddRegion,
  addRegion,
} = require("../../controllers/admin/regions");

const router = Router();

router.get('/', pageRegions);
router.get('/add', pageAddRegion);
router.post('/add', addRegion);

module.exports = router;