
export const validateId = (req, res, next) => {
    try {
        const { id } = req.params;

        // check if the id is provided
        if (!id) {
            return res.status(400).json(
                {
                    success: false,
                    message: '  ID parameter is required in the URL',
                }
            );
        };
        // convert id to a number only so "123" will turn into 123
        const numericID = Number(id);

        // check if the id is a number and greater than zero
        if (isNaN(numericID) || numericID <= 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: ' id must be a number, and grater than 0',
                }
            );
        };

        // check if the id is an integer (no decimal)
        if (!Number.isInteger(numericID)) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'ID must be an integer number (no decimals)',
                    received: id
                }
            )

        }
        req.validatedId = numericID;  //  Pass clean data to controller 

        next();   // if all validation pass, continue to controller

    } catch (error) {
        return res.status(400).json(
            {
                success: false,
                message: ' ID validation error',
                error: error.message
            }
        );
    }
};

export const validateUserName = (name) => {
    const errors = [];

    // Check 1: Type Check

    if (!name) {
        errors.push('Name field is required');
        return {
            isValid: false,
            errors: errors,
        }
    };

    if (typeof (name) !== 'string') {

        errors.push('Name must be a string');
        return {
            isValid: false,
            errors: errors,
        }
    };

    const trimmedName = name.trim();

    // Check 2: Presence Check (if it's empty or just whitespace)
    if (trimmedName.length === 0) {
        errors.push('Name is required');
    }

    // Check 3: Minimum Length Check
    else if (trimmedName.length < 2) {
        errors.push('Name must be at least 2 characters long')
    }

    // Check 4: Maximum Length Check
    else if (trimmedName.length > 100) {
        errors.push('Name cannot exceeds 100 characters long')
    }

    // Check 5: does the name have an invalid characters ?
    else if (!/^[A-Za-z\s\-']+$/.test(trimmedName)) {
        errors.push('Name contains invalid characters');
    }

    // ONLY AFTER ALL CHECKS: Return all found errors
    return {
        isValid: errors.length === 0,
        errors: errors,
    }
};

export const userEmailValidation = (email) => {
    const errors = [];

    if (!email || typeof (email) !== 'string') {
        errors.push('Email is required');

        return {
            isValid: false,
            errors: errors
        };
    }

    const trimmedEmail = email.trim().toLowerCase();



    if (trimmedEmail.length === 0) {
        errors.push('Email cannot be empty');
    }

    else if (trimmedEmail.length > 100) {
        errors.push('Email cannot exceed 100 characters');
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.push('Please enter a valid email address');
    }

    return {

        isValid: errors.length === 0,
        errors: errors,

    }
};

export const passwordValidation = (password) => {
    const errors = [];

    if (!password || typeof (password) !== 'string') {
        errors.push('Password is required')
        return {
            isValid: false,
            errors: errors,
        }
    }

    if (password.length < 8) {
        errors.push('Password is too short');
    }

    if (password.length > 255) {
        errors.push('Password is too long');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    };

    if (!/[A-Za-z]/.test(password)) {
        errors.push('Password must contain at least one character');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    const commonPassword = ['password', '12345678', 'qwertyui', 'letmein', 'abcd1234'];
    if (commonPassword.includes(password.toLowerCase())) {
        errors.push('Password is too common and easy guessable');
    }

    return {

        isValid: errors.length === 0,
        errors: errors

    };
};

export const userCreationValidation = (req, res, next) => {
    try {

        const { name, email, password, phone } = req.body;
        const allErrors = [];

        const validation = [
            validateUserName(name),
            userEmailValidation(email),
            passwordValidation(password)
        ];

        validation.forEach(result => {
            if (!result.isValid) {
                allErrors.push(...result.errors);

            }
        });

        if (phone) {

            if (typeof (phone) !== 'string' || phone.length > 13) {
                allErrors.push('Phone number must be valid and cannot exceed 13 digits');
            }
        };

        if (allErrors.length > 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Validation failed',
                    errors: allErrors
                }
            )
        } else {
            next();
        };

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Internal server error in user validation",
                error: error.message
            }
        );
    };
};

