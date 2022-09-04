import {Router} from 'express';
import {
  assignOrderPay,
  acceptAgreement,
  getFeedCsv,
  getFeedYML,
} from './../../controllers/api/external.js';

const router = Router();

router.post('/payNotice', assignOrderPay);
router.post('/acceptAgreement', acceptAgreement);

router.get('/feed-csv', getFeedCsv);
router.get('/feed-yml.xml', getFeedYML);

export default router;