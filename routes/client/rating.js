import {Router} from "express";
import {
  ratingPage,
  profileViewPage,
} from "../../controllers/client/rating.js";

const router = Router();

router.get('/', ratingPage);
router.get('/:login', profileViewPage);

export default router;