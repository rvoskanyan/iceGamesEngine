import {Router} from 'express';
import {
  parsingPage,
  startParsing,
  tasksPage,
  tasksInWork,
  tasksPerformed,
} from "../../controllers/admin/parsing.js";

const router = Router();

router.get('/', parsingPage);
router.post('/start', startParsing);

router.get('/tasks', tasksPage);
router.post('/tasks/in-work', tasksInWork);
router.post('/tasks/performed', tasksPerformed);

export default router;