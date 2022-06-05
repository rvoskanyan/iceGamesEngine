import {Router} from "express";
import {
  exportProductInStock,
} from "../../controllers/admin/exports.js";

const router = Router();

router.get('/products-in-stock', exportProductInStock);

export default router;