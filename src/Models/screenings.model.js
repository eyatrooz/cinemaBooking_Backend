import database from "../Config/database.js";

export const createScreening = async () => {
    try {
        const { movieId, hallId, showDate, showTime, price } = req.body;

        const [result] = await database.pool.query(
            ` INSERT INTO screenings (movie_id, hall_id, show_date, show_time, price, available_seats, screening_status)
              VALUES (?, ? , ? , ? , ?, (SELECT total_seats FROM halls WHERE id = ?), 'scheduled') `,
            [movieId, hallId, showDate, showTime, price, hallId]);

        return result.insertId;

    } catch (error) {
        console.error('Error in createScreening model:', error.message);
        throw error;
    }
};