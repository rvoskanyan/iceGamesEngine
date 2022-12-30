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
  pageParseBySteambuy,
  parseBySteambuy,
  comparePricePage,
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

router.get('/:productId/parse-by-steam-buy', pageParseBySteambuy);
router.post('/:productId/parse-by-steam-buy', parseBySteambuy);

router.get('/compare', comparePricePage);

export default router;