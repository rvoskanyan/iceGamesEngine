import { Router } from "express";
import { fillUpAnalyticsPage } from "../../controllers/admin/fillUp.js";

const router = Router();

router.get('/', fillUpAnalyticsPage);

export default router;