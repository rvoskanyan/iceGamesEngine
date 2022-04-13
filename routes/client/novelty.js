import {Router} from "express";
import {noveltyPage} from "./../../controllers/client/novelty.js";

const router = Router();

router.get('/', noveltyPage);

export default router;