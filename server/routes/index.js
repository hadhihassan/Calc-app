import express from 'express';
import { actionsController, getHistory } from '../controllers/actions.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Calculation action (requires auth to store history with ok status)
router.post('/', authMiddleware, actionsController);

// History route for authenticated user
router.get('/history', authMiddleware, getHistory);

export default router;