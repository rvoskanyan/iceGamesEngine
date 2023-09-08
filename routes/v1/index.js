import { Router } from "express";
import { yaSplitHandler } from "../../controllers/v1/index.js";

const router = Router();

router.post('/webhook', yaSplitHandler);

export default router;