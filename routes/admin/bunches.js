const {Router} = require('express');
const {
  addBunch,
  pageAddBunch,
  pageBunches,
  pageEditBunch,
  editBunch,
  pageAddProductBunch,
  addProductBunch,
  pageEditProductBunch,
  editProductBunch,
} = require('../../controllers/admin/bunches');

const router = Router();

router.get('/', pageBunches);

router.get('/add', pageAddBunch);
router.post('/add', addBunch);

router.get('/edit/:id', pageEditBunch);
router.post('/edit/:id', editBunch);

router.get('/:bunchId/addProduct', pageAddProductBunch);
router.post('/:bunchId/addProduct', addProductBunch);

router.get('/:bunchId/:productId', pageEditProductBunch);
router.post('/:bunchId/:productId', editProductBunch);

module.exports = router;