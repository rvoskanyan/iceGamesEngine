const {Router} = require('express');
const {
  pageProducts,
  pageAddProduct,
  addProduct,
  pageEditProduct,
  editProduct,
} = require('../../controllers/admin/products');
const router = Router();

router.get('/', pageProducts);
router.get('/add', pageAddProduct);
router.post('/add', addProduct);
router.get('/edit/:gameId', pageEditProduct);
router.post('/edit/:gameId', editProduct);

module.exports = router;