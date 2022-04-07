import {Router} from 'express';
import {
  registrationValidator,
  authValidator,
} from './../../utils/validators.js';
import {
  registration,
  auth,
} from './../../controllers/client/formActions.js';

const router = Router();

router.post('/reg', registrationValidator, registration);
router.post('/auth', authValidator, auth);

export default router;