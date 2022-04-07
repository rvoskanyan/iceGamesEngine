import {Router} from 'express';
import {
  pageDevelopers,
  pageAddDeveloper,
  addDeveloper,
} from "./../../controllers/admin/developrs.js";

const router = Router();

router.get('/', pageDevelopers);
router.get('/add', pageAddDeveloper);
router.post('/add', addDeveloper);

export default router;