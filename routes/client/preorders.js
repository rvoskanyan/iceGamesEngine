import {Router} from "express";
import {preordersPage} from "./../../controllers/client/preorders.js";

const router = Router();

router.get('/', preordersPage);

export default router;