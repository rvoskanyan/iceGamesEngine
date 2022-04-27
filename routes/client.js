import {Router} from 'express';
import homeRoute from './client/home.js';
import gamesRoute from './client/games.js';
import formActionsRoute from './client/formsActions.js';
import systemRoute from './client/system.js';
import profileRoute from './client/profile.js';
import blogRoute from './client/blog.js';
import cartRoute from './client/cart.js';
import supportRoute from './client/support.js';
import paymentRoute from './client/payment.js';
import aboutRoute from './client/about.js';
import discountsRoute from './client/discounts.js';
import noveltyRoute from './client/novelty.js';
import preordersRoute from './client/preorders.js';
import reviewsRoute from './client/reviews.js';
import ratingRoute from './client/rating.js';
import sitemapsRoute from './client/sitemaps.js';

const router = Router();

router.use('/', homeRoute);
router.use('/', formActionsRoute);
router.use('/', systemRoute);
router.use('/games', gamesRoute);
router.use('/profile', profileRoute);
router.use('/blog', blogRoute);
router.use('/cart', cartRoute);
router.use('/support', supportRoute);
router.use('/payment', paymentRoute);
router.use('/about', aboutRoute);
router.use('/discounts', discountsRoute);
router.use('/novelty', noveltyRoute);
router.use('/preorders', preordersRoute);
router.use('/reviews', reviewsRoute);
router.use('/rating', ratingRoute);
router.use('/sitemaps', sitemapsRoute);

export default router;