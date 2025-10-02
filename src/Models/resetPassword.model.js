import database from "../Config/database.js";




export const storeResetToken = async (userId, hashedToken, expiresAt) => {
    try {

        const { result } = await database.pool.query(
            "INSERT INTO  password_reset_tokens (user_id, token, expires_at) VALUES(?, ?, ?)",
            [userId, hashedToken, expiresAt]
        );
        return result.insertId;

    } catch (error) {
        console.error("Error occured while storing the reset token");
        throw error;
    }
};

export const getResetToken = async () => {
    try {
        const [result] = await database.pool.query(
            'SELECT * FROM password_reset_tokens'
        )

    } catch (error) {
        console.error('Error occured while getting the reset token');
        throw error;

    }
}
