import express from 'express';
import authMiddleware from './middleware.js';
import {
  createSparePart,
  deleteSparePart,
  getAllSpareParts,
  getSparePartById,
  updateSparePart,
} from './sparePartsControllers.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getAllSpareParts);
router.get('/:id', getSparePartById);
router.post('/', createSparePart);
router.put('/:id', updateSparePart);
router.delete('/:id', deleteSparePart);

export default router;
