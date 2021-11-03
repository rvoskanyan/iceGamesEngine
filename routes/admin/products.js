const {Router} = require('express');
const {
  pageProducts,
  pageAddProduct,
  addProduct,
  pageAddGameKid,
  addGameKid,
  pageAddElementKit,
  addElementKit,
  pageEditProduct,
  editProduct,
} = require('../../controllers/admin/products');
const router = Router();

router.get('/', pageProducts);
router.get('/add', pageAddProduct);
router.post('/add', addProduct);
router.get('/edit/:gameId', pageEditProduct);
router.post('/edit/:gameId', editProduct);

router.get('/:gameId/addKit', pageAddGameKid);
router.post('/:gameId/addKit', addGameKid);

router.get('/:gameId/:kitId/addElementKit', pageAddElementKit);
router.post('/:gameId/:kitId/addElementKit', addElementKit);

module.exports = router;