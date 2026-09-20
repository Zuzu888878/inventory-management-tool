import { request, saveToken } from './client.js';

export async function login(username, password) {
  const result = await request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  saveToken(result.token);
  return result;
}
