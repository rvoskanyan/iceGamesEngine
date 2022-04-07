import {Router} from 'express';
import {likeArticle} from "../../controllers/api/articles.js";

const router = Router();

router.post('/like', likeArticle);

export default router;