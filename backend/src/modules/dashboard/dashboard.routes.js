import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import { getDashboard } from './dashboard.controller.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', getDashboard);

export default router;
