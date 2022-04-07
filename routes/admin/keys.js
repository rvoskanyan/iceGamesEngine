import {Router} from 'express';
import {
  pageKeys,
  pageAddKey,
  addKey
} from "../../controllers/admin/keys.js";

const router = Router();

router.get('/', pageKeys);
router.get('/add', pageAddKey);
router.post('/add', addKey);

export default router;