import { Router } from "express";
import { getPaymentLink, notifications, addReview } from "../../controllers/api/fillUpSteam.js";

const router = Router();

router.post('/getPaymentLink', getPaymentLink);
router.post('/notifications', notifications);
router.post('/addReview', addReview);

export default router;