const {Router} = require('express');
const gamesRoute = require('./api/games');

const router = Router();

router.use('/games', gamesRoute);

module.exports = router;