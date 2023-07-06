import { Router } from "express";
import { getPaymentLink, notifications, addReview, createTurkeyFillUpOrder, turkeyNotifications } from "../../controllers/api/fillUpSteam.js";

const router = Router();

router.post('/getPaymentLink', getPaymentLink);
router.post('/notifications', notifications);
router.post('/addReview', addReview);

router.post('/turkey', createTurkeyFillUpOrder);
router.post('/turkey-notifications', turkeyNotifications);

export default router;