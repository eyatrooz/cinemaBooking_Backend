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
import { validateUrlId, hallCreationValidation, hallUpdateValidation } from '../Middleware/hallsValidation.js';

const router = Router();

// PUBLIC ROUTES - Anyone can access:
router.get('/', getAllHallsController);
router.get('/active', getActiveHallsController);
router.get('/type/:type', getHallsByTypeController);
router.get('/status/:status', getHallsByStatusController);
router.get('/:id', validateUrlId, getHallByIdController);


// ADMIN-ONLY ROUTES - Protected:
router.post('/', authenticateUser, requireAdmin, hallCreationValidation, createHallController);
router.put('/:id', authenticateUser, requireAdmin, validateUrlId, hallUpdateValidation, updateHallController);
router.delete('/:id', authenticateUser, requireAdmin, validateUrlId, hallSoftDeleteController);
router.delete('/:id/permanent', authenticateUser, requireAdmin, validateUrlId, hallHardDeleteController);

router.patch('/:id/restore', authenticateUser, requireAdmin, validateUrlId, restoreHallController);
router.get('/admin/deleted', authenticateUser, requireAdmin, getDeletedHallsController);
router.get('/admin/all', authenticateUser, requireAdmin, getAllHallsIncludeDeletedControllers);

export default router;