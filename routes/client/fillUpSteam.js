import { Router } from "express";
import { fillUpSteamPage, checkStatus } from "../../controllers/client/fillUpSteam.js";

const router = Router();

router.get('/', fillUpSteamPage);
router.get('/check-status', checkStatus);

export default router;