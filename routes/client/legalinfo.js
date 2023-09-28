import {Router} from 'express';
import {
  legalInfoHomePage,
  legalInfoAgreementPage,
  privacyPolicyPage,
  licenseAgreementOfferPage,
  serviceOfferAgreementPage,
  publicOfferForUseYaSplitPage,
} from "../../controllers/client/legalinfo.js";

const router = Router();

router.get('/', legalInfoHomePage);
router.get('/agreement', legalInfoAgreementPage);
router.get('/privacy-policy', privacyPolicyPage);
router.get('/license-agreement-offer', licenseAgreementOfferPage);
router.get('/license-agreement-offer', licenseAgreementOfferPage);
router.get('/service-offer-agreement', serviceOfferAgreementPage);
router.get('/public-offer-for-use-ya-split', publicOfferForUseYaSplitPage);


export default router;