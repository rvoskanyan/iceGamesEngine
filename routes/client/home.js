import { Router } from 'express';
import { homepage } from './../../controllers/client/home.js';

const router = Router();

router.get('/', homepage);

export default router;