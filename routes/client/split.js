import { Router } from "express";
import { splitInfoPage } from "../../controllers/client/split.js";

const router = Router();

router.get('/', splitInfoPage);

export default router;