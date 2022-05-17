import {Router} from 'express';
import {
  legalInfoHomePage,
  legalInfoAgreementPage,
} from "../../controllers/client/legalinfo.js";

const router = Router();

router.get('/', legalInfoHomePage);
router.get('/agreement', legalInfoAgreementPage);

export default router;