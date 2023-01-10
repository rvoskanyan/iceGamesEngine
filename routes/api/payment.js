import {Router} from "express";
import PaymentController from '../../controllers/api/payment.js'
const router = Router();

router.get('/method', PaymentController.getPaymentMethod);
router.post('/checkout/:paymentMethodId', PaymentController.checkout);


export default router;
