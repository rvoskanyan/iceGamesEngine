const {Router} = require('express');
const {
  logout,
} = require('./../../controllers/client/system');

const router = Router();

router.get('/logout', logout);

module.exports = router;