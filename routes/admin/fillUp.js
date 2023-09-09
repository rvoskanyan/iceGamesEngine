import { Router } from "express";
import { fillUpAnalyticsPage, updateStatuses, setActive } from "../../controllers/admin/fillUp.js";

const router = Router();

router.get('/', fillUpAnalyticsPage);
router.get('/update-statuses', updateStatuses);
router.post('/setActive', setActive);

export default router;