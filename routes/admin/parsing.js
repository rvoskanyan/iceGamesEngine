import {Router} from 'express';
import {
  parsingPage,
  startParsing,
} from "../../controllers/admin/parsing.js";

const router = Router();

router.get('/', parsingPage);
router.post('/start', startParsing);

export default router;