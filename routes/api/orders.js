import {Router} from 'express';
import {
  createOrder,
  createSplitOrder,
} from "../../controllers/api/orders.js";

const router = Router();

router.post('/', createOrder);
router.post('/split', createSplitOrder);

export default router;