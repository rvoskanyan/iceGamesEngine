import {Router} from "express";
import {paymentPage} from "./../../controllers/client/payment.js";

const router = Router();

router.get('/', paymentPage);

export default router;