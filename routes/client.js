import { Router } from 'express';
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
import legalInfo from './client/legalinfo.js';
import splitCatalogRoute from './client/splitCatalog.js';
import yaAuthRoute from "./client/yaAuth.js";
import fillUpSteamRoute from './client/fillUpSteam.js';
import selectionsRoute from './client/selections.js';
import splitRoute from './client/split.js';
import { checkPlatform } from "../middlewares/checkPlatform.js";
import constClientMiddleware from "../middlewares/constClientData.js";

const router = Router();

router.use('/', homeRoute);
router.use('/', formActionsRoute);
router.use('/', systemRoute);
router.use('/yaAuth', yaAuthRoute);
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
router.use('/legal-info', legalInfo);
router.use('/', splitCatalogRoute);
router.use('/fill-up-steam', fillUpSteamRoute);
router.use('/selections', selectionsRoute);
router.use('/split', splitRoute);

router.use('/:platform', checkPlatform, constClientMiddleware, homeRoute);
router.use('/:platform/games', checkPlatform, constClientMiddleware, gamesRoute);
router.use('/:platform/blog', checkPlatform, constClientMiddleware, blogRoute);
router.use('/:platform/discounts', checkPlatform, constClientMiddleware, discountsRoute);
router.use('/:platform/novelty', checkPlatform, constClientMiddleware, noveltyRoute);
router.use('/:platform/preorders', checkPlatform, constClientMiddleware, preordersRoute);
router.use('/:platform/reviews', checkPlatform, constClientMiddleware, reviewsRoute);
router.use('/:platform/selections', checkPlatform, constClientMiddleware, selectionsRoute);

export default router;