import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAuthToken, verifyAuthToken } from '../src/utils/authTokens.js';

test('signed authentication tokens preserve user identity and role', () => {
  process.env.API_TOKEN = 'token-test-secret';
  const token = createAuthToken({ id: 42, username: 'operator', role: 'editor' });
  const payload = verifyAuthToken(token);

  assert.equal(payload.sub, '42');
  assert.equal(payload.username, 'operator');
  assert.equal(payload.role, 'editor');
});

test('tampered authentication tokens are rejected', () => {
  process.env.API_TOKEN = 'token-test-secret';
  const token = createAuthToken({ id: 42, username: 'operator', role: 'editor' });
  const [header, payload, signature] = token.split('.');

  assert.equal(verifyAuthToken(`${header}.${payload}.${signature}x`), null);
  assert.equal(verifyAuthToken('not-a-token'), null);
});
