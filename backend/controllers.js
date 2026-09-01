import assetRepository from '../data/assetRepository.js';

export const getAllAssets = async (req, res) => {
    try {
        const assets = await assetRepository.getAllAssets();
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load assets', error: error.message });
    }
};

export const getAssetById = async (req, res) => {
    try {
        const asset = await assetRepository.getAssetById(req.params.id);

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load asset', error: error.message });
    }
};

export const createAsset = async (req, res) => {
    try {
        const newAsset = await assetRepository.createAsset(req.body);
        res.status(201).json(newAsset);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create asset', error: error.message });
    }
};

export const updateAsset = async (req, res) => {
    try {
        const updatedAsset = await assetRepository.updateAsset(req.params.id, req.body);

        if (!updatedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.status(200).json(updatedAsset);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update asset', error: error.message });
    }
};

export const deleteAsset = async (req, res) => {
    try {
        const deletedAsset = await assetRepository.deleteAsset(req.params.id);

        if (!deletedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.status(200).json({ message: 'Asset deleted successfully', asset: deletedAsset });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete asset', error: error.message });
    }
};