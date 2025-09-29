import JWT from 'jsonwebtoken';

// function to check if the user logged in and has a valid token
export const authenticateUser = (req, res, next) => {

    /*
      Step 1: Extract token from Authorization header
      Step 2: Check if Authorization header exists
      Step 3: Check if token format is correct (starts with "Bearer ")
      Step 4: Verify token using JWT and your secret
      Step 5: Attach user information to request object
      Step 6: Continue to next middleware/controller
     */

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
                    succes: false,
                    message: "Access denied, Invalid token format."
                }
            );
        };

        // Extract the actual token part (remove "Bearer ")
        const token = authHeader.split(' ')[1];
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
                    message: "Access denaied, token has expired",
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



