import {Router} from 'express';
import {
  pageAddPurchasesSoFavorites,
  addPurchasesSoFavorites,
} from "../../controllers/admin/cheatReviews.js";

const router = Router();

router.get('/add-purchases-to-favorites', pageAddPurchasesSoFavorites);
router.post('/add-purchases-to-favorites', addPurchasesSoFavorites);

export default router;