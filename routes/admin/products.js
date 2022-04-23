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
router.get('/edit/:productId', pageEditProduct);
router.post('/edit/:productId', editProduct);

router.get('/:productId/addElement', pageAddGameElement);
router.post('/:productId/addElement', addGameElement);

export default router;