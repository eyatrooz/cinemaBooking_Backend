import { Router } from "express";
import {
    getAllUsersController,
    getUserByIDController,
    createUserController,
    updateUserController,
    deleteUserController
} from "../Controllers/userController.js";

import { userCreationValidation, validateId } from "../Middleware/userValidation.js";

const router = Router();

router.get('/', getAllUsersController);

router.get('/:id', validateId, getUserByIDController);

router.post('/', userCreationValidation, createUserController);

router.put('/:id', validateId, userCreationValidation, updateUserController);

router.delete('/:id', validateId, deleteUserController);



export default router;