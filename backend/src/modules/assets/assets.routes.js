import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
} from './assets.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

export default router;