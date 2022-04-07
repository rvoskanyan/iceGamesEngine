import {Router} from 'express';
import {
  pageGenres,
  pageAddGenres,
  addGenres
} from "../../controllers/admin/genres.js";

const router = Router();

router.get('/', pageGenres);
router.get('/add', pageAddGenres);
router.post('/add', addGenres);

export default router;