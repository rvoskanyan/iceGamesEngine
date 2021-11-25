const {Router} = require('express');
const {
  pageProducts,
  pageAddProduct,
  addProduct,
  pageEditProduct,
  editProduct,
  pageAddGameElement,
  addGameElement,
} = require('../../controllers/admin/products');
const router = Router();

router.get('/', pageProducts);
router.get('/add', pageAddProduct);
router.post('/add', addProduct);
router.get('/edit/:gameId', pageEditProduct);
router.post('/edit/:gameId', editProduct);

router.get('/:gameId/addElement', pageAddGameElement);
router.post('/:gameId/addElement', addGameElement);

module.exports = router;