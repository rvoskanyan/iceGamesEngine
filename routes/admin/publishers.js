import {Router} from 'express';
import {
  pagePublishers,
  pageAddPublishers,
  addPublishers,
} from '../../controllers/admin/publishers.js';

const router = Router();

router.get('/', pagePublishers);
router.get('/add', pageAddPublishers);
router.post('/add', addPublishers);

export default router;