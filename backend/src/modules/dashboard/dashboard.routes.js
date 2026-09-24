import express from 'express';
import authMiddleware, { requireRole } from '../../middleware/auth.js';
import { getDashboard } from './dashboard.controller.js';

const router = express.Router();
router.use(authMiddleware);
router.use(requireRole('admin', 'editor', 'viewer'));
router.get('/', getDashboard);

export default router;
