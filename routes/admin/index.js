import {Router} from 'express';
import {index} from './../../controllers/admin/index.js';

const router = Router();

router.get('/', index);

export default router;