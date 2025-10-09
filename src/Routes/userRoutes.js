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
import { requireAdmin } from "../Middleware/adminMiddleware.js";

const router = Router();

// PRIVATE ROUTES
router.get('/', authenticateUser, requireAdmin, getAllUsersController);
router.get('/:id', authenticateUser, requireAdmin, validateId, getUserByIDController);
router.delete('/:id', authenticateUser, requireAdmin, validateId, deleteUserController);  // Protect deletion!

// PUBLIC ROUTES
router.post('/', userCreationValidation, createUserController);  // Public signup
router.put('/:id', authenticateUser, validateId, userCreationValidation, updateUserController);





export default router;