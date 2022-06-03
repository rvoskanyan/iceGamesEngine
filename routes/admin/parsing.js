import {Router} from 'express';
import {
  parsingPage,
  startParsing,
  tasksPage,
  tasksInWork,
  tasksPerformed,
  tasksParsProduct,
  tasksRefusal,
} from "../../controllers/admin/parsing.js";

const router = Router();

router.get('/', parsingPage);
router.post('/start', startParsing);

router.get('/tasks', tasksPage);
router.post('/tasks/in-work', tasksInWork);
router.post('/tasks/refusal', tasksRefusal);
router.post('/tasks/performed', tasksPerformed);
router.post('/tasks/pars-product', tasksParsProduct);

export default router;