import {Router} from 'express';
import {
  addGenshinProduct, editGenshinProduct,
  pageAddGenshinProduct, pageEditGenshinProduct,
  pageGenshinProducts
} from "../../controllers/admin/genshinProducts.js";

const router = Router();

router.get('/', pageGenshinProducts);

router.get('/add', pageAddGenshinProduct);
router.post('/add', addGenshinProduct);

router.get('/edit/:productId', pageEditGenshinProduct);
router.post('/edit/:productId', editGenshinProduct);

export default router;
