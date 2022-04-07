import {Router} from 'express';
import {
  blogHomePage,
  blogArticlePage,
} from './../../controllers/client/blog.js';

const router = Router();

router.get('/', blogHomePage);
router.get('/:alias', blogArticlePage);

export default router;