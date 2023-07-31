import { Router } from "express";
import { aboutPage } from "./../../controllers/client/about.js";

const router = Router();

router.get('/', aboutPage);

export default router;