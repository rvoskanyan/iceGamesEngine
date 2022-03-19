const {Router} = require('express');
const {
  blogHomePage,
  blogArticlePage,
} = require('./../../controllers/client/blog');

const router = Router();

router.get('/', blogHomePage);
router.get('/:alias', blogArticlePage);

module.exports = router;