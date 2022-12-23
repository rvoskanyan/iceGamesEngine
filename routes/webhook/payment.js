import {Router} from "express";
import tinkoffWebhook  from '../../controllers/webhook/tinkoff.js';

const router = Router();

router.post('/tinkoff', tinkoffWebhook); // Прием webhook от тинкоф

export default router;
