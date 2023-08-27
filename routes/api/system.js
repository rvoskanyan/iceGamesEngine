import { Router } from "express";
import { switchPlatform } from "../../controllers/api/system.js";

const router = Router();

router.get('/switchPlatform', switchPlatform);

export default router;