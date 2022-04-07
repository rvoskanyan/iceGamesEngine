import {Router} from 'express';
import {
  pageUsp,
  pageAddUsp,
  addUsp
} from "./../../controllers/admin/usp.js";

const router = Router();

router.get('/', pageUsp);
router.get('/add', pageAddUsp);
router.post('/add', addUsp);

export default router;