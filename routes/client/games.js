import {Router} from 'express';
import {
  gamesPage,
  gamePage,
} from "../../controllers/client/games.js";

const router = Router();

router.get('/', gamesPage);
router.get('/:alias', gamePage);

export default router;