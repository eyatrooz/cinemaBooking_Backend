
export const validateTitle = (title) => {
    const errors = [];

    if (!title || typeof (title) !== 'string') {
        errors.push("Title is required and must be a string");
        return { isValid: false, errors };
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
        errors.push("Title can't be empty!");
    }
    else if (trimmedTitle.length > 200) {
        errors.push("Title length must be min-max:(1-200)");
    }
    if (/[<>]/.test(trimmedTitle)) {
        errors.push("Title contains invalid characters (angle brackets not allowed)");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateMainCast = (cast) => {
    const errors = [];

    if (!cast) {
        return { isValid: true, errors: [] }
    };

    if (typeof (cast) !== "string") {
        errors.push("main cast field must be a text.");
        return { isValid: false, errors };
    };

    const trimmedCast = cast.trim();
    if (trimmedCast.length > 1000) {
        errors.push("Main cast field must not exceeds 1000 characters");
    }

    // recommended by ClaudeAI to prevent tags
    if (/<script|<iframe|javascript:/i.test(trimmedCast)) {
        errors.push('Main cast contains unsafe content');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateDuration = (duration) => {
    const errors = [];

    if (duration === undefined || duration === null || duration === '') {
        errors.push("Duration field is required");
        return { isValid: false, error: errors }
    }

    const numDuration = Number(duration);
    if (isNaN(numDuration)) {
        errors.push("Duration must be a number (minute)")
    }
    else if (!Number.isInteger(numDuration)) {
        errors.push("Duration must be whole minute (no decimal)")
    }
    else if (numDuration < 30) {
        errors.push("Duration is too short (minimum 30 minutes)");
    }
    else if (numDuration > 361) {
        errors.push("Duration is too long (maximum 360 minutes)");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateGenre = (genre) => {
    const errors = [];

    if (!genre) {
        return { isValid: true, errors: [] }
    }

    if (typeof (genre) !== "string") {
        errors.push("Genre must be a text");
        return { isValid: false, errors }
    }

    const trimmedGenre = genre.trim();

    if (trimmedGenre.length > 100) {
        errors.push("Genre is too long (maximum 100 characters)");
    }
    else if (!/^[A-Za-z\s,\-]+$/.test(trimmedGenre)) {
        errors.push("Genre contains invalid characters (use only letters, spaces, commas, hyphens)");
    }


    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateRating = (rating) => {
    const errors = [];
    if (!rating) {
        return { isValid: true, errors: [] }
    }

    const numRating = Number(rating);

    if (isNaN(numRating)) {
        errors.push("Rating must be a number between 1-10");
        return { isValid: false, errors };
    }

    if (numRating < 1 || numRating > 10) {
        errors.push("Rating must be between 1-10")
    };

    return {
        isValid: errors.length === 0,
        errors
    };

};

export const validatePosterUrl = (posterUrl) => {
    const errors = [];

    if (!posterUrl) {
        return { isValid: true, errors: [] };
    }

    if (typeof posterUrl !== 'string') {
        errors.push('Poster URL must be text');
        return { isValid: false, errors };
    }

    const trimmedUrl = posterUrl.trim();

    if (trimmedUrl.length > 500) {
        errors.push('Poster URL is too long (maximum 500 characters)');
    }

    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/i;

    if (!urlPattern.test(trimmedUrl)) {
        errors.push('Poster URL format is invalid (must start with http:// or https://)');
    }

    if (/^(javascript|data|vbscript):/i.test(trimmedUrl)) {
        errors.push('Poster URL uses an unsafe protocol');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateReleaseDate = (releaseDate) => {
    const errors = [];
    if (!releaseDate) {
        return { isValid: true, errors: [] };
    }

    const date = new Date(releaseDate);

    if (isNaN(date.getTime())) {
        errors.push('Release date is invalid (use format: YYYY-MM-DD)');
        return { isValid: false, errors };
    };

    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    if (year < 1900) {
        errors.push("Release date accepted only from 1900 onwards.");

    } else if (year > currentYear) {
        errors.push("Release date cannot be in the future");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// middleware:
export const movieCreationValidation = (req, res, next) => {
    try {
        const { title, mainCast, duration, genre, rating, posterUrl, releaseDate } = req.body;

        const allErrors = [];

        const validators = [
            validateTitle(title),
            validateMainCast(mainCast),
            validateDuration(duration),
            validateGenre(genre),
            validateRating(rating),
            validatePosterUrl(posterUrl),
            validateReleaseDate(releaseDate),
        ];

        validators.forEach(result => {
            if (!result.isValid) {
                allErrors.push(...result.errors);
            };
        });

        if (allErrors.length > 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie validation failed",
                    errors: allErrors,
                }
            );
        };

        next();

    } catch (error) {
        console.error("Movie validation middleware error", error.message);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error during movie validation.",
                error: error.message
            }
        );
    };
};

// middleware:
export const movieUpdateValidation = (req, res, next) => {
    try {

        //Object.keys() is a built-in JavaScript function that returns an array of property names (keys) from an object.
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided to update",
            });
        }

        // Object.entries() is a built-in JavaScript function that converts an object into an array of [key, value] pairs.
        const fieldsToValidate = Object.entries(req.body);
        const allErrors = [];

        fieldsToValidate.forEach(([key, value]) => {
            const validatorMap = {
                title: validateTitle,
                mainCast: validateMainCast,
                duration: validateDuration,
                genre: validateGenre,
                rating: validateRating,
                posterUrl: validatePosterUrl,
                releaseDate: validateReleaseDate
            };

            const validator = validatorMap[key];  //If key = "title", then validator = validateTitle
            if (validator) {
                const result = validator(value);  // validator = validateTitle ==> result = validateTitle("inception")
                if (!result.isValid) {
                    allErrors.push(...result.errors);
                }
            };
        });



        if (allErrors.length > 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie update validation failed",
                    errors: allErrors
                }
            );
        };

        next();

    } catch (error) {
        console.error("Movie update validation middleware failed:", error.message);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error occurred in movie update validation",
                error: error.message
            }
        );
    };
};

