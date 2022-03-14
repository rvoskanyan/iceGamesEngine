const {Router} = require('express');
const homeRoute =  require('./client/home');
const gamesRoute =  require('./client/games');
const formActionsRoute =  require('./client/formsActions');
const systemRoute =  require('./client/system');
const profileRoute =  require('./client/profile');

const router = Router();

router.use('/', homeRoute);
router.use('/', formActionsRoute);
router.use('/', systemRoute);
router.use('/games', gamesRoute);
router.use('/profile', profileRoute);

module.exports = router;