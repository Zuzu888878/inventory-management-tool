import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
} from '../controllers/assetController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

export default router;