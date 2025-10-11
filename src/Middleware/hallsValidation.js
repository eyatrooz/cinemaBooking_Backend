export const validateHallName = (name) => {
    const errors = [];

    if (!name || typeof (name) !== "string") {
        errors.push("Halls name is required and must be a string");
        return {
            isValid: false,
            errors
        };
    };

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
        errors.push(" Hall name can not be empty")
    }
    else if (trimmedName.length < 2 || trimmedName.length > 100) {
        errors.push("Hall name must be at least 2 characters and at most 100");
    };

    if (!/^[A-Za-z0-9\s\-]+$/.test(trimmedName)) {
        errors.push("Hall name can only contains letters, numbers, spaces, and hyphens")
    };

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateTotalSeats = (totalSeats) => {
    const errors = [];

    if (totalSeats === undefined || totalSeats === null || totalSeats === '') {
        errors.push("Total seats is required");
        return {
            isValid: false,
            errors
        };
    };

    const numSeats = Number(totalSeats);
    if (isNaN(numSeats)) {
        errors.push("Total seats must be a number");
    }
    else if (!Number.isInteger(numSeats)) {
        errors.push("Total seats must be an integer number (no decimal)")
    }
    else if (numSeats < 20 || numSeats > 500) {
        errors.push("Total seats must be at least 20, and can't exceed 500");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateHallType = (hallType) => {
    const errors = [];

    if (!hallType) {
        return { isValid: true, errors: [] };
    }

    if (typeof (hallType) !== 'string') {
        errors.push("Hall type must be a string");
        return { isValid: false, errors };
    }

    const trimmedType = hallType.trim().toLowerCase();

    const validTypes = ['standard', 'vip', 'imax', '3d', '4dx'];

    if (!validTypes.includes(trimmedType)) {
        errors.push(`Hall types must be one of ${validTypes.join(", ")}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateHallStatus = (status) => {
    const errors = [];

    if (!status) {
        return {
            isValid: true,
            errors: []
        };
    };

    if (typeof (status) !== "string") {
        errors.push(" Hall status must be a string");
        return {
            isValid: false,
            errors
        };
    };

    const trimmedStatus = status.trim().toLowerCase();
    const validStatuses = ['active', 'maintenance', 'closed'];

    if (!validStatuses.includes(trimmedStatus)) {
        errors.push(`Hall status must be one of ${validStatuses.join(", ")}`);
    };

    return {
        isValid: errors.length === 0,
        errors
    };
};


export const hallCreationValidation = (req, res, next) => {
    try {
        const { name, totalSeats, hallType, hallStatus } = req.body;
        const allErrors = [];

        const validationResult = [
            validateHallName(name),
            validateTotalSeats(totalSeats),
            validateHallType(hallType),
            validateHallStatus(hallStatus)
        ]

        validationResult.forEach(result => {
            if (!result.isValid) {
                allErrors.push(...result.errors);
            }
        });

        if (allErrors.length > 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Hall validation failed",
                    errors: allErrors
                }
            );
        };

        next();

    } catch (error) {
        console.error("Hall creation validation failed", error.message);

        return res.status(500).json(
            {
                success: false,
                message: "Internal server error occurred in hallCreationValidation",
                error: error.message
            }
        );
    };
};

export const hallUpdateValidation = (req, res, next) => {
    try {
        // Check if any fields are provided
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided to update"
            });
        }

        const allErrors = [];

        // Map each field to its validator function
        const validatorMap = {
            name: validateHallName,
            totalSeats: validateTotalSeats,
            hallType: validateHallType,
            hallStatus: validateHallStatus
        };

        // Only validate fields that are present in the request
        Object.entries(req.body).forEach(([key, value]) => {
            const validator = validatorMap[key];

            if (!validator) {
                allErrors.push(`Unknown field: '${key}', will be ignored`);

            } else {

                const result = validator(value);
                if (!result.isValid) {
                    allErrors.push(...result.errors);
                }
            }
        });


        if (allErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Hall validation failed",
                errors: allErrors
            });
        }

        next();

    } catch (error) {
        console.error("Hall update validation middleware failed", error.message);

        return res.status(500).json(
            {
                success: false,
                message: "Internal server error occurred in hallUpdateValidation",
                error: error.message
            }
        );
    };
};

