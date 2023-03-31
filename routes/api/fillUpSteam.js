import { Router } from "express";
import { getPaymentLink, notifications } from "../../controllers/api/fillUpSteam.js";

const router = Router();

router.post('/getPaymentLink', getPaymentLink);
router.post('/notifications', notifications);

export default router;