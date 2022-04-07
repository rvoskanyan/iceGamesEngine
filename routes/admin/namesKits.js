import {Router} from 'express';
import {
  pageNamesKits,
  pageAddNameKit,
  addNameKit,
} from "../../controllers/admin/namesKits.js";

const router = Router();

router.get('/', pageNamesKits);
router.get('/add', pageAddNameKit);
router.post('/add', addNameKit);

export default router;