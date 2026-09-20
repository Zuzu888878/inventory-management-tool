import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import app from '../app.js';
import pool from '../config.js';
import assetRepository from '../data.js';
import maintenanceRepository from '../maintenanceData.js';
import sparePartsRepository from '../sparePartsData.js';

let server;
let baseUrl;
let nextId;
let assets;
let spareParts;
let maintenanceRecords;

const clone = (value) => structuredClone(value);
const getById = (items, id) => items.find((item) => String(item.id) === String(id)) || null;
const updateById = (items, id, value) => {
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;
  items[index] = { ...items[index], ...clone(value), id: items[index].id };
  return clone(items[index]);
};
const deleteById = (items, id) => {
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;
  return clone(items.splice(index, 1)[0]);
};

before(async () => {
  process.env.API_TOKEN = 'test-api-token';
  process.env.APP_USERNAME = 'test-user';
  process.env.APP_PASSWORD = 'test-password';

  assetRepository.getAllAssets = async () => clone(assets);
  assetRepository.getAssetById = async (id) => clone(getById(assets, id));
  assetRepository.createAsset = async (asset) => {
    const created = { ...clone(asset), id: nextId++ };
    assets.push(created);
    return clone(created);
  };
  assetRepository.updateAsset = async (id, asset) => updateById(assets, id, asset);
  assetRepository.deleteAsset = async (id) => deleteById(assets, id);

  sparePartsRepository.getAllSpareParts = async () => clone(spareParts);
  sparePartsRepository.getSparePartById = async (id) => clone(getById(spareParts, id));
  sparePartsRepository.createSparePart = async (part) => {
    const created = { ...clone(part), id: nextId++ };
    spareParts.push(created);
    return clone(created);
  };
  sparePartsRepository.updateSparePart = async (id, part) => updateById(spareParts, id, part);
  sparePartsRepository.deleteSparePart = async (id) => deleteById(spareParts, id);

  maintenanceRepository.getAllMaintenance = async () => clone(maintenanceRecords);
  maintenanceRepository.getMaintenanceById = async (id) => clone(getById(maintenanceRecords, id));
  maintenanceRepository.createMaintenance = async (record) => {
    const created = { ...clone(record), id: nextId++ };
    maintenanceRecords.push(created);
    return clone(created);
  };
  maintenanceRepository.updateMaintenance = async (id, record) => updateById(maintenanceRecords, id, record);
  maintenanceRepository.deleteMaintenance = async (id) => deleteById(maintenanceRecords, id);

  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

beforeEach(() => {
  nextId = 1;
  assets = [];
  spareParts = [];
  maintenanceRecords = [];
  process.env.API_TOKEN = 'test-api-token';
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  await pool.end();
});

async function request(path, { token = 'test-api-token', ...options } = {}) {
  const headers = new Headers(options.headers);
  if (token !== null) headers.set('Authorization', `Bearer ${token}`);
  if (options.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const body = await response.json();
  return { response, body };
}

async function assertCrud({ path, createBody, updateBody }) {
  const created = await request(path, { method: 'POST', body: JSON.stringify(createBody) });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.id, 1);

  const listed = await request(path);
  assert.equal(listed.response.status, 200);
  assert.equal(listed.body.length, 1);

  const fetched = await request(`${path}/1`);
  assert.equal(fetched.response.status, 200);

  const updated = await request(`${path}/1`, {
    method: 'PUT',
    body: JSON.stringify(updateBody),
  });
  assert.equal(updated.response.status, 200);

  const deleted = await request(`${path}/1`, { method: 'DELETE' });
  assert.equal(deleted.response.status, 200);

  const missing = await request(`${path}/1`);
  assert.equal(missing.response.status, 404);
}

test('login rejects invalid credentials and returns a token for valid credentials', async () => {
  const invalid = await request('/api/login', {
    token: null,
    method: 'POST',
    body: JSON.stringify({ username: 'test-user', password: 'wrong' }),
  });
  assert.equal(invalid.response.status, 401);

  const valid = await request('/api/login', {
    token: null,
    method: 'POST',
    body: JSON.stringify({ username: 'test-user', password: 'test-password' }),
  });
  assert.equal(valid.response.status, 200);
  assert.equal(valid.body.token, 'test-api-token');
});

test('protected routes reject missing and invalid authorization', async () => {
  const missing = await request('/api/assets', { token: null });
  assert.equal(missing.response.status, 401);

  const invalid = await request('/api/assets', { token: 'wrong' });
  assert.equal(invalid.response.status, 403);
});

test('protected routes fail closed when API_TOKEN is not configured', async () => {
  delete process.env.API_TOKEN;
  const result = await request('/api/assets', { token: 'undefined' });
  assert.equal(result.response.status, 503);
});

test('asset API supports create, list, get, update, and delete', async () => {
  await assertCrud({
    path: '/api/assets',
    createBody: { assetCode: 'A-1', name: 'Lathe', category: 'Machine' },
    updateBody: { assetCode: 'A-1', name: 'Lathe 2', category: 'Machine' },
  });
});

test('spare-part API supports create, list, get, update, and delete', async () => {
  await assertCrud({
    path: '/api/spare-parts',
    createBody: { name: 'Bearing', quantityInStock: 3 },
    updateBody: { name: 'Bearing', quantityInStock: 5 },
  });
});

test('maintenance API supports create, list, get, update, and delete', async () => {
  await assertCrud({
    path: '/api/maintenance',
    createBody: {
      assetId: 10,
      maintenanceType: 'Inspection',
      scheduledDate: '2026-10-01',
      status: 'planned',
    },
    updateBody: {
      assetId: 10,
      maintenanceType: 'Annual inspection',
      scheduledDate: '2026-10-01',
      status: 'completed',
    },
  });
});
