import { request } from './client.js';

const MAINTENANCE_URL = '/api/maintenance';

export function getMaintenanceRecords() {
  return request(MAINTENANCE_URL);
}

export function getMaintenanceRecord(id) {
  return request(`${MAINTENANCE_URL}/${id}`);
}

export function createMaintenanceRecord(maintenance) {
  return request(MAINTENANCE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(maintenance),
  });
}

export function updateMaintenanceRecord(id, maintenance) {
  return request(`${MAINTENANCE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(maintenance),
  });
}

export function deleteMaintenanceRecord(id) {
  return request(`${MAINTENANCE_URL}/${id}`, { method: 'DELETE' });
}
