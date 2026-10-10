import { ZodError } from 'zod';

/**
 * Global Express error handling middleware.
 * Formats errors into a consistent JSON response:
 * {
 *   statusCode: number,
 *   message: string,
 *   errors?: Array
 * }
 */
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal server error';
    let errors = err.errors || [];

    // Handle direct Zod errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = err.issues?.[0]?.message || 'Validation failed';
        errors = err.issues;
    }

    // Handle JWT authentication errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Unauthorized: Invalid token. Please log in again.';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Unauthorized: Token has expired. Please log in again.';
    }

    // Handle Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        statusCode = 409;
        const keys = Object.keys(err.keyValue || {});
        const field = keys[0] || 'field';
        message = `An account with this ${field} already exists.`;
    }

    // Log internal server errors (500) for observability
    if (statusCode >= 500) {
        console.error('Unhandled server error:', err);
    }

    res.status(statusCode).json({
        statusCode,
        message,
        ...(errors && errors.length > 0 ? { errors } : {})
    });
};

export default errorHandler;
