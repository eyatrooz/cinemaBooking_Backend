import database from "../Config/database.js";




export const storeResetToken = async (userId, hashedToken) => {
    try {

        const [result] = await database.pool.query(
            'INSERT INTO  password_reset_tokens (user_id, token, expires_at) VALUES(?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
            [userId, hashedToken]
        );
        return result.insertId;

    } catch (error) {
        console.error("Error occured while storing the reset token");
        throw error;
    }
};

export const getResetToken = async (hashedToken) => {
    try {
        const [row] = await database.pool.query('SELECT * FROM password_reset_tokens WHERE token = ?', [hashedToken]);
        return row[0];

    } catch (error) {
        console.error('Error occurred while getting the reset token');
        throw error;

    }
};

export const markTokenAsUsed = async (tokenId) => {
    try {
        const [result] = await database.pool.query('UPDATE password_reset_tokens SET used = true Where id = ?', [tokenId]);
        return result.affectedRows;

    } catch (error) {
        console.error('Error occurred while marked the token as used');
        throw error;
    }
};

export const deleteResetToken = async (tokenId) => {
    try {
        const [result] = await database.pool.query('DELETE FROM password_reset_tokens WHERE id = ?', [tokenId]);
        return result.affectedRows;

    } catch (error) {
        console.error('Error occurred while deleting reset tokens');
        throw error;

    }
}
export const deleteAllExpiredToken = async () => {
    try {
        const [result] = await database.pool.query('DELETE FROM password_reset_tokens WHERE expires_at < NOW()');
        return result.affectedRows;

    } catch (error) {
        console.error('Error occurred while deleting expired tokens');
        throw error;
    };
};


