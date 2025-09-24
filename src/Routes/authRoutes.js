import { Router } from "express";
import { signUpController, logInController } from "../Controllers/authController.js";
import { userCreationValidation } from "../Middleware/userValidation.js";
const router = Router();

router.post('/signup', userCreationValidation, signUpController);
router.post('/login', logInController);

export default router;