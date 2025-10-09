import { Router } from "express";
import {

    getAllMoviesController,
    getMovieByIdController,
    getMoviesByGenreController,
    searchMovieByTitleController,
    deleteMovieController,
    createMovieController,
    updateMovieController

} from "../Controllers/moviesControllers.js";

const router = Router();

router.get("/", getAllMoviesController);
router.get("/search", searchMovieByTitleController);
router.get("/genre/:genre", getMoviesByGenreController);

export default router;