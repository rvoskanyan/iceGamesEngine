const {Router} = require('express');
const {
  registrationValidator,
  authValidator,
} = require('./../../utils/validators');
const {
  registration,
  auth,
} = require('./../../controllers/client/formActions');

const router = Router();

router.post('/reg', registrationValidator, registration);
router.post('/auth', authValidator, auth);

module.exports = router;