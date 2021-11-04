const {Router} = require('express');
const {
  pagePublishers,
  pageAddPublishers,
  addPublishers,
} = require('../../controllers/admin/publishers');

const router = Router();

router.get('/', pagePublishers);
router.get('/add', pageAddPublishers);
router.post('/add', addPublishers);

module.exports = router;