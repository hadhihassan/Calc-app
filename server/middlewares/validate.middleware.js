import { ApiError } from '../utils/ApiError.js';

/**
 * Express middleware to validate incoming request data against a Zod schema.
 * If validation fails, it forwards an ApiError with status 400 and error details to the global error handler.
 * If validation succeeds, it assigns the sanitized/parsed data back to req[source] and proceeds to next().
 *
 * @param {import('zod').ZodSchema} schema - Zod schema instance
 * @param {'body' | 'query' | 'params'} [source='body'] - Request property to validate ('body', 'query', or 'params')
 * @returns {import('express').RequestHandler}
 *
 * @example
 * router.post('/register', validate(registerSchema), register);
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const validation = schema.safeParse(req[source]);

        if (!validation.success) {
            const issues = validation.error.issues || [];
            const firstError = issues[0]?.message || 'Validation failed';
            return next(new ApiError(400, firstError, issues));
        }

        // Replace request payload with sanitized, typed, and transformed data from Zod
        req[source] = validation.data;
        next();
    } catch (error) {
        next(error);
    }
};

export default validate;
