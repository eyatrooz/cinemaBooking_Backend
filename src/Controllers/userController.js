import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../Models/user.model.js";

export const getAllUsersController = async (req, res) => {
    try {
        const allUsers = await getAllUsers();
        return res.status(200).json(
            {
                success: true,
                message: 'Fetching all users successfully',
                usersData: allUsers
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: 'Error occures while getting all users from database',
                error: error.message
            }
        );
    };
};