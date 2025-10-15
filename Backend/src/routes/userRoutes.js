import express from "express";
import { validateCreateUser } from "../middleware/validation.js"
import {
  createUser,
  getAllUsers,
  getUserById
} from "../controllers/userController.js"

const router = express.Router();

router.post('/', validateCreateUser, createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
