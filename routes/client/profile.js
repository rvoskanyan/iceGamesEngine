const {Router} = require('express');
const {
  profilePage,
  profileEditPage,
  profileEdit,
  profileAchievementsPage,
  profileInvitePage,
  profileOrdersPage,
  profileFavoritesPage,
  profileViewPage,
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

router.get('/view/:login', profileViewPage);

module.exports = router;