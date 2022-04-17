import {Router} from 'express';
import {
  bundlePage,
  bundleAddPage,
  addBundle,
  bundleEditPage,
  bundleEdit,
  pageAddProductBundle,
  addProductBundle,
  bundleProductEditPage,
  bundleProductEdit,
} from '../../controllers/admin/bundles.js';

const router = Router();

router.get('/', bundlePage);

router.get('/add', bundleAddPage);
router.post('/add', addBundle);

router.get('/edit/:id', bundleEditPage);
router.post('/edit/:id', bundleEdit);

router.get('/:bundleId/addProduct', pageAddProductBundle);
router.post('/:bundleId/addProduct', addProductBundle);

router.get('/:bundleId/:productId', bundleProductEditPage);
router.post('/:bundleId/:productId', bundleProductEdit);

export default router;