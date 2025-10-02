import crypto from 'crypto';



export const generateResetToken = () => {

    const token = crypto.randomBytes(32).toString('hex');  // crypto.randonmBytes(32): Generates 32 bytes of random data
    return token;                                         // .toString('hex'): converts those 32 random bytes into a 64-character hexadecimal string
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

