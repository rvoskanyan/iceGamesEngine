import {Router} from "express";
import {
  addItemSelectionPage,
  addItemSelection,
  editItemSelectionPage,
  addSelection,
  addSelectionPage,
  editSelection,
  editSelectionPage,
  getSelectionsPage,
  editItemSelection,
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

router.get('/:selectionId/editItem/:itemId', editItemSelectionPage);
router.post('/:selectionId/editItem/:itemId', editItemSelection);
router.post('/:selectionId/deleteItem/:itemId', deleteItemSelection);

export default router;