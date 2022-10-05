import {Router} from 'express';
import {
  logout,
  getCourse,
} from './../../controllers/client/system.js';

const router = Router();

router.get('/logout', logout);
router.get('/course', getCourse);

export default router;