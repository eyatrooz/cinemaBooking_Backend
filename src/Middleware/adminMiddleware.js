
import { getUserById } from "../Models/user.model.js";


export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {   // req.user : from authenticateUser function
            return res.status(401).json(
                {
                    success: false,
                    message: "Access denied, User not authenticated."
                }
            );
        };

        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found."
                }
            );
        };

        if (user.role !== "admin") {
            return res.status(403).json(
                {
                    success: false,
                    message: "Access denied, Admin privileges."
                }
            );
        };
        next();

    } catch (error) {
        console.error("Authentication middleware error:", error.message);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error occurred at adminRequired."
            }
        )

    }
};


