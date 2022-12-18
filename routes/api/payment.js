import {Router} from "express";
import PaymentController from '../../controllers/api/payment.js'
const router = Router();

router.get('/methods', PaymentController.methods);
router.post('/checkout/status', PaymentController.checkPayment)
router.post('/checkout/:methods', PaymentController.checkout);


export default router;
