import assetRepository from './data.js';
import { createAuthToken } from './authTokens.js';
import { verifyPassword } from './passwords.js';
import usersRepository from './usersData.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!process.env.API_TOKEN) {
    return res.status(503).json({ message: 'Login is not configured' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  try {
    const user = await usersRepository.getUserCredentialsByUsername(username);
    if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({
      token: createAuthToken(user),
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

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
    if (!req.body.assetCode || !req.body.name || !req.body.category) {
      return res.status(400).json({ message: 'Asset code, name, and category are required' });
    }

    const newAsset = await assetRepository.createAsset(req.body);
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create asset', error: error.message });
  }
};

export const updateAsset = async (req, res) => {
  try {
    if (!req.body.assetCode || !req.body.name || !req.body.category) {
      return res.status(400).json({ message: 'Asset code, name, and category are required' });
    }

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
