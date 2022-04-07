import {Router} from 'express';
import {
  pageRegions,
  pageAddRegion,
  addRegion,
} from "../../controllers/admin/regions.js";

const router = Router();

router.get('/', pageRegions);
router.get('/add', pageAddRegion);
router.post('/add', addRegion);

export default router;