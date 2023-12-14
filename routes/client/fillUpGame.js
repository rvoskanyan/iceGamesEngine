import { Router } from "express";
import {fillUpGamePage, checkStatus} from "../../controllers/client/fillUpGame.js";

const router = Router();

router.get('/', fillUpGamePage);
router.get('/check-status', checkStatus);

export default router;
