import { hashPassword, validatePassword } from '../../utils/passwords.js';
import usersRepository, { USER_ROLES } from './users.repository.js';

const validateUserRequest = (user, passwordRequired) => {
  if (!/^[a-z0-9._-]{3,100}$/.test(user.username?.trim().toLowerCase() || '')) {
    return 'Username must be 3-100 characters and use only letters, numbers, dots, underscores, or hyphens';
  }
  if (!user.displayName?.trim()) return 'Display name is required';
  if (!USER_ROLES.includes(user.role)) return 'Invalid user role';
  if (typeof user.isActive !== 'undefined' && typeof user.isActive !== 'boolean') {
    return 'Active state must be true or false';
  }
  if (passwordRequired || user.password) return validatePassword(user.password);
  return null;
};

const sendUserError = (res, error, action) => {
  if (error.code === '23505') return res.status(409).json({ message: 'Username already exists' });
  if (error.code === '23514') return res.status(400).json({ message: 'Invalid user data' });
  return res.status(500).json({ message: `Failed to ${action} user`, error: error.message });
};

const wouldRemoveLastAdmin = async (existingUser, nextUser) => {
  const removesActiveAdmin =
    existingUser.role === 'admin' &&
    existingUser.isActive &&
    (!nextUser || nextUser.role !== 'admin' || nextUser.isActive === false);
  return removesActiveAdmin && (await usersRepository.countActiveAdmins()) <= 1;
};

export const getAllUsers = async (req, res) => {
  try {
    res.json(await usersRepository.getAllUsers());
  } catch (error) {
    sendUserError(res, error, 'load');
  }
};

export const getTechnicians = async (req, res) => {
  try {
    const users = await usersRepository.getAllUsers();
    const technicians = users
      .filter((user) => user.isActive)
      .map(({ id, username, displayName, role }) => ({ id, username, displayName, role }));
    res.json(technicians);
  } catch (error) {
    sendUserError(res, error, 'load');
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await usersRepository.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    sendUserError(res, error, 'load');
  }
};

export const createUser = async (req, res) => {
  const validationError = validateUserRequest(req.body, true);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const passwordHash = await hashPassword(req.body.password);
    const user = await usersRepository.createUser({
      username: req.body.username,
      displayName: req.body.displayName,
      role: req.body.role,
      isActive: req.body.isActive,
      passwordHash,
    });
    res.status(201).json(user);
  } catch (error) {
    sendUserError(res, error, 'create');
  }
};

export const updateUser = async (req, res) => {
  const validationError = validateUserRequest(req.body, false);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const existingUser = await usersRepository.getUserById(req.params.id);
    if (!existingUser) return res.status(404).json({ message: 'User not found' });
    if (await wouldRemoveLastAdmin(existingUser, req.body)) {
      return res.status(409).json({ message: 'The last active administrator cannot be disabled or demoted' });
    }

    const passwordHash = req.body.password ? await hashPassword(req.body.password) : null;
    const user = await usersRepository.updateUser(req.params.id, {
      username: req.body.username,
      displayName: req.body.displayName,
      role: req.body.role,
      isActive: req.body.isActive,
      passwordHash,
    });
    res.json(user);
  } catch (error) {
    sendUserError(res, error, 'update');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const existingUser = await usersRepository.getUserById(req.params.id);
    if (!existingUser) return res.status(404).json({ message: 'User not found' });
    if (await wouldRemoveLastAdmin(existingUser, null)) {
      return res.status(409).json({ message: 'The last active administrator cannot be deleted' });
    }

    const user = await usersRepository.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    sendUserError(res, error, 'delete');
  }
};
