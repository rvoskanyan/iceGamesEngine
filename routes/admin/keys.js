const {Router} = require('express');
const {
  pageKeys,
  pageAddKey,
  addKey
} = require("../../controllers/admin/keys");

const router = Router();

router.get('/', pageKeys);
router.get('/add', pageAddKey);
router.post('/add', addKey);

module.exports = router;