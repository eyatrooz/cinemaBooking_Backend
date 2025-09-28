
import { getUserById } from "../Models/user.model.js";

export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {   // req.user : from authmiddleware function
            return res.status(401).json(
                {
                    success: false,
                    message: "Access denied, User not authenticated."
                }
            );
        };
        const user = await getUserById(req.user.id);


    } catch (error) {

    }
};