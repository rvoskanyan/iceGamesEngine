import {Router} from 'express';
import {
  pageAddPurchasesToFavorites,
  addPurchasesToFavorites,
} from "../../controllers/admin/cheatReviews.js";

const router = Router();

router.get('/add-purchases-to-favorites', pageAddPurchasesToFavorites);
router.post('/add-purchases-to-favorites', addPurchasesToFavorites);

export default router;