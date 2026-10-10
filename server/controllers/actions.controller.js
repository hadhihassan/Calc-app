import { History } from '../models/History.js';
import { actionCalculationSchema } from '../validators/actions.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const actionsController = asyncHandler(async (req, res) => {
    const payloadToValidate = {
        operation: req.body.operation || req.body.actions || req.body.operator,
        numbers: req.body.numbers !== undefined ? req.body.numbers : req.body.payload
    };

    const validation = actionCalculationSchema.safeParse(payloadToValidate);
    if (!validation.success) {
        const firstError = validation.error.issues?.[0]?.message || 'Validation failed';
        throw new ApiError(400, firstError, validation.error.issues);
    }

    const { operation, numbers } = validation.data;

    // Perform calculation
    let calculatedResult = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        const currentNum = numbers[i];
        if (operation === '+') {
            calculatedResult += currentNum;
        } else if (operation === '-') {
            calculatedResult -= currentNum;
        } else if (operation === '*') {
            calculatedResult *= currentNum;
        } else if (operation === '/') {
            calculatedResult /= currentNum;
        }
    }

    const expression = `${numbers.join(` ${operation} `)} = ${calculatedResult}`;

    // Save history in MongoDB Atlas if user is authenticated
    let savedRecord = null;
    if (req.user?.id) {
        try {
            savedRecord = await History.create({
                userId: req.user.id,
                operation,
                numbers,
                expression,
                result: calculatedResult,
                status: 'ok',
                createdAt: new Date()
            });
        } catch (dbErr) {
            console.error('History save warning (MongoDB Atlas may be pending connection):', dbErr.message);
        }
    }

    return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        data: {
            result: calculatedResult,
            operation,
            numbers,
            expression,
            status: 'ok',
            historyId: savedRecord?._id || null,
            createdAt: savedRecord?.createdAt || new Date()
        }
    });
});

export const getHistory = asyncHandler(async (req, res) => {
    if (!req.user?.id) {
        throw new ApiError(401, 'Unauthorized: Authentication required.');
    }

    const historyList = await History.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(100);

    return res.status(200).json({
        statusCode: 200,
        message: 'History fetched successfully',
        count: historyList.length,
        data: historyList
    });
});