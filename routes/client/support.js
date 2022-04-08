import {Router} from "express";
import {supportPage} from "./../../controllers/client/support.js";

const router = Router();

router.get('/', supportPage);

export default router;