import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };
const HASH_PREFIX = 'scrypt';

export const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length === 0) return 'Password is required';
  return null;
};

export const hashPassword = async (password) => {
  const validationError = validatePassword(password);
  if (validationError) throw new Error(validationError);

  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);

  return [
    HASH_PREFIX,
    SCRYPT_OPTIONS.N,
    SCRYPT_OPTIONS.r,
    SCRYPT_OPTIONS.p,
    salt.toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
};

export const verifyPassword = async (password, storedHash) => {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false;

  const [prefix, nValue, rValue, pValue, saltValue, hashValue, extra] = storedHash.split('$');
  if (prefix !== HASH_PREFIX || extra !== undefined || !saltValue || !hashValue) return false;

  const N = Number(nValue);
  const r = Number(rValue);
  const p = Number(pValue);
  if (N !== SCRYPT_OPTIONS.N || r !== SCRYPT_OPTIONS.r || p !== SCRYPT_OPTIONS.p) return false;

  try {
    const salt = Buffer.from(saltValue, 'base64url');
    const expectedHash = Buffer.from(hashValue, 'base64url');
    if (salt.length !== 16 || expectedHash.length !== KEY_LENGTH) return false;

    const actualHash = await scrypt(password, salt, expectedHash.length, SCRYPT_OPTIONS);
    return timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
};
