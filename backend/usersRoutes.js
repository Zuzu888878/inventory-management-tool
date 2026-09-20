import express from 'express';
import authMiddleware, { requireRole } from './middleware.js';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from './usersControllers.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('admin'));
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
