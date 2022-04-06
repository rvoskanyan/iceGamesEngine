const {Router} = require('express');
const {
  addProduct
} = require("../../controllers/api/cart");

const router = Router();

router.post('/addProduct', addProduct);

module.exports = router;