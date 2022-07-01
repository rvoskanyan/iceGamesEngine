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
  pageAddProductElements,
  addProductElements,
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

router.get('/:productId/addElements', pageAddProductElements);
router.post('/:productId/addElements', addProductElements);

export default router;