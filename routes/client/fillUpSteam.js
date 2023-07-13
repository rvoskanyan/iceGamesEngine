import { Router } from "express";
import { fillUpSteamPage, checkStatus, fillUpTurkeySteamPage, fillUpKazakhstanSteamPage } from "../../controllers/client/fillUpSteam.js";

const router = Router();

router.get('/', fillUpSteamPage);
router.get('/check-status', checkStatus);
router.get('/kazakhstan', fillUpKazakhstanSteamPage);
router.get('/turkey', fillUpTurkeySteamPage);

export default router;