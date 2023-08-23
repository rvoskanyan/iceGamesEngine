import {Router} from 'express';
import {
  legalInfoHomePage,
  legalInfoAgreementPage,
  privacyPolicyPage,
  licenseAgreementOfferPage,
  serviceOfferAgreementPage,
} from "../../controllers/client/legalinfo.js";

const router = Router();

router.get('/', legalInfoHomePage);
router.get('/agreement', legalInfoAgreementPage);
router.get('/privacy-policy', privacyPolicyPage);
router.get('/license-agreement-offer', licenseAgreementOfferPage);
router.get('/license-agreement-offer', licenseAgreementOfferPage);
router.get('/service-offer-agreement', serviceOfferAgreementPage);


export default router;