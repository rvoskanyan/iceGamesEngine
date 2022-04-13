import {Router} from 'express';
import productsRoute from './api/products.js';
import articlesRoute from './api/articles.js';
import cartRoute from './api/cart.js';
import ordersRoute from './api/orders.js';
import externalRoute from './api/external.js';
import commentsRoute from './api/comments.js';

const router = Router();

router.use('/products', productsRoute);
router.use('/articles', articlesRoute);
router.use('/cart', cartRoute);
router.use('/order', ordersRoute);
router.use('/external', externalRoute);
router.use('/comments', commentsRoute);

export default router;