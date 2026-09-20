import { request } from './client.js';

const SPARE_PARTS_URL = '/api/spare-parts';

export function getSpareParts() {
  return request(SPARE_PARTS_URL);
}

export function getSparePart(id) {
  return request(`${SPARE_PARTS_URL}/${id}`);
}

export function createSparePart(sparePart) {
  return request(SPARE_PARTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sparePart),
  });
}

export function updateSparePart(id, sparePart) {
  return request(`${SPARE_PARTS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sparePart),
  });
}

export function deleteSparePart(id) {
  return request(`${SPARE_PARTS_URL}/${id}`, {
    method: 'DELETE',
  });
}
