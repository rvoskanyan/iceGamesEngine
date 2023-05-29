import {Router} from "express";
import {
  ordersPage
} from "../../controllers/admin/orders.js";

const router = new Router();

router.get('/', ordersPage);

export default router;