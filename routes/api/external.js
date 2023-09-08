import {Router} from 'express';
import {
  assignOrderPay,
  acceptAgreement,
  getFeedCsv,
  getFeedYML,
  getTurboArticlesRssFeed,
  yaSplitHandler,
} from './../../controllers/api/external.js';

const router = Router();

router.post('/payNotice', assignOrderPay);
router.post('/acceptAgreement', acceptAgreement);

router.get('/feed-csv', getFeedCsv);
router.get('/feed-yml.xml', getFeedYML);
router.get('/turbo-articles-rss-feed.xml', getTurboArticlesRssFeed);

//router.post('/yaSplit', yaSplitHandler);

export default router;