import {Router} from 'express';
import {
  getProducts,
  addToFavorites,
  deleteFromFavorites,
  addToCart,
  deleteFromCart,
} from "../../controllers/api/products.js";

const router = Router();

router.get('/', getProducts);

router.post('/:productId/favorites', addToFavorites);
router.delete('/:productId/favorites', deleteFromFavorites);

router.post('/:productId/cart', addToCart);
router.delete('/:productId/cart', deleteFromCart);

export default router;