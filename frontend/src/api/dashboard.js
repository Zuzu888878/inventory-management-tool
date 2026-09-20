import { request } from './client.js';

export function getDashboard() {
  return request('/api/dashboard');
}
