import {Router} from 'express';
import {
  achievementsPage,
  addAchievementPage,
  addAchievement,
  editAchievementPage,
  editAchievement,
} from '../../controllers/admin/achievements.js';

const router = Router();

router.get('/', achievementsPage);
router.get('/add', addAchievementPage);
router.post('/add', addAchievement);

router.get('/edit/:id', editAchievementPage);
router.post('/:id', editAchievement);

export default router;