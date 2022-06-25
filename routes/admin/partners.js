import {Router} from "express";
import {
  pagePartners,
  pageAddPartner,
  addPartner,
  pageEditPartners,
  editPartner,
} from "../../controllers/admin/partners.js";

const router = Router();

router.get('/', pagePartners);

router.get('/add', pageAddPartner);
router.post('/add', addPartner);

router.get('/edit/:partnerId', pageEditPartners);
router.post('/edit/:partnerId', editPartner);

export default router;