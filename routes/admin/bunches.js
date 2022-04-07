import {Router} from 'express';
import {
  addBunch,
  pageAddBunch,
  pageBunches,
  pageEditBunch,
  editBunch,
  pageAddProductBunch,
  addProductBunch,
  pageEditProductBunch,
  editProductBunch,
} from '../../controllers/admin/bunches.js';

const router = Router();

router.get('/', pageBunches);

router.get('/add', pageAddBunch);
router.post('/add', addBunch);

router.get('/edit/:id', pageEditBunch);
router.post('/edit/:id', editBunch);

router.get('/:bunchId/addProduct', pageAddProductBunch);
router.post('/:bunchId/addProduct', addProductBunch);

router.get('/:bunchId/:productId', pageEditProductBunch);
router.post('/:bunchId/:productId', editProductBunch);

export default router;