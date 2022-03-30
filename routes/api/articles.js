const {Router} = require('express');
const {likeArticle} = require("../../controllers/api/articles");

const router = Router();

router.post('/like', likeArticle);

module.exports = router;