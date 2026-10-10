import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.routes.js';
import actionsRouter from './routes/actions.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to MongoDB Atlas
connectDB();

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman) or matching frontend
        if (!origin || origin === CLIENT_URL || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive in dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// Health Check
app.use('/health', (req, res) => res.status(200).json({ status: 'ok', message: 'Calculator API is healthy' }));

// Auth & Actions Routes
app.use('/auth', authRouter);
app.use('/api/auth', authRouter);

app.use('/actions', actionsRouter);
app.use('/api/actions', actionsRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Calculator backend running on http://localhost:${PORT}`);
});
