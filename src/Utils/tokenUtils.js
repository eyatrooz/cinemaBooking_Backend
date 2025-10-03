import crypto from 'crypto';



export const generateResetToken = () => {

    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashToken = (token) => {

    if (!token || typeof token !== 'string') {
        throw new Error('Valid token string is required for hashing');
    };

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return hashedToken;
};

export const setTokenExpireationTime = () => {

    const now = new Date();
    const expirationTime = new Date(now.getTime() + 60 * 60 * 1000);

    // converting expirationTime to ISO format first, then modifying it to match MySQL's DATETIME format.
    const formatted = expirationTime.toISOString().slice(0, 19).replace('T', ' ');

    return formatted;
};

// Verify if token matches hashed token
export const verifyToken = (token, hashedToken) => {
    const tokenHash = hashToken(token);
    return tokenHash === hashedToken;
};

