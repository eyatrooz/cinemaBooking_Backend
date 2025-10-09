import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';


export const hashPassword = async (password) => {
    try {

        const saltRound = parseInt(process.env.SALTROUND) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        return hashedPassword;

    } catch (error) {
        console.error('Error hashing password:', error.message);
        throw new Error('Hashing password failed');
    }
};




// A function to remove the hashed password from respond
export const removePassword = (userData) => {

    if (!userData) {
        return userData;
    };


    if (Array.isArray(userData)) {
        return userData.map(users => {
            const { password, ...usersWithoutPassword } = users;
            return usersWithoutPassword;
        });
    }

    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;

};

export const generateToken = (userID, userEmail) => {
    try {

        /*
           Create payload with user info
            Generate and sign the token
            return token
        */

        if (!userID || !userEmail) {
            throw new Error('User ID and email are required for token generation');
        };

        const payLoad = {
            id: userID,
            email: userEmail,
        };

        const token = JWT.sign(
            payLoad,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return token;

    } catch (error) {
        console.error('Error occurred while token generation.');
        throw new Error('Token generation failed');
    };
};





