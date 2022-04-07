import {Router} from 'express';
import {
  addProduct
} from "../../controllers/api/cart.js";

const router = Router();

router.post('/addProduct', addProduct);

export default router;