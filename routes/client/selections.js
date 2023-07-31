import { Router } from "express";
import { selectionsPage, selectionPage } from "../../controllers/client/selections.js";

const router = Router();

router.get('/', selectionsPage);
router.get('/:alias', selectionPage);

export default router;