const {Router} = require('express');
const {pageGame} = require("../../controllers/client/catalog");

const router = Router();

router.get('/:gameId', pageGame);

module.exports = router;