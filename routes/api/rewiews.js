import {Router} from "express";
import {
  getReviews,
} from "../../controllers/api/reviews.js";

const router = Router();

router.get('/', getReviews);

export default router;