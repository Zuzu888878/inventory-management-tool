import { request } from './client.js';

export const getProducts = () => request('/api/products');
export const getProduct = (id) => request(`/api/products/${id}`);
export const createProduct = (product) => request('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
export const updateProduct = (id, product) => request(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
export const deleteProduct = (id) => request(`/api/products/${id}`, { method: 'DELETE' });
