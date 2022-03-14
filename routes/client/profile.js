const {Router} = require('express');
const {
  profilePage,
  profileEditPage,
  profileEdit,
  profileAchievementsPage,
  profileInvitePage,
  profileOrdersPage,
  profileFavoritesPage,
} = require("../../controllers/client/profile");
const {editProfileValidator} = require("../../utils/validators");

const router = Router();

router.get('/', profilePage);

router.get('/edit', profileEditPage);
router.post('/edit', editProfileValidator, profileEdit);

router.get('/achievements', profileAchievementsPage);

router.get('/invite', profileInvitePage);

router.get('/orders', profileOrdersPage);

router.get('/favorites', profileFavoritesPage);

module.exports = router;