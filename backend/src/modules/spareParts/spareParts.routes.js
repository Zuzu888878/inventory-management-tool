import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import {
  createSparePart,
  deleteSparePart,
  getAllSpareParts,
  getSparePartById,
  updateSparePart,
} from './spareParts.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getAllSpareParts);
router.get('/:id', getSparePartById);
router.post('/', createSparePart);
router.put('/:id', updateSparePart);
router.delete('/:id', deleteSparePart);

export default router;
