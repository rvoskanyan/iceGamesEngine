import {Router} from "express";
import paymentRoute from "./webhook/payment.js";

const router = Router();

router.use('/v1', paymentRoute)
// https://icegames.store/webhook/v1/tinkoff

export default router