import {Router} from 'express';
import {
  assignOrderPay,
  acceptAgreement,
  getFeedCsv,
} from './../../controllers/api/external.js';

const router = Router();

router.post('/payNotice', assignOrderPay);
router.post('/acceptAgreement', acceptAgreement);

router.get('/feed-csv', getFeedCsv);

export default router;