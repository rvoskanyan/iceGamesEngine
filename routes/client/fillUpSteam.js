import { Router } from "express";
import { fillUpSteamPage, checkStatus, fillUpTurkeySteamPage } from "../../controllers/client/fillUpSteam.js";

const router = Router();

router.get('/', fillUpSteamPage);
router.get('/check-status', checkStatus);
router.get('/turkey', fillUpTurkeySteamPage);

export default router;