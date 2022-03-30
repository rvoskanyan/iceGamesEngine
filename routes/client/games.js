const {Router} = require('express');
const {
  gamesPage,
  gamePage,
} = require("../../controllers/client/games");

const router = Router();

router.get('/', gamesPage);
router.get('/:alias', gamePage);

module.exports = router;