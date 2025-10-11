import database from "../Config/database";

export const createHall = async (hallData) => {
    try {

        const { name, totalSeats, hallType, hallStatus } = hallData;

        const [result] = await database.pool.query(
            'INSERT INTO halls (name, total_seats, hall_type, hall_status) VALUES(?, ?, ?, ?)',
            [name, totalSeats, hallType, hallStatus]
        );

        return result.insertId;

    } catch (error) {
        console.error('Error occurred in createHall model', error.message);
        throw error;
    };
};

export const getAllHalls = async () => {
    try {
        const [rows] = await database.pool.query('SELECT * FROM halls WHERE ia_deleted = FALSE');
        return rows;

    } catch (error) {
        console.error('Error occurred in getAllHalls model', error.message);
        throw error;
    }
};

export const getActiveHalls = async () => {
    try {

        const [rows] = await database.pool.query(
            `SELECT * FROM halls WHERE hall_status = 'active' AND is_deleted = FALSE, ORDER BY name `
        );

        return rows;

    } catch (error) {
        console.error('Error occurred in getActiveHalls model', error.message);
        throw error;
    }
};

export const getHallsByType = async (hallType) => {
    try {
        const [rows] = await database.pool.query(
            `SELECT * FROM halls WHERE hall_type = ?`, [hallType]
        );
        return rows;

    } catch (error) {
        console.error('Error occurred in getHallsByType model', error.message);
        throw error;
    }
};

export const getHallById = async (id) => {
    try {
        const [row] = await database.pool.query('SELECT * FROM halls WHERE id = ?', [id]);
        return row[0] || null;

    } catch (error) {
        console.error('Error occurred in getHallById model', error.message);
        throw error;
    }
};

export const getHallsByStatus = async (status) => {
    try {

        const [rows] = await database.pool.query(
            `SELECT * FROM halls WHERE hall_status = ? AND is_deleted = FALSE ORDER BY name `, [status]
        );

        return rows;

    } catch (error) {
        console.error('Error occurred in getHallsByStatus model', error.message);
        throw error;
    }
};


export const getDeletedHalls = async () => {
    try {

        const [rows] = await database.pool.query(`SELECT * FROM halls WHERE is_deleted = TRUE ORDER BY name`);
        return rows;

    } catch (error) {
        console.error('Error occurred in getDeletedHalls model', error.message);
        throw error;
    }
};
export const updateHall = async (id, hallData) => {
    try {
        const { name, totalSeats, hallType, hallStatus } = hallData;
        const [result] = await database.pool.query(
            `
           UPDATE halls
           SET name = ?, SET total_seats = ?, hall_type = ?, hall_status = ?
           WHERE id = ? AND is_deleted = FALSE`,
            [name, totalSeats, hallType, hallStatus, id]
        );
        return result.affectedRows;


    } catch (error) {
        console.error('Error occurred in updateHall model', error.message);
        throw error;
    }
};

// Soft delete - Just update the status and set deleted to true
export const deleteHall = async (id) => {
    try {
        const [result] = await database.pool.query(
            `UPDATE halls 
             SET hall_status = 'closed', is_deleted = TRUE 
             WHERE id = ?`, [id]
        );
        return result.affectedRows;

    } catch (error) {
        console.error('Error occurred in deleteHall model', error.message);
        throw error;
    }
};

// HARD DELETE - Permanently 
export const permanentlyDeleteHall = async (id) => {
    try {

        // Before permanently deleting a hall, check if it has any screenings PAST or PRESENT
        const [screenings] = await database.pool.query(
            ` SELECT COUNT(*) FROM screenings WHERE theater_id = ?`, [id]
        );

        if (screenings[0].count > 0) {

            throw new Error("Cannot permanently delete a hall with screenings history, use soft delete instead");
        };

        const [result] = await database.pool.query(`DELETE FROM halls WHERE id = ?`, [id]);
        return result.affectedRows;



    } catch (error) {
        console.error('Error occurred in permanentlyDeleteHall model', error.message);
        throw error;
    }
};

export const restoreHall = async (id) => {
    try {

        const [result] = await database.pool.query(
            `UPDATE halls 
            SET hall_status = 'active', is_deleted = FALSE
            WHERE id = ?`, [id]
        );
        return result.affectedRows;


    } catch (error) {
        console.error('Error occurred in restoreHall  model', error.message);
        throw error;
    }
};

export const getAllHallsIncludeDeleted = async () => {
    try {
        const [rows] = await database.pool.query(`SELECT * FROM halls`);
        return rows

    } catch (error) {
        console.error('Error occurred in getAllHallsIncludeDeleted model', error.message);
        throw error;
    }
};


