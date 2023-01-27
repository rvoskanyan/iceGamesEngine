import {Router} from "express";
import {pageSplitCatalog} from "../../controllers/client/splitCatalog.js";

const router = Router();

router.get('/:alias', pageSplitCatalog)

export default router;