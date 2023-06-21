import { Router } from 'express'
import {
  suppliersPage,
  syncKupiKod,
} from "../../controllers/admin/suppliers.js";

const router = Router();

router.get('/', suppliersPage);
router.post('/syncKupiKod', syncKupiKod);

export default router;