import {Router} from 'express';
import {
  pageActivationServices,
  pageAddActivationService,
  addActivationService,
  pageEditActivationService,
  editActivationService,
  pageAddActivationStage,
  addActivationStage,
} from "../../controllers/admin/activationServices.js";

const router = Router();

router.get('/', pageActivationServices);
router.get('/add', pageAddActivationService);
router.post('/add', addActivationService);
router.get('/edit/:id', pageEditActivationService);
router.post('/edit/:id', editActivationService);
router.get('/:id/add-activation-stage', pageAddActivationStage);
router.post('/:id/add-activation-stage', addActivationStage);

export default router;