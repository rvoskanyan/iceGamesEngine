import {Router} from "express";
import {analyticsPage} from "../../controllers/admin/analytics.js";

const router = new Router();

router.get('/', analyticsPage);

export default router;