import { request } from './client.js';

const USERS_URL = '/api/users';

export function getUsers() {
  return request(USERS_URL);
}

export function getUser(id) {
  return request(`${USERS_URL}/${id}`);
}

export function createUser(user) {
  return request(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
}

export function updateUser(id, user) {
  return request(`${USERS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
}

export function deleteUser(id) {
  return request(`${USERS_URL}/${id}`, { method: 'DELETE' });
}
