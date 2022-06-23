import {Router} from 'express';
import {
  assignOrderPay,
  acceptAgreement,
} from './../../controllers/api/external.js';

const router = Router();

router.post('/payNotice', assignOrderPay);
router.post('/acceptAgreement', acceptAgreement);

export default router;