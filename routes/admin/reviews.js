import {Router} from 'express';
import {
  pageReviews,
  rejectPage,
  reject,
  take,
} from "../../controllers/admin/reviews.js";

const router = Router();

router.get('/', pageReviews);

router.get('/reject/:reviewId', rejectPage);
router.post('/reject/:reviewId', reject);

router.post('/take/:reviewId', take);

export default router;