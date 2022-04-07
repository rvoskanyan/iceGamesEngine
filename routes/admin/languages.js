import {Router} from 'express';
import {
  pageLanguages,
  pageAddLanguage,
  addLanguage,
} from "../../controllers/admin/languages.js";

const router = Router();

router.get('/', pageLanguages);
router.get('/add', pageAddLanguage);
router.post('/add', addLanguage);

export default router;