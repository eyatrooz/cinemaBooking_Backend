
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

export const getUserByIDController = async (req, res) => {
    try {
        const userID = req.validatedId;
        const user = await getUserById(userID);

        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'User not found'
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: 'User found Successfully',
                userData: user
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: 'Error occured while getting user by its id',
                error: error.message
            }
        );
    };
};

export const createUserController = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const newUser = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            phone: phone ? phone.trim() : null,
        };
        const createNewUser = await createUser(newUser);   // createNewUser = id (database generates an ID when creating new user)

        return res.status(201).json(
            {
                success: true,
                message: ' A new user created successfully',
                userData: {
                    id: createNewUser,   // createNewUser = ID ( given automaticlly by the database)
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone
                }
            }
        );
    } catch (error) {

        // Handle the duplicate email 
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json(
                {
                    success: false,
                    message: 'Email address already exists',
                }
            );
        };

        return res.status(500).json(
            {
                success: false,
                message: 'An internal server error occured while creating new user',
                error: error.message
            }
        );
    };
};

export const updateUserController = async (req, res) => {
    try {
        const userID = req.validatedId;

        const existingUser = await getUserById(userID);
        if (!existingUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'No user with such id found'
                }
            );
        };

        const { name, email, password, phone } = req.body;

        const update = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            phone: phone ? phone.trim() : null,
        };

        const affectedRows = await updateUser(userID, update);

        return res.status(200).json(
            {
                success: true,
                message: ' User updated successfully',
                userData: {
                    id: userID,
                    email: update.email,
                    phone: update.phone
                }
            }
        );

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Email address already exixts'
                }
            );
        }
        return res.status(500).json(
            {
                success: false,
                message: 'An internal server error occured while updating new user',
                error: error.message
            }
        );
    };
};

export const deleteUserController = async (req, res) => {
    try {
        const userID = req.validatedId;

        const existingUser = await getUserById(userID);
        if (!existingUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'No user with such id found',
                }
            );
        };

        const affectedRows = await deleteUser(userID);

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already deleted',
            });
        };

        return res.status(200).json(
            {
                success: true,
                message: ` User ${existingUser.name} deleted successfully`,
            }
        );


    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: 'An internal server error occured while deleteing a user',
                error: error.message
            }
        );
    };
};