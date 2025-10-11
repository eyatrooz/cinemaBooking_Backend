import JWT from 'jsonwebtoken';

/*
 authenticateUser: is a function that checks if someone is logged in before letting them access protected routes.

Protected Route" Means:
User must be logged in (have a valid token)
User's identity is verified (token is real, not expired)
Sometimes, specific role required (like admin-only routes)

*/

export const authenticateUser = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Access denied, No token provided."
                }
            );
        };

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Access denied, Invalid token format."
                }
            );
        };

        // Extract the actual token part (remove "Bearer ")
        const token = authHeader.split(' ')[1];    // Splits the string wherever there's a space then Gets the element at index 1 (second item)

        const payLoad = JWT.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: payLoad.id,
            email: payLoad.email,
        };

        next();

    } catch (error) {

        // handle different type of JWT errors (jsonwebtoken library can throw exactly these 3 types of errors:)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(
                {
                    success: false,
                    message: "Access denied, token has expired",
                }
            );
        };

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json(
                {
                    success: false,
                    message: "Access denied, Invalid token",
                }
            )
        };

        if (error.name === 'NotBeforeError') {
            return res.status(401).json(
                {
                    success: false,
                    message: "Access denied, token is not yet valid",
                }
            );
        };

        // Generic server error
        console.error('Authentication middleware error:', error.message)
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.'
        });
    }
};



