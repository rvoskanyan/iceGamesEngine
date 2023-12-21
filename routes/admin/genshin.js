import {Router} from 'express';
import {
  addGenshinProduct, deleteGenshinProduct, editGenshinProduct,
  pageAddGenshinProduct, pageEditGenshinProduct,
  pageGenshinProducts
} from "../../controllers/admin/genshinProducts.js";

const router = Router();

router.get('/', pageGenshinProducts);

router.get('/add', pageAddGenshinProduct);
router.post('/add', addGenshinProduct);

router.get('/edit/:productId', pageEditGenshinProduct);
router.post('/edit/:productId', editGenshinProduct);

router.post('/delete/:productId', deleteGenshinProduct);

export default router;
