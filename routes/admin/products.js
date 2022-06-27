import {Router} from 'express';
import {
  pageProducts,
  pageAddProduct,
  addProduct,
  pageEditProduct,
  editProduct,
  pageAddProductElement,
  addProductElement,
  deleteProductElement,
} from '../../controllers/admin/products.js';

const router = Router();

router.get('/', pageProducts);

router.get('/add', pageAddProduct);
router.post('/add', addProduct);

router.get('/edit/:productId', pageEditProduct);
router.post('/edit/:productId', editProduct);

router.get('/:productId/addElement', pageAddProductElement);
router.post('/:productId/addElement', addProductElement);
router.post('/:productId/deleteElement/:elementId', deleteProductElement);

export default router;