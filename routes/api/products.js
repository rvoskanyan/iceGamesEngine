const {Router} = require('express');
const {
  getProducts,
  addToFavorites,
  deleteFromFavorites,
  addToCart,
  deleteFromCart,
} = require("../../controllers/api/products");

const router = Router();

router.get('/', getProducts);

router.post('/:productId/favorites', addToFavorites);
router.delete('/:productId/favorites', deleteFromFavorites);

router.post('/:productId/cart', addToCart);
router.delete('/:productId/cart', deleteFromCart);

module.exports = router;