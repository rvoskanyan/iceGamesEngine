const {Router} = require("express");
const {
  pageExtends,
  pageAddExtend,
  addExtend,
} = require("../../controllers/admin/extends");

const router = Router();

router.get('/', pageExtends);
router.get('/add', pageAddExtend);
router.post('/add', addExtend);

module.exports = router;