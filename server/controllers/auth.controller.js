import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { setAuthCookie, clearAuthCookie, generateToken } from '../utils/auth.util.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new ApiError(409, 'An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
    });

    const token = generateToken({
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
    });

    setAuthCookie(res, token);

    return res.status(201).json({
        statusCode: 201,
        message: 'Account created successfully',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    const token = generateToken({
        id: user._id,
        email: user.email,
        name: user.name
    });

    setAuthCookie(res, token);

    return res.status(200).json({
        statusCode: 200,
        message: 'Logged in successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

export const logout = asyncHandler(async (req, res) => {
    clearAuthCookie(res);

    return res.status(200).json({
        statusCode: 200,
        message: 'Logged out successfully.'
    });
});

export const getMe = asyncHandler(async (req, res) => {
    if (!req.user?.id) {
        throw new ApiError(401, 'Not authenticated');
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json({
        statusCode: 200,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});
