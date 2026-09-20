import { request, saveSession } from './client.js';

export async function login(username, password) {
  const result = await request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  saveSession(result.token, result.user);
  return result;
}
