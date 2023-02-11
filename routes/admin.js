import {Router} from 'express';
import indexRoute from './admin/index.js';
import productsRoute from './admin/products.js';
import categoriesRoute from './admin/categories.js';
import genresRoute from './admin/genres.js';
import namesKitsRoute from './admin/namesKits.js';
import keysRoute from './admin/keys.js';
import extendsRoute from './admin/extends.js';
import languagesRoute from './admin/languages.js';
import regionsRoute from './admin/regions.js';
import activationServicesRoute from './admin/activationServices.js';
import publishersRoute from './admin/publishers.js';
import developersRoute from './admin/developers.js';
import platformsRoute from './admin/platforms.js';
import bundlesRoute from './admin/bundles.js';
import editionsRoute from './admin/editions.js';
import seriesRoute from './admin/series.js';
import articlesRoute from './admin/articles.js';
import achievementsRoute from './admin/achievements.js';
import parsingRoute from './admin/parsing.js';
import exportsRoute from './admin/exports.js';
import partnersRoute from './admin/partners.js';
import cheatReviewsRoute from './admin/cheatReviews.js';
import Payment from './admin/payment.js'
import reviewsRoute from './admin/reviews.js';
import analyticsRoute from './admin/analytics.js';
import selectionsRoute from './admin/selections.js';

const router = Router();

router.use('/', indexRoute);
router.use('/products', productsRoute);
router.use('/categories', categoriesRoute);
router.use('/genres', genresRoute);
router.use('/names-kits', namesKitsRoute);
router.use('/keys', keysRoute);
router.use('/extends', extendsRoute);
router.use('/languages', languagesRoute);
router.use('/regions', regionsRoute);
router.use('/activation-services', activationServicesRoute);
router.use('/publishers', publishersRoute);
router.use('/developers', developersRoute);
router.use('/platforms', platformsRoute);
router.use('/bundles', bundlesRoute);
router.use('/editions', editionsRoute);
router.use('/series', seriesRoute);
router.use('/articles', articlesRoute);
router.use('/achievements', achievementsRoute);
router.use('/parsing', parsingRoute);
router.use('/exports', exportsRoute);
router.use('/partners', partnersRoute);
router.use('/cheat-reviews', cheatReviewsRoute);
router.use('/payment', Payment)
router.use('/reviews', reviewsRoute);
router.use('/analytics', analyticsRoute);
router.use('/selections', selectionsRoute);

export default router;