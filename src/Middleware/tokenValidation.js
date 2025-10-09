import { getResetToken } from "../Models/resetPassword.model.js";
import { hashToken } from "../Utils/tokenUtils.js";

export const validateResetToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        //token provided?
        if (!token) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Reset token is required",
                }
            );
        };

        const hashedToken = hashToken(token);  // hash it because the database stored the hashed one not the plain!

        // token exists in the database? 
        const resetToken = await getResetToken(hashedToken);    // het the hashed token from the database
        if (!resetToken) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Token Not Found",
                }
            );
        };

        // token expired? :
        if (new Date() > new Date(resetToken.expires_at)) {
            return res.status(400).json(
                {
                    success: false,
                    message: " Reset token has expired."
                }
            );
        };

        //token used? :
        if (resetToken.used) {
            return res.status(400).json(
                {
                    success: false,
                    message: " Reset token already used."
                }
            );
        };

        // All checks passed! Attach token data to request
        req.resetToken = resetToken;    // ← ATTACHES FULL DATABASE ROW

        next();

    } catch (error) {
        console.error("Token reset validation error", error.message);
        res.status(500).json(
            {
                success: false,
                message: "Internal server error during token validation"
            }
        );
    };
};