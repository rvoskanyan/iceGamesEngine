import {Router} from 'express';
import productsRoute from './api/products.js';
import articlesRoute from './api/articles.js';
import cartRoute from './api/cart.js';
import ordersRoute from './api/orders.js';
import externalRoute from './api/external.js';
import commentsRoute from './api/comments.js';
import reviewsRoute from './api/rewiews.js';
import usersRoute from './api/users.js';
import paymentRoute from "./api/payment.js";

const router = Router();

router.use('/products', productsRoute);
router.use('/articles', articlesRoute);
router.use('/cart', cartRoute);
router.use('/order', ordersRoute);
router.use('/external', externalRoute);
router.use('/comments', commentsRoute);
router.use('/reviews', reviewsRoute);
router.use('/users', usersRoute);
router.use('/beta/payment', paymentRoute)

export default router;