import {Router} from 'express';
import {
  likeArticle,
  getArticles,
} from "../../controllers/api/articles.js";

const router = Router();

router.get('/', getArticles);

router.post('/like', likeArticle);

export default router;