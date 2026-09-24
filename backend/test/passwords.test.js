import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hashPassword, validatePassword, verifyPassword } from '../src/utils/passwords.js';

test('password hashes are salted and can be verified', async () => {
  const password = 'correct-horse-battery-staple';
  const firstHash = await hashPassword(password);
  const secondHash = await hashPassword(password);

  assert.notEqual(firstHash, secondHash);
  assert.equal(await verifyPassword(password, firstHash), true);
  assert.equal(await verifyPassword('incorrect-password', firstHash), false);
});

test('password verification safely rejects malformed hashes', async () => {
  assert.equal(await verifyPassword('any-password', 'invalid'), false);
  assert.equal(await verifyPassword('any-password', ''), false);
  assert.equal(await verifyPassword('any-password', null), false);
});

test('password validation only requires a non-empty password', () => {
  assert.equal(validatePassword(''), 'Password is required');
  assert.equal(validatePassword(null), 'Password is required');
  assert.equal(validatePassword('x'), null);
  assert.equal(validatePassword('a'.repeat(1000)), null);
});
