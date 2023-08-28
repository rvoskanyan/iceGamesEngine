import {Router} from "express";
import {
  analyticsPage,
  userAnalyticsPage,
  statisticPage,
} from "../../controllers/admin/analytics.js";

const router = new Router();

router.get('/', analyticsPage);
router.get('/users', userAnalyticsPage);
router.get('/statistic', statisticPage);

export default router;