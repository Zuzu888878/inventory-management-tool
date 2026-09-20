import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL_SECONDS = Number(process.env.AUTH_TOKEN_TTL_SECONDS) || 8 * 60 * 60;

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const sign = (value, secret) => createHmac('sha256', secret).update(value).digest('base64url');

export const createAuthToken = (user) => {
  const secret = process.env.API_TOKEN;
  if (!secret) throw new Error('Authentication is not configured');

  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    sub: String(user.id),
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });
  const unsignedToken = `${header}.${payload}`;
  return `${unsignedToken}.${sign(unsignedToken, secret)}`;
};

export const verifyAuthToken = (token) => {
  const secret = process.env.API_TOKEN;
  if (!secret || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [header, payload, signature] = parts;
    const expectedSignature = Buffer.from(sign(`${header}.${payload}`, secret), 'base64url');
    const actualSignature = Buffer.from(signature, 'base64url');
    if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
      return null;
    }

    const parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
    const parsedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') return null;
    if (!parsedPayload.sub || !parsedPayload.username || !parsedPayload.role) return null;
    if (!Number.isInteger(parsedPayload.exp) || parsedPayload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsedPayload;
  } catch {
    return null;
  }
};
