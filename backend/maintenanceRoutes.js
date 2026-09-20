import express from 'express';
import authMiddleware from './middleware.js';
import {
  createMaintenance,
  deleteMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
} from './maintenanceControllers.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getAllMaintenance);
router.get('/:id', getMaintenanceById);
router.post('/', createMaintenance);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);

export default router;
