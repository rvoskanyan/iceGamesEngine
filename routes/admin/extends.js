import {Router} from "express";
import {
  pageExtends,
  pageAddExtend,
  addExtend,
  pageEditExtend,
  editExtend,
} from "../../controllers/admin/extends.js";

const router = Router();

router.get('/', pageExtends);

router.get('/add', pageAddExtend);
router.post('/add', addExtend);

router.get('/edit/:extendId', pageEditExtend);
router.post('/edit/:extendId', editExtend);

export default router;