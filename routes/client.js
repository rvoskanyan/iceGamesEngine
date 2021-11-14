const {Router} = require('express');
const homeRoute =  require('./client/home');
const gamesRoute =  require('./client/games');

const router = Router();

router.use('/', homeRoute);
router.use('/games', gamesRoute);

module.exports = router;