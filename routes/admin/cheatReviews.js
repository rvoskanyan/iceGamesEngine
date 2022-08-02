import {Router} from 'express';
import {
  pageAddPurchasesToFavorites,
  addPurchasesToFavorites,
  pageImportReviews,
  importReviews,
} from "../../controllers/admin/cheatReviews.js";

const router = Router();

router.get('/add-purchases-to-favorites', pageAddPurchasesToFavorites);
router.post('/add-purchases-to-favorites', addPurchasesToFavorites);

router.get('/import-reviews', pageImportReviews);
router.post('/import-reviews', importReviews);

export default router;