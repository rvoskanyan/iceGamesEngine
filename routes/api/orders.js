import {Router} from 'express';
import {
  createOrder,
} from "../../controllers/api/orders.js";

const router = Router();

router.post('/', createOrder)

export default router;