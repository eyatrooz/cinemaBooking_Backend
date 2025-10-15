export const validatePaginationParams = (page, limit) => {
    const errors = [];

    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
        errors.push("Page must be a integer positive number");
    }

    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1) {
        errors.push("Limit must be a integer positive number")
    } else if (limitNum > 100) {
        errors.push("Limit can't exceed 100 items per page")
    }

    return {
        isValid: errors.length === 0,
        page: pageNum,
        limit: limitNum,
        errors
    };
};

export const calculateOffset = (page, limit) => {
    return (page - 1) * limit;
};

export const calculateTotalPage = (totalItems, limit) => {
    return Math.ceil(totalItems / limit);
};

export const formatPaginatedResponse = (data, page, limit, totalItems) => {
    const totalPages = calculateTotalPage(totalItems / limit);

    return {
        success: true,
        data: data,
        pagination: {
            currentPage: page,
            itemPerPage: limit,
            totalItems: totalItems,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }
};

export const getPaginationParams = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    return { page, limit };
};

export const validatePagination = (req, res, next) => {
    const { page, limit } = getPaginationParams(req.query);

    const validation = validatePaginationParams(page, limit);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Invalid pagination parameters',
            errors: validation.errors
        });
    }

    req.pagination = {
        page: page,
        limit: limit,
        offset: calculateOffset(validation.page, validation.limit)
    }
    next();
};
