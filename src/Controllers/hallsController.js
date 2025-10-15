import database from "../Config/database.js";
import {
    createHall,
    getAllHalls,
    getTotalHallsCount,
    getActiveHalls,
    getActiveHallsCount,
    getHallsByType,
    getHallsByTypeCount,
    getHallById,
    getHallsByStatus,
    getHallsByStatusCount,
    getDeletedHalls,
    getDeletedHallsCount,
    updateHall,
    deleteHall,
    permanentlyDeleteHall,
    restoreHall,
    getAllHallsIncludeDeleted,
    getAllHallsIncludeDeletedCount,
    getHallByName
} from "../Models/halls.model.js";

import { getPaginationParams, formatPaginatedResponse, calculateOffset } from "../Utils/paginationUtils.js";



export const getAllHallsController = async (req, res) => {
    try {

        // considering pagination support
        const { page, limit } = getPaginationParams(req.query);
        const offset = calculateOffset(page, limit);

        const halls = await getAllHalls(limit, offset);
        const totalHalls = await getTotalHallsCount();

        const response = formatPaginatedResponse(halls, page, limit, totalHalls);

        return res.status(200).json(
            {
                success: true,
                message: "Halls retrieved successfully",
                ...response,
            }
        );

    } catch (error) {

        console.error('Error in getAllHallsController:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to get all halls',
            }
        );
    }
};

export const createHallController = async (req, res) => {
    try {

        const { name, totalSeats, hallType, hallStatus } = req.body;

        // check if the hall name is already exists
        const fixedName = name.trim().toLowerCase();
        const existingHallName = await getHallByName(fixedName);
        if (existingHallName) {
            return res.status(409).json({
                success: false,
                message: `Hall with name '${name}' already exists, please chose different name`
            });
        }

        const hallData = {
            name: fixedName,
            totalSeats: parseInt(totalSeats),
            hallType: hallType ? hallType.trim().toLowerCase() : "standard",
            hallStatus: hallStatus ? hallStatus.trim().toLowerCase() : "active",
        }

        const newHallId = await createHall(hallData);
        const newHall = await getHallById(newHallId);

        return res.status(201).json(
            {
                success: true,
                message: `The hall ${newHall.name} created successfully`,
                data: newHall
            }
        );

    } catch (error) {

        console.error('Error in createHallController:', error.message);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: "Hall with this name already exists, please chose different name"
            });
        };

        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to create a hall',
            }
        );
    }
};

export const getHallByIdController = async (req, res) => {
    try {

        const hallId = req.validatedId;

        const hall = await getHallById(hallId);

        if (!hall) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Hall not found"
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: `Hall retrieved successfully, hall name:${hall.name}`,
            data: hall
        });

    } catch (error) {

        console.error('Error in getHallByIdController:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Internal server error, Failed to retrieve the hall',
            }
        );

    }
};

export const getActiveHallsController = async (req, res) => {
    try {

        // considering pagination support 
        const { page, limit } = getPaginationParams(req.query);
        const offset = calculateOffset(page, limit);

        const halls = await getActiveHalls(limit, offset);
        const totalHalls = await getActiveHallsCount();

        const response = formatPaginatedResponse(halls, page, limit, totalHalls);

        return res.status(200).json({
            ...response,
            message: 'Active halls retrieved successfully'
        });

    } catch (error) {
        console.error('Error in getActiveHallsController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to get active halls'
        });
    }
};
export const updateHallController = async (req, res) => {
    try {
        const hallId = req.validatedId;

        const existingHall = await getHallById(hallId);
        if (!existingHall) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Hall Not Found"
                }
            );
        };

        if (existingHall.is_deleted) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Cannot update a deleted hall, please restore it first"
                }
            )
        }

        const { name, totalSeats, hallType, hallStatus } = req.body;

        const hallData = {
            name: name !== undefined ? name.trim().toLowerCase() : existingHall.name,
            totalSeats: totalSeats !== undefined ? parseInt(totalSeats) : existingHall.totalSeats,
            hallType: hallType !== undefined ? hallType.trim().toLowerCase() : existingHall.hall_type,
            hallStatus: hallStatus !== undefined ? hallStatus.trim().toLowerCase() : existingHall.Status,
        };

        await updateHall(hallId, hallData);
        const updatedHall = await getHallById(hallId);

        return res.status(200).json(
            {
                success: true,
                message: `The hall ${updateHall.name} updated successfully`,
                data: updatedHall
            }
        );

    } catch (error) {
        console.error('Error in updateHallController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to update the hall'
        });
    }
};

export const getHallsByTypeController = async (req, res) => {
    try {
        const { type } = req.params;

        if (!type || type.trim().length === 0 || typeof (type) !== "string") {
            return res.status(400).json({
                success: false,
                message: "Hall type parameter is required"
            });

        }

        const validTypes = ['standard', 'vip', 'imax', '3d', '4dx'];
        const normalizedType = type.trim().toLowerCase();

        if (!validTypes.includes(normalizedType)) {
            return res.status(400).json(
                {
                    success: false,
                    message: `Invalid hall type, must be one of : ${validTypes.join(", ")}`
                }
            );
        }

        // considering pagination support
        const { page, limit } = getPaginationParams(req.query);
        const offset = calculateOffset(page, limit);

        const halls = await getHallsByType(normalizedType, limit, offset);
        const totalHalls = await getHallsByTypeCount(normalizedType);

        const response = formatPaginatedResponse(halls, page, limit, totalHalls);

        return res.status(200).json(
            {
                success: true,
                message: `All ${normalizedType} halls retrieved successfully`,
                type: normalizedType,
                ...response
            }
        );

    } catch (error) {
        console.error('Error in getHallsByTypeController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to get halls by type'
        });
    }
};

