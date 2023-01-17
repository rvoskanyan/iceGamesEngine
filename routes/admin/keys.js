import {Router} from 'express';
import {
  pageKeys,
  pageAddKey,
  addKey,
  editKeyPage,
  editKey,
} from "../../controllers/admin/keys.js";

const router = Router();

// TODO rename addKey function to FormActionKey

router.get('/', pageKeys);
router.get('/add', pageAddKey);
router.post('/add', addKey);
router.get('/edit/:keyId', editKeyPage);
router.post('/edit/:keyId', editKey);
export default router;