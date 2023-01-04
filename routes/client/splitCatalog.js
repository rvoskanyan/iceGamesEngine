import {Router} from "express";
import {gamesPage} from "../../controllers/client/games.js";

const router = Router();

router.get('/:sectionName', gamesPage)

export default router;