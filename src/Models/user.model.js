import database from "../Config/database.js";
import { hashPassword } from "../Utils/userUtils.js";


// for auth controller
export const getAllUsers = async () => {
    try {
        const [rows] = await database.pool.query('SELECT * FROM users')
        return rows;         // If successful, return the rows

    } catch (error) {
        // If it fails, execute this code block instead of crashing
        console.error('error occured in getAllUser,', error.message);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const [row] = await database.pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return row[0];     // use rows[0] because we are querying by a unique ID, so you know the result will have either 0 or 1 items.

    } catch (error) {
        console.error('Error occured in getUserById', error.message);
        throw error;
    }
};

export const getUserByEmail = async (userEmail) => {
    try {

        // Convert to lowercase for consistent searching 
        const normalizedEmail = userEmail.trim().toLowerCase();

        const [rows] = await database.pool.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
        return rows[0];

    } catch (error) {
        console.error('Error occured in getUserByEmail', error.message);
        throw error;
    };
};


export const createUser = async (newUser) => {
    try {
        const { name, password, email, phone } = newUser;

        const hashedPassword = await hashPassword(password);

        const [result] = await database.pool.query(

            'INSERT INTO users (name, password, email, phone) VALUES (?, ? ,? , ?)', [name, hashedPassword, email, phone]
        );

        return result.insertId;    // insertId gives us the auto-generated ID of the newly created user

    } catch (error) {
        console.error(' Database error occured in createUser', error.message);
        throw error;
    }
};

export const updateUser = async (id, updatedUser) => {
    try {

        const { name, password, email, phone, } = updatedUser;
        const hashedPassword = await hashPassword(password);
        const [result] = await database.pool.query(
            ' UPDATE users SET name = ?, password = ?, email = ?, phone = ? WHERE id = ?', [name, hashedPassword, email, phone, id]
        );
        return result.affectedRows;  // Returns number of rows updated (typically 1 if successfull)

    } catch (error) {
        console.error(' Database error occured in updateUser', error.message);
        throw error;
    }
};

export const updateUserPassword = async (userId, newPassword) => {
    try {

        const hashedPassword = await hashPassword(newPassword);
        const [result] = await database.pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        return result.affectedRows;

    } catch (error) {
        console.error("Error occured while updating user password.");
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const [result] = await database.pool.query('DELETE FROM users WHERE id = ?', [id]);

        return result.affectedRows;   // Returns number of rows deleted (typically 1 if successfull)

    } catch (error) {
        console.error(' Database error occured in deleteUser', error.message);
        throw error;
    }
};


// Getting all users without the password
export const getAllUsersSafe = async () => {
    try {
        const [rows] = await database.pool.query(
            'SELECT id, name, email, phone, role, created_at, updated_at FROM users'
        );
        return rows;

    } catch (error) {
        console.error('Error occured in getAllUsersSafe.', error.message);
        throw error;
    };
};


// Getting a users without the password
export const getUserByIdSafe = async (id) => {
    try {
        const row = await database.pool.query(
            'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?', [id]
        );
        return row[0];

    } catch (error) {
        console.error('Error occured in getUsersByIdSafe.', error.message);
        throw error;

    }
};


