import {Router} from 'express';
import {
  profilePage,
  profileEditPage,
  profileEdit,
  profileAchievementsPage,
  profileInvitePage,
  profileOrdersPage,
  profileFavoritesPage,
  profileViewPage,
} from "../../controllers/client/profile.js";
import {editProfileValidator} from "../../utils/validators.js";

const router = Router();

router.get('/', profilePage);

router.get('/edit', profileEditPage);
router.post('/edit', editProfileValidator, profileEdit);

router.get('/achievements', profileAchievementsPage);

router.get('/invite', profileInvitePage);

router.get('/orders', profileOrdersPage);

router.get('/favorites', profileFavoritesPage);

router.get('/view/:login', profileViewPage);

export default router;