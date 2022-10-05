import {Router} from 'express';
import {
  logout,
} from './../../controllers/client/system.js';

const router = Router();

router.get('/logout', logout);

export default router;