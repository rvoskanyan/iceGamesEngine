import {Router} from 'express';
import {
  pageGenres,
  pageAddGenres,
  addGenres,
  pageEditGenres,
  editGenres,
} from "../../controllers/admin/genres.js";

const router = Router();

router.get('/', pageGenres);

router.get('/add', pageAddGenres);
router.post('/add', addGenres);

router.get('/edit/:genreId', pageEditGenres);
router.post('/edit/:genreId', editGenres);

export default router;