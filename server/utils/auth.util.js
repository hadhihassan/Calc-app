import jwt from 'jsonwebtoken';

export const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_jwt_key_calculator_app_2026';

/**
 * Sets the authentication JWT cookie on the response.
 */
export const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

/**
 * Clears the authentication JWT cookie on the response.
 */
export const clearAuthCookie = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
};

/**
 * Generates and signs a JWT token with the provided payload.
 */
export const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn });
};
