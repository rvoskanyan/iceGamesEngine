import {Router} from 'express';
import {
  articlesPage,
  addArticlePage,
  addArticle,
  editArticlePage,
  editArticle,
  addBlockPage,
  addBlock,
  editBlockPage,
  editBlock,
  deleteBlock,
} from '../../controllers/admin/articles.js';

const router = Router();

router.get('/', articlesPage);
router.get('/add', addArticlePage);
router.post('/add', addArticle);

router.get('/edit/:id', editArticlePage);
router.post('/:id', editArticle);

router.get('/:id/addBlock', addBlockPage);
router.post('/:id/addBlock', addBlock);

router.get('/:id/:blockId', editBlockPage);
router.post('/:id/:blockId', editBlock);
router.post('/:id/delete/:blockId', deleteBlock);

export default router;