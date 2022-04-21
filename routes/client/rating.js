import {Router} from "express";
import {ratingPage} from "../../controllers/client/rating.js";

const router = Router();

router.get('/', ratingPage);

export default router;