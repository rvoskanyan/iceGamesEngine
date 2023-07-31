import {Router} from "express";
import {
  addItemSelectionPage,
  addItemSelection,
  addSelection,
  addSelectionPage,
  editSelection,
  editSelectionPage,
  getSelectionsPage,
  deleteItemSelection,
} from "../../controllers/admin/selections.js";

const router = Router();

router.get('/', getSelectionsPage);

router.get('/add', addSelectionPage);
router.post('/add', addSelection);

router.get('/edit/:selectionId', editSelectionPage);
router.post('/edit/:selectionId', editSelection);

router.get('/:selectionId/addItem', addItemSelectionPage);
router.post('/:selectionId/addItem', addItemSelection);

router.post('/:selectionId/deleteItem/:itemId', deleteItemSelection);

export default router;