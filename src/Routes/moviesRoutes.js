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

import { movieCreationValidation, movieUpdateValidation } from "../Middleware/moviesValidation.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import { requireAdmin } from "../Middleware/adminMiddleware.js";

const router = Router();

// PUBLIC ROUTES - Anyone can view movies
router.get("/", getAllMoviesController);
router.get("/search", searchMovieByTitleController);
router.get("/genre/:genre", getMoviesByGenreController);
router.get("/:id", getMovieByIdController);

// PRIVATE ROUTES - Admin only
router.post("/", authenticateUser, requireAdmin, movieCreationValidation, createMovieController);
router.put("/:id", authenticateUser, requireAdmin, movieUpdateValidation, updateMovieController);
router.delete("/:id", authenticateUser, requireAdmin, deleteMovieController);

export default router;