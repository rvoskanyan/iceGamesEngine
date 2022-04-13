import {Router} from "express";
import {discountsPage} from "./../../controllers/client/discounts.js";

const router = Router();

router.get('/', discountsPage);

export default router;