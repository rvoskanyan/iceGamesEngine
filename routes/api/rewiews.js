import {Router} from "express";
import {
  getReviews, getReviewsGameOrService, createOurReview
} from "../../controllers/api/reviews.js";

const router = Router();

// TODO надо бы разнести (/) для нынешнего url (all) а сам (/) на (product)

router.get('/', getReviews);
router.get('/all', getReviewsGameOrService)
router.post('/our', createOurReview)

export default router;