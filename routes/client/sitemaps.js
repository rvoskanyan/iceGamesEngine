import {Router} from "express";
import {
  indexSitemap,
  catalogSitemap,
  blogSitemap,
  ratingSitemap,
} from "./../../controllers/client/sitemaps.js";

const router = Router();

router.get('/index.xml', indexSitemap);
router.get('/catalog.xml', catalogSitemap);
router.get('/blog.xml', blogSitemap);
router.get('/rating.xml', ratingSitemap);

export default router;