export const getHallsByStatusController = async (req, res) => {
    try {
        const { status } = req.params;

        if (!status || typeof (status) !== "string" || status.trim().length === 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Hall status parameter is required"
                }
            );
        }

        const validStatuses = ["active", "maintenance", "closed"];
        const normalizedStatus = status.trim().toLowerCase();

        if (!validStatuses.includes(normalizedStatus)) {
            return res.status(400).json(
                {
                    success: false,
                    message: `Invalid hall status, must be one of: ${validStatuses.join(", ")}`
                }
            );
        }

        // considering pagination support
        const { page, limit } = getPaginationParams(req.query);
        const offset = calculateOffset(page, limit);

        const halls = await getHallsByStatus(normalizedStatus, limit, offset);
        const totalHalls = await getHallsByStatusCount(normalizedStatus);

        const response = formatPaginatedResponse(halls, page, limit, totalHalls);

        return res.status(200).json({
            success: true,
            message: `All ${normalizedStatus} halls retrieved successfully`,
            ...response
        });

    } catch (error) {
        console.error('Error in getHallsByStatusController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to get halls by status'
        });
    }
};

export const hallSoftDeleteController = async (req, res) => {
    try {
        const hallId = req.validatedId;

        const hall = await getHallById(hallId);

        if (!hall) {
            return res.status(404).json({
                success: false,
                message: "Hall Not Found"
            });
        }

        if (hall.is_deleted) {
            return res.status(400).json(
                {
                    success: false,
                    message: "There's no hall with such id"
                }
            )
        }

        const affectedRows = await deleteHall(hallId);
        if (affectedRows === 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Hall Not Found, or already deleted"
                }
            )
        };

        return res.status(200).json(
            {
                success: true,
                message: `Hall ${hall.name} is deleted successfully (soft delete)`
            }
        );

    } catch (error) {
        console.error('Error in deleteHallController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to delete the hall'
        });
    }
};

export const hallHardDeleteController = async (req, res) => {
    try {
        const id = req.validatedId;

        const hall = await getHallById(id);
        if (!hall) {
            return res.status(404).json({
                success: false,
                message: "Hall Not Found"
            });
        }

        const affectedRows = await permanentlyDeleteHall(id);
        if (affectedRows === 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Hall Not Found, or already deleted"
                }
            )
        };

        return res.status(200).json(
            {
                success: true,
                message: `Hall ${hall.name} permanently deleted`
            }
        );

    } catch (error) {

        console.error('Error in permanentlyDeleteHallController:', error.message);

        if (error.message.includes('Cannot permanently delete')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to permanently delete the hall'
        });
    }
};

export const getDeletedHallsController = async (req, res) => {
    try {

        // considering pagination support 
        const { page, limit } = getPaginationParams(req.query);
        const offset = calculateOffset(page, limit);

        const halls = await getDeletedHalls(limit, offset);
        const totalHalls = await getDeletedHallsCount();

        const response = formatPaginatedResponse(halls, page, limit, totalHalls);

        return res.status(200).json(
            {
                success: true,
                message: "All deleted halls retrieved successfully",
                ...response
            }
        );

    } catch (error) {
        console.error('Error in getDeletedHallsController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to get deleted halls'
        });
    }
};

export const getAllHallsIncludeDeletedControllers = async (req, res) => {
    try {

        // considering pagination support
        const { page, limit } = getPaginationParams(req.query);
        const offset = calculateOffset(page, limit);

        const halls = await getAllHallsIncludeDeleted(limit, offset);
        const totalHalls = await getAllHallsIncludeDeletedCount();

        const response = formatPaginatedResponse(halls, page, limit, totalHalls);

        return res.status(200).json(
            {
                success: true,
                message: "All halls in database retrieved successfully",
                ...response
            }
        );

    } catch (error) {
        console.error('Error in getAllHallsIncludeDeletedController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to get all halls'
        });
    }
};

export const restoreHallController = async (req, res) => {
    try {
        const hallId = req.validatedId;

        const hall = await getHallById(hallId);
        if (!hall) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Hall Not Found"
                }
            );
        }
        if (!hall.is_deleted) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Hall is not deleted, no need to restore"
                }
            );
        }

        const restoreResult = await restoreHall(hallId);
        if (restoreResult === 0) {
            return res.status(404).json({
                success: false,
                message: "Hall not found"
            });
        };

        const restoredHall = await getHallById(hallId);

        return res.status(200).json({
            success: true,
            message: `Hall ${restoredHall.name} restored successfully`,
            data: restoredHall
        });


    } catch (error) {
        console.error('Error in restoreHallController:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error, Failed to restore the hall'
        });
    }
};