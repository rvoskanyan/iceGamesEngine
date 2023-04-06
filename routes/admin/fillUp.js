import { Router } from "express";
import { fillUpAnalyticsPage, updateStatuses } from "../../controllers/admin/fillUp.js";

const router = Router();

router.get('/', fillUpAnalyticsPage);
router.get('/update-statuses', updateStatuses);

export default router;