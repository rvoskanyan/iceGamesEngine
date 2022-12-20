import {Router} from "express";
import {
  confirm_email,
  get_code,
  getUsers, resend_code,
} from "../../controllers/api/users.js";

const router = Router();

router.get('/', getUsers);
router.post('/get-code', get_code)
router.post('/confirm-code', confirm_email)
router.post('/resend-code', resend_code)

export default router;