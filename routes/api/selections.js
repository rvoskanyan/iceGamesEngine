import { Router } from "express";
import { getSelections } from "../../controllers/api/selections.js";

const router = Router();

router.get('/', getSelections);

export default router;