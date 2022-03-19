const {Router} = require('express');
const {
  articlesPage,
  addArticlePage,
  addArticle,
  editArticlePage,
  editArticle,
  addBlockPage,
  addBlock,
} = require('../../controllers/admin/articles');

const router = Router();

router.get('/', articlesPage);
router.get('/add', addArticlePage);
router.post('/add', addArticle);

router.get('/edit/:id', editArticlePage);
router.post('/:id', editArticle);

router.get('/:id/addBlock', addBlockPage);
router.post('/:id/addBlock', addBlock);

module.exports = router;