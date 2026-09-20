import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length > 0 ? null : 'Password is required';
};

export const hashPassword = async (password) => {
  const error = validatePassword(password);
  if (error) throw new Error(error);

  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
};

export const verifyPassword = async (password, storedHash) => {
  if (!password || typeof password !== 'string' || !storedHash || typeof storedHash !== 'string') return false;

  const [prefix, salt, expectedHash, extra] = storedHash.split('$');
  if (prefix !== 'scrypt' || extra !== undefined || !salt || !expectedHash) return false;

  try {
    const actualHash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
};
