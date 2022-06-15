import {Router} from 'express';
import {subscribeInStockValidator} from "../../utils/validators.js";
import {
  getProducts,
  addToFavorites,
  deleteFromFavorites,
  addToCart,
  deleteFromCart,
  addReview,
  subscribeInStock,
} from "../../controllers/api/products.js";

const router = Router();

router.get('/', getProducts);

router.post('/:productId/favorites', addToFavorites);
router.delete('/:productId/favorites', deleteFromFavorites);

router.post('/:productId/cart', addToCart);
router.delete('/:productId/cart', deleteFromCart);

router.post('/:productId/review', addReview);

router.post('/:productId/subscribeInStock', subscribeInStockValidator, subscribeInStock);

export default router;