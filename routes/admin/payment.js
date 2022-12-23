import {Router} from "express";
import PaymentCheckout from "../../controllers/admin/paymentCheckout.js";
import PaymentMethod from "../../controllers/admin/paymentMethod.js";


const router = Router()


//Checkout router settings
router.post('/checkout', PaymentCheckout.createCheckout)
router.get('/checkout', PaymentCheckout.createCheckout)
router.get('/checkout/:checkout_id', PaymentCheckout.editCheckout)
router.post('/checkout/:checkout_id', PaymentCheckout.editCheckout)

//Payment method router settings
router.post('/method', PaymentMethod.createPaymentMethod)
router.get('/method', PaymentMethod.createPaymentMethod)
router.get('/method/:payment_id', PaymentMethod.updatePaymentMethod)
router.post('/method/:payment_id', PaymentMethod.updatePaymentMethod)
router.post('/method/:payment_id', PaymentMethod.deletePaymentMethod)


export default router