import { Router } from "express";
import { signUpController, logInController } from "../Controllers/authController.js";
import { userCreationValidation } from "../Middleware/userValidation.js";
import { requestPasswordResetController, resetPasswordController } from "../Controllers/passwordResetController.js";
import { validateResetToken } from "../Middleware/tokenValidation.js";

const router = Router();

// Authentication Routes
router.post('/signup', userCreationValidation, signUpController);
router.post('/login', logInController);

// Password Reset Routes
router.post('/requestReset', requestPasswordResetController);
router.post('/resetPassword', validateResetToken, resetPasswordController);

export default router;