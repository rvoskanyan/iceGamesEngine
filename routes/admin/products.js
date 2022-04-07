import {Router} from 'express';
import {
  pageProducts,
  pageAddProduct,
  addProduct,
  pageEditProduct,
  editProduct,
  pageAddGameElement,
  addGameElement,
} from '../../controllers/admin/products.js';

const router = Router();

router.get('/', pageProducts);
router.get('/add', pageAddProduct);
router.post('/add', addProduct);
router.get('/edit/:gameId', pageEditProduct);
router.post('/edit/:gameId', editProduct);

router.get('/:gameId/addElement', pageAddGameElement);
router.post('/:gameId/addElement', addGameElement);

export default router;