import express from 'express';
import authMiddleware, { requireRole } from '../../middleware/auth.js';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from './products.controller.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', requireRole('admin', 'editor'), createProduct);
router.put('/:id', requireRole('admin', 'editor'), updateProduct);
router.delete('/:id', requireRole('admin'), deleteProduct);
export default router;
