import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import {
  createMaintenance,
  deleteMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
} from './maintenance.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getAllMaintenance);
router.get('/:id', getMaintenanceById);
router.post('/', createMaintenance);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);

export default router;
