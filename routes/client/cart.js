import {Router} from 'express';
import {
  cartPage,
} from './../../controllers/client/cart.js';

const router = Router();

router.get('/', cartPage);

export default router;