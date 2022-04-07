import {Router} from 'express';
import {
  assignOrderPay,
} from './../../controllers/api/external.js';

const router = Router();

router.post('/payNotice', assignOrderPay);

export default router;