import {Router} from "express";
import {
  analyticsPage,
  userAnalyticsPage,
} from "../../controllers/admin/analytics.js";

const router = new Router();

router.get('/', analyticsPage);
router.get('/users', userAnalyticsPage);

export default router;