
import {
    getAllMovies,
    getMoviesByGenre,
    getMovieById,
    deleteMovie,
    updateMovie,
    createMovie,
    searchMovieByTitle
} from "../Models/movies.model.js";

export const getAllMoviesController = async (req, res) => {
    try {

        const movies = await getAllMovies();
        return res.status(200).json(
            {
                success: true,
                message: 'Movies retrieved successfully',
                data: movies,
                count: movies.length
            }
        );

    } catch (error) {
        console.error('Error in getAllMoviesController:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to get all movies',
            }
        );
    };
};

export const getMovieByIdController = async (req, res) => {
    try {

        const movieId = parseInt(req.params.id);

        if (isNaN(movieId) || movieId <= 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid movie id format, ID must be an positive integer number"
                }
            );
        };

        const movie = await getMovieById(movieId);
        if (!movie) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Movie Not Found",
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "Movie retrieved successfully",
                data: movie
            }
        );

    } catch (error) {
        console.error('Error in getMovieByIdController:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to retrieve the movie',
            }
        );
    };
};

export const createMovieController = async (req, res) => {
    try {
        const { title, mainCast, duration, genre, rating, posterUrl, releaseDate } = req.body;

        const movieData = {
            title: title.trim(),
            mainCast: mainCast ? mainCast.trim() : null,
            duration: parseInt(duration),
            genre: genre ? genre.trim() : null,
            rating: rating ? parseFloat(rating) : null,
            posterUrl: posterUrl ? posterUrl.trim() : null,
            releaseDate: releaseDate ? releaseDate : null
        };

        const newMovieId = await createMovie(movieData);

        // fetch the created movie to to return a complete data
        const newMovie = await getMovieById(newMovieId);

        return res.status(201).json(
            {
                success: true,
                message: `The movie ${newMovie.title} created successfully`,
                data: newMovie
            }
        );

    } catch (error) {
        console.error('Error in createMovieController:', error.message);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json(
                {
                    success: false,
                    message: "Movie with this title already exists"
                }
            );
        }

        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to create the movie',
            }
        );
    };
};

export const updateMovieController = async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);

        if (isNaN(movieId) || movieId <= 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid movie id format, ID must be an positive integer number"
                }
            );
        };

        const existingMovie = await getMovieById(movieId);
        if (!existingMovie) {
            return res.status(404).json(
                {
                    success: false,
                    message: "There's no movie with such id"
                }
            );
        };

        const { title, mainCast, duration, genre, rating, posterUrl, releaseDate } = req.body;

        const update = {
            title: title !== undefined ? title.trim() : existingMovie.title,
            mainCast: mainCast !== undefined ? (mainCast ? mainCast.trim() : null) : existingMovie.main_cast,
            duration: duration !== undefined ? parseInt(duration) : existingMovie.duration,
            genre: genre !== undefined ? (genre ? genre.trim() : null) : existingMovie.genre,
            rating: rating !== undefined ? (rating ? parseFloat(rating) : null) : existingMovie.rating,
            posterUrl: posterUrl !== undefined ? (posterUrl ? posterUrl.trim() : null) : existingMovie.poster_url,
            release_date: releaseDate !== undefined ? releaseDate : existingMovie.release_date
        };

        await updateMovie(movieId, update);
        const updatedMovie = await getMovieById(movieId);

        return res.status(200).json(
            {
                success: true,
                message: `${updatedMovie.title} movie updated successfully`,
                data: updatedMovie
            }
        );

    } catch (error) {
        console.error('Error in updateMovieController:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to update the movie',
            }
        );
    };
};

export const deleteMovieController = async (req, res) => {
    try {
        const movieId = req.params.id;

        if (isNaN(movieId) || movieId <= 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid movie id format, ID must be an positive integer number"
                }
            );
        };

        const movie = await getMovieById(movieId);
        if (!movie) {
            return res.status(404).json(
                {
                    success: false,
                    message: "There's no movie with such id"
                }
            );
        };

        const affectedRows = await deleteMovie(movieId);
        if (affectedRows === 0) {
            return res.status(404).json(
                {
                    success: true,
                    message: "Movie not found or already deleted"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: `The movie ${movie.title} deleted successfully`
            }
        );

    } catch (error) {
        console.error('Error in deleteMovieController:', error.message);

        // Handle foreign key constraint errors
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete movie with existing screenings or bookings'
            });
        };

        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to delete the movie.',
            }
        );
    };
};

export const getMoviesByGenreController = async (req, res) => {
    try {
        const { genre } = req.params;

        if (!genre || genre.trim().length === 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Genre parameter is required",
                }
            );
        };

        const movies = await getMoviesByGenre(genre);

        return res.status(200).json(
            {
                success: true,
                message: `All ${genre} movies retrieved successfully`,
                count: movies.length,
                genre: genre.trim(),
                data: movies
            }
        );

    } catch (error) {
        console.error('Error in getMoviesByGenreController:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to get movies by genre.',
            }
        );
    };
};

export const searchMovieByTitleController = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search title parameter is required'
            });
        }

        const searchTerm = title.trim();
        const movies = await searchMovieByTitle(searchTerm);

        return res.status(200).json(
            {
                success: true,
                message: "Search completed successfully",
                count: movies.length,
                data: movies,
            }
        );

    } catch (error) {
        console.error('Error in searchMovieByTitle():', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Searching Failed',
            }
        );
    };
};