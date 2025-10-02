import {

    storeResetToken,
    getResetToken,
    markTokenAsUsed,
    deleteResetToken,
    deleteAllExpiredToken

} from "../Models/resetPassword.model.js";

import { getUserByEmail } from "../Models/user.model.js";
import { generateResetToken, hashToken, setTokenExpireationTime } from "../Utils/tokenUtils.js";




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

        // Generate Reset token
        if (user) {

            const token = generateResetToken();

            //hash the token
            const hashedToken = hashToken(token);

            // set expireation time
            const expiresAt = setTokenExpireationTime(hashedToken);

            // store the reset token
            const storeToken = await storeResetToken(user.id, hashedToken, expiresAt);
        }

        return res.status(200).json({
            success: true,
            message: "If the email exists, a reset link has been sent"
        });


    } catch (error) {
        console.error("Error occured while requestPasswordResetController().", error.message);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error in requestPasswordResetController()."
            }
        );

    };
};
