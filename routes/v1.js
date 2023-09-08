import {Router} from 'express';
import v1Route from './v1/index.js';

const router = Router();

router.use('/', v1Route);

export default router;