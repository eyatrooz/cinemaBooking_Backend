import database from "../Config/database.js";
import bcrypt from 'bcrypt';




export const hashPassword = async (password) => {
    try {

        const saltRound = parseInt(process.env.SALTROUND) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        return hashedPassword;

    } catch (error) {
        console.error('Error hashing password:', error.message);
        throw new Error('Hashing password failed');
    }
};

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

export const deleteUser = async (id) => {
    try {
        const [result] = await database.pool.query('DELETE FROM users WHERE id = ?', [id]);

        return result.affectedRows;   // Returns number of rows deleted (typically 1 if successfull)

    } catch (error) {
        console.error(' Database error occured in deleteUser', error.message);
        throw error;
    }
};

