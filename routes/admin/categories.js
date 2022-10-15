import {Router} from 'express';
import {
  pageCategories,
  pageAddCategories,
  addCategories,
  pageEditCategory,
  editCategory,
  pageAddProductCategory,
  addProductCategory,
} from "../../controllers/admin/categoies.js";

const router = Router();

router.get('/', pageCategories);

router.get('/add', pageAddCategories);
router.post('/add', addCategories);

router.get('/edit/:categoryId', pageEditCategory);
router.post('/edit/:categoryId', editCategory);

router.get('/:categoryId/addProduct', pageAddProductCategory);
router.post('/:categoryId/addProduct', addProductCategory);

export default router;