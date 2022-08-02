import {Router} from "express";
import {
  getUsers,
} from "../../controllers/api/users.js";

const router = Router();

router.get('/', getUsers);

export default router;