import { Router } from "express";
import {
    getAllUsersController,
    getUserByIDController,
    createUserController,
    updateUserController,
    deleteUserController
} from "../Controllers/userController.js";

import { userCreationValidation, validateId } from "../Middleware/userValidation.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";

const router = Router();

router.get('/', authenticateUser, getAllUsersController);  // Keep public for now OR add authenticateUser

router.get('/:id', authenticateUser, validateId, getUserByIDController);  // Protect user profiles

router.post('/', userCreationValidation, createUserController);  // Public signup

router.put('/:id', authenticateUser, validateId, userCreationValidation, updateUserController);

router.delete('/:id', authenticateUser, validateId, deleteUserController);  // Protect deletion!



export default router;