import {Router} from "express";
import {
  exportProductInStock,
  monthlySales,
} from "../../controllers/admin/exports.js";

const router = Router();

router.get('/products-in-stock', exportProductInStock);
router.get('/monthly-sales', monthlySales);

export default router;