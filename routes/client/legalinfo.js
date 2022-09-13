import {Router} from 'express';
import {
  legalInfoHomePage,
  legalInfoAgreementPage,
  privacyPolicyPage,
} from "../../controllers/client/legalinfo.js";

const router = Router();

router.get('/', legalInfoHomePage);
router.get('/agreement', legalInfoAgreementPage);
router.get('/privacy-policy', privacyPolicyPage);

export default router;