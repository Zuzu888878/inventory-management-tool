import { request } from './client.js';

const ASSETS_URL = '/api/assets';

export function getAssets() {
  return request(ASSETS_URL);
}

export function getAsset(id) {
  return request(`${ASSETS_URL}/${id}`);
}

export function createAsset(asset) {
  return request(ASSETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset),
  });
}

export function updateAsset(id, asset) {
  return request(`${ASSETS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset),
  });
}

export function deleteAsset(id) {
  return request(`${ASSETS_URL}/${id}`, { method: 'DELETE' });
}
