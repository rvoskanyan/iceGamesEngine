import { Router } from "express";
import { yaSplitHandler } from "../../controllers/v1/index.js";
import bodyParser from "body-parser";

const router = Router();

router.post('/webhook', bodyParser.raw({ type: 'application/octet-stream' }), yaSplitHandler);

export default router;