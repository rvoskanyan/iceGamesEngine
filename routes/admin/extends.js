import {Router} from "express";
import {
  pageExtends,
  pageAddExtend,
  addExtend,
} from "../../controllers/admin/extends.js";

const router = Router();

router.get('/', pageExtends);
router.get('/add', pageAddExtend);
router.post('/add', addExtend);

export default router;