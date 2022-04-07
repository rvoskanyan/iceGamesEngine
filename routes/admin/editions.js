import {Router} from 'express';
import {
  pageEditions,
  pageAddEdition,
  addEdition,
} from "../../controllers/admin/editions.js";

const router = Router();

router.get('/', pageEditions);
router.get('/add', pageAddEdition);
router.post('/add', addEdition);

export default router;