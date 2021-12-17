const {Router} = require('express');
const {getAllGames} = require("../../controllers/api/games");

const router = Router();

router.get('/', getAllGames);

module.exports = router;