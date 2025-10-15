import { Router } from 'express';
import {
    getAllHallsController,
    getActiveHallsController,
    getAllHallsIncludeDeletedControllers,
    getDeletedHallsController,
    getHallByIdController,
    getHallsByStatusController,
    getHallsByTypeController,
    createHallController,
    hallSoftDeleteController,
    hallHardDeleteController,
    updateHallController,
    restoreHallController,
} from '../Controllers/hallsController.js';

import { authenticateUser } from '../Middleware/authMiddleware.js';
import { requireAdmin } from '../Middleware/adminMiddleware.js';


const router = Router();





export default router;