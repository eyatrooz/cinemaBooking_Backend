import database from "../Config/database.js";

export const getAllMovies = async () => {
    try {
        const [rows] = await database.pool.query('SELECT * FROM movies');
        return rows;

    } catch (error) {
        console.error("Error occurred in getAllMovies() model! :", error.message);
        throw error;
    };
};

export const getMovieById = async (id) => {
    try {
        const [row] = await database.pool.query('SELECT * FROM movies WHERE id = ?', [id]);
        return row[0] || null;

    } catch (error) {
        console.error("Error occurred in getMovieById() model! :", error.message);
        throw error;
    };
};

export const createMovie = async (movieData) => {
    try {
        const { title, mainCast, duration, genre, rating, posterUrl, release_date } = movieData;

        const [result] = await database.pool.query(
            'INSERT INTO movies (title, main_cast, duration, genre, rating, poster_url, release_date) VALUES (?, ?, ?, ?, ?, ?, ? )',
            [title, mainCast, duration, genre, rating, posterUrl, release_date]
        );
        return result.insertId;

    } catch (error) {
        console.error("Error occurred in createMovie() model! :", error.message);
        throw error;
    };
};

export const updateMovie = async (id, movieData) => {
    try {
        const { title, mainCast, duration, genre, rating, posterUrl, release_date } = movieData;

        const [result] = await database.pool.query(
            `
             UPDATE movies 
             SET title = ?, main_cast = ?, duration = ?, genre = ?, rating = ?, poster_url = ?, release_date = ?
             WHERE id = ? `, [title, mainCast, duration, genre, rating, posterUrl, release_date, id]

        );
        return result.affectedRows;

    } catch (error) {
        console.error("Error occurred in updateMovie() model! :", error.message);
        throw error;
    };
};

export const deleteMovie = async (id) => {
    try {
        const [result] = await database.pool.query('DELETE FROM movies WHERE id = ?', [id]);
        return result.affectedRows;

    } catch (error) {
        console.error("Error occurred in deleteMovie() model! :", error.message);
        throw error;
    };
};

export const searchMovieByTitle = async (searchTerm) => {
    try {
        const [rows] = await database.pool.query(
            'SELECT * FROM movies WHERE title LIKE ? ORDER BY title', [`%${searchTerm}%`]
        );
        return rows;

    } catch (error) {
        console.error("Error occurred in searchMovieByTitle() model! :", error.message);
        throw error;
    };
};

export const getMoviesByGenre = async (genre) => {
    try {
        const [rows] = await database.pool.query(
            'SELECT * FROM movies WHERE genre = ? ORDER BY release_date DESC', [genre]
        );
        return rows;

    } catch (error) {
        console.error("Error occurred in getMoviesByGenre() model! :", error.message);
        throw error;
    };
};


