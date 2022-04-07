import {Router} from 'express';
import {
  pageCategories,
  pageAddCategories,
  addCategories,
} from "../../controllers/admin/categoies.js";

const router = Router();

router.get('/', pageCategories);
router.get('/add', pageAddCategories);
router.post('/add', addCategories);

export default router;