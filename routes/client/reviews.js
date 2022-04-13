import {Router} from "express";
import {reviewsPage} from "./../../controllers/client/reviews.js";

const router = Router();

router.get('/', reviewsPage);

export default router;