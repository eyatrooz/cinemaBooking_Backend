import database from "../Config/database.js";

export const createHall = async (hallData) => {
    try {

        const { name, totalSeats, hallType, hallStatus } = hallData;

        const [result] = await database.pool.query(
            'INSERT INTO halls (name, total_seats, hall_type, status) VALUES(?, ?, ?, ?)',
            [name, totalSeats, hallType, hallStatus]
        );

        return result.insertId;

    } catch (error) {
        console.error('Error occurred in createHall model', error.message);
        throw error;
    };
};

export const getAllHalls = async (limit = null, offset = null) => {
    try {
        let query = 'SELECT * FROM halls WHERE is_deleted = FALSE';
        const params = [];

        if (limit !== null && offset !== null) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const [rows] = await database.pool.query(query, params);
        return rows;

    } catch (error) {
        console.error('Error occurred in getAllHalls model', error.message);
        throw error;
    }
};

// ADDED - New count (number) function for getAllHalls 
export const getTotalHallsCount = async () => {
    try {
        const [result] = await database.pool.query('SELECT COUNT(*) AS total FROM halls WHERE is_deleted = FALSE');
        return result[0].total;

    } catch (error) {
        console.error('Error occurred in getAllHalls model', error.message);
        throw error;
    }
};


export const getActiveHalls = async (limit = null, offset = null) => {
    try {
        let query = `SELECT * FROM halls WHERE status = 'active' AND is_deleted = FALSE ORDER BY name`;
        const params = [];

        if (limit !== null && offset !== null) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const [rows] = await database.pool.query(query, params);
        return rows;

    } catch (error) {
        console.error('Error occurred in getActiveHalls model', error.message);
        throw error;
    }
};

// ADDED - New count function for getActiveHalls
export const getActiveHallsCount = async () => {
    try {
        const [result] = await database.pool.query('SELECT COUNT(*) AS total FROM hall WHERE status = "active" AND is_deleted = false');
        return result[0].total;

    } catch (error) {
        console.error('Error occurred in getActiveHallsCount model', error.message);
        throw error;
    }
};

// UPDATED - Added limit and offset parameters for pagination
export const getHallsByType = async (hallType, limit = null, offset = null) => {
    try {
        let query = `SELECT * FROM halls WHERE hall_type = ?`;
        const params = [hallType];

        if (limit !== null && offset !== null) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const [rows] = await database.pool.query(query, params);
        return rows;

    } catch (error) {
        console.error('Error occurred in getHallsByType model', error.message);
        throw error;
    }
};

// ADDED - New count function for getHallsByType
export const getHallsByTypeCount = async (hallType) => {
    try {
        const [result] = await database.pool.query(
            `SELECT COUNT(*) as total FROM halls WHERE hall_type = ?`,
            [hallType]
        );
        return result[0].total;

    } catch (error) {
        console.error('Error occurred in getHallsByTypeCount model', error.message);
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

// UPDATED - Added limit and offset parameters
export const getHallsByStatus = async (status, limit = null, offset = null) => {
    try {
        let query = `SELECT * FROM halls WHERE status = ? AND is_deleted = FALSE ORDER BY name`;
        const params = [status];

        if (limit !== null && offset !== null) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const [rows] = await database.pool.query(query, params);
        return rows;

    } catch (error) {
        console.error('Error occurred in getHallsByStatus model', error.message);
        throw error;
    }
};

// ADDED - New count function for getHallsByStatus
export const getHallsByStatusCount = async (status) => {
    try {
        const [result] = await database.pool.query(
            `SELECT COUNT(*) as total FROM halls WHERE status = ? AND is_deleted = FALSE`,
            [status]
        );
        return result[0].total;

    } catch (error) {
        console.error('Error occurred in getHallsByStatusCount model', error.message);
        throw error;
    }
};

// Soft delete - Just update the status and set deleted to true
export const deleteHall = async (id) => {
    try {
        const [result] = await database.pool.query(
            `UPDATE halls 
             SET status = 'closed', is_deleted = TRUE 
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
            `SELECT COUNT(*) AS count FROM screenings WHERE theater_id = ?`, [id]
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

// UPDATED - Added limit and offset parameters
export const getDeletedHalls = async (limit = null, offset = null) => {
    try {
        let query = `SELECT * FROM halls WHERE is_deleted = TRUE ORDER BY name`;
        const params = [];

        if (limit !== null && offset !== null) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const [rows] = await database.pool.query(query, params);
        return rows;

    } catch (error) {
        console.error('Error occurred in getDeletedHalls model', error.message);
        throw error;
    }
};

//ADDED - New count function for getDeletedHalls
export const getDeletedHallsCount = async () => {
    try {
        const [result] = await database.pool.query(
            `SELECT COUNT(*) as total FROM halls WHERE is_deleted = TRUE`
        );
        return result[0].total;

    } catch (error) {
        console.error('Error occurred in getDeletedHallsCount model', error.message);
        throw error;
    }
};

export const updateHall = async (id, hallData) => {
    try {
        const { name, totalSeats, hallType, hallStatus } = hallData;
        const [result] = await database.pool.query(
            `
           UPDATE halls
           SET name = ?, total_seats = ?, hall_type = ?, status = ?
           WHERE id = ? AND is_deleted = FALSE`,
            [name, totalSeats, hallType, hallStatus, id]
        );
        return result.affectedRows;


    } catch (error) {
        console.error('Error occurred in updateHall model', error.message);
        throw error;
    }
};

export const restoreHall = async (id) => {
    try {

        const [result] = await database.pool.query(
            `UPDATE halls 
            SET status = 'active', is_deleted = FALSE
            WHERE id = ?`, [id]
        );
        return result.affectedRows;


    } catch (error) {
        console.error('Error occurred in restoreHall model', error.message);
        throw error;
    }
};

export const getAllHallsIncludeDeleted = async (limit = null, offset = null) => {
    try {
        let query = `SELECT * FROM halls`;
        const params = [];

        if (limit !== null && offset !== null) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const [rows] = await database.pool.query(query, params);
        return rows

    } catch (error) {
        console.error('Error occurred in getAllHallsIncludeDeleted model', error.message);
        throw error;
    }
};

// ADDED - New count function for getAllHallsIncludeDeleted
export const getAllHallsIncludeDeletedCount = async () => {
    try {
        const [result] = await database.pool.query(`SELECT COUNT(*) as total FROM halls`);
        return result[0].total;

    } catch (error) {
        console.error('Error occurred in getAllHallsIncludeDeletedCount model', error.message);
        throw error;
    }
};


