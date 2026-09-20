import express from 'express';
import authMiddleware from './middleware.js';
import { getDashboard } from './dashboardControllers.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', getDashboard);

export default router;
