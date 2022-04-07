import {Router} from 'express';
import {
  pagePlatforms,
  pageAddPlatform,
  addPlatform,
} from "../../controllers/admin/platforms.js";

const router = Router();

router.get('/', pagePlatforms);
router.get('/add', pageAddPlatform);
router.post('/add', addPlatform);

export default router;