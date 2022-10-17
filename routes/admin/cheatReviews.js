import {Router} from 'express';
import {
  pageAddPurchasesToFavorites,
  addPurchasesToFavorites,
  pageImportReviews,
  importReviews,
  pageImportForProducts,
  importForProducts,
} from "../../controllers/admin/cheatReviews.js";

const router = Router();

router.get('/add-purchases-to-favorites', pageAddPurchasesToFavorites);
router.post('/add-purchases-to-favorites', addPurchasesToFavorites);

router.get('/import-reviews', pageImportReviews);
router.post('/import-reviews', importReviews);

router.get('/import-reviews-for-products', pageImportForProducts);
router.post('/import-reviews-for-products', importForProducts);

export default router;