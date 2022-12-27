import {Router} from "express";
import PaymentController from '../../controllers/api/payment.js'
const router = Router();

router.get('/method', PaymentController.methods);
router.post('/checkout/status', PaymentController.checkPayment)
router.post('/checkout/:paymentMethodId', PaymentController.checkout);


export default router;
