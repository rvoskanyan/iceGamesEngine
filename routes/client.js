import {Router} from 'express';
import homeRoute from './client/home.js';
import gamesRoute from './client/games.js';
import formActionsRoute from './client/formsActions.js';
import systemRoute from './client/system.js';
import profileRoute from './client/profile.js';
import blogRoute from './client/blog.js';
import cartRoute from './client/cart.js';
import supportRoute from './client/support.js';

const router = Router();

router.use('/', homeRoute);
router.use('/', formActionsRoute);
router.use('/', systemRoute);
router.use('/games', gamesRoute);
router.use('/profile', profileRoute);
router.use('/blog', blogRoute);
router.use('/cart', cartRoute);
router.use('/support', supportRoute);

export default router;