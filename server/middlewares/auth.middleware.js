import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../utils/auth.util.js';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.cookies?.jwt ||
            (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : null);

        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Unauthorized: Authentication required. Please log in.'
            });
        }

        const decoded = jwt.verify(token, getJwtSecret());

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Unauthorized: Invalid or expired token. Please log in again.'
        });
    }
};
