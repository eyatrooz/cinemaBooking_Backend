
import {

    storeResetToken,
    getResetToken,
    markTokenAsUsed,
    deleteResetToken,
    deleteAllExpiredToken

} from "../Models/resetPassword.model.js";

import { getUserByEmail, updateUserPassword } from "../Models/user.model.js";
import { generateResetToken, hashToken, setTokenExpirationTime } from "../Utils/tokenUtils.js";
import { passwordValidation } from "../Middleware/userValidation.js";
import { sendResetCodeToEmail } from "../Utils/emailService.js";



export const requestPasswordResetController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Email is required",
                }
            );
        };

        const user = await getUserByEmail(email);

        if (user) {

            const token = generateResetToken(); // Generate Reset token
            const hashedToken = hashToken(token);

            // store the reset token in the database
            const storeToken = await storeResetToken(user.id, hashedToken);

            // try to send the token (code) to the user's email but don't crash if it fails
            try {

                //send the token (code) to user's email
                await sendResetCodeToEmail(user.email, token);

            } catch (emailError) {
                console.error("Failed to send the reset password code to the email", emailError.message);
            }
        };

        return res.status(200).json({
            success: true,
            message: "If the email exists, a reset link has been sent"
        });


    } catch (error) {
        console.error("Error occurred while requestPasswordResetController().", error.message);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error in requestPasswordResetController()."
            }
        );

    };
};

export const resetPasswordController = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Password is required."
                }
            );
        };

        const validatePassword = passwordValidation(newPassword);
        if (!validatePassword.isValid) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Password validation failed.",
                    errors: validatePassword.errors,
                }
            );
        };

        // Get the validated token data from middleware that have all token info
        const resetTokenData = req.resetToken;

        // Get the user associated with this token
        // we need to know WHICH USER is resetting their password to find the token and update the password!
        const userId = resetTokenData.user_id;

        //update the user's password in the database
        await updateUserPassword(userId, newPassword);

        // mark the token as used so it can never be used again
        await markTokenAsUsed(resetTokenData.id);

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        console.error("Error occurred while resetPasswordController().", error.message);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error in resetPasswordController()."
            }
        );
    };
};
