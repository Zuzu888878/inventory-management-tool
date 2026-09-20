import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import app from '../app.js';
import { createAuthToken } from '../authTokens.js';
import pool from '../config.js';
import assetRepository from '../data.js';
import dashboardRepository from '../dashboardData.js';
import maintenanceRepository from '../maintenanceData.js';
import { hashPassword } from '../passwords.js';
import sparePartsRepository from '../sparePartsData.js';
import usersRepository from '../usersData.js';

let server;
let baseUrl;
let nextId;
let assets;
let spareParts;
let maintenanceRecords;
let users;
let authToken;
let loginPasswordHash;

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
  loginPasswordHash = await hashPassword('test-password');

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

  usersRepository.getAllUsers = async () => clone(users);
  usersRepository.getUserById = async (id) => clone(getById(users, id));
  usersRepository.getUserByUsername = async (username) =>
    clone(users.find((user) => user.username === username.toLowerCase()) || null);
  usersRepository.getUserCredentialsByUsername = async (username) => {
    const normalizedUsername = username.toLowerCase();
    if (!['test-user', 'inactive-user'].includes(normalizedUsername)) return null;
    return {
      id: normalizedUsername === 'test-user' ? 99 : 100,
      username: normalizedUsername,
      displayName: 'Test User',
      role: 'admin',
      isActive: normalizedUsername === 'test-user',
      passwordHash: loginPasswordHash,
    };
  };
  usersRepository.createUser = async ({ passwordHash, ...user }) => {
    assert.ok(passwordHash.startsWith('scrypt$'));
    const created = { ...clone(user), id: nextId++ };
    users.push(created);
    return clone(created);
  };
  usersRepository.updateUser = async (id, { passwordHash, ...user }) => {
    if (passwordHash) assert.ok(passwordHash.startsWith('scrypt$'));
    return updateById(users, id, user);
  };
  usersRepository.deleteUser = async (id) => deleteById(users, id);
  usersRepository.countActiveAdmins = async () => users.filter((user) => user.role === 'admin' && user.isActive).length;
  dashboardRepository.getDashboard = async () => ({
    assets: { total: 2, active: 1, needsAttention: 1, offline: 0 },
    spareParts: { totalItems: 3, totalUnits: 8, lowStock: 1, outOfStock: 0 },
    maintenance: { open: 1, overdue: 1, dueSoon: 0, inProgress: 0, completedThisMonth: 0, costThisMonth: 0 },
    schedule: [],
    lowStockItems: [],
    generatedAt: new Date().toISOString(),
  });

  authToken = createAuthToken({ id: 99, username: 'test-user', role: 'admin' });

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
  users = [];
  process.env.API_TOKEN = 'test-api-token';
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  await pool.end();
});

async function request(path, { token = authToken, ...options } = {}) {
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
  assert.equal('password' in created.body, false);
  assert.equal('passwordHash' in created.body, false);

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
  assert.equal(valid.body.token.split('.').length, 3);
  assert.equal(valid.body.user.username, 'test-user');
  assert.equal(valid.body.user.role, 'admin');
});

test('login rejects inactive users', async () => {
  const result = await request('/api/login', {
    token: null,
    method: 'POST',
    body: JSON.stringify({ username: 'inactive-user', password: 'test-password' }),
  });
  assert.equal(result.response.status, 401);
});

test('protected routes reject missing and invalid authorization', async () => {
  const missing = await request('/api/assets', { token: null });
  assert.equal(missing.response.status, 401);

  const invalid = await request('/api/assets', { token: 'wrong' });
  assert.equal(invalid.response.status, 403);
});

test('dashboard API returns operational summary for authenticated users', async () => {
  const result = await request('/api/dashboard');
  assert.equal(result.response.status, 200);
  assert.equal(result.body.assets.total, 2);
  assert.equal(result.body.maintenance.overdue, 1);
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

test('user API hashes passwords and supports create, list, get, update, and delete', async () => {
  await assertCrud({
    path: '/api/users',
    createBody: {
      username: 'operator.one',
      displayName: 'Operator One',
      password: 'initial-secure-password',
      role: 'editor',
      isActive: true,
    },
    updateBody: {
      username: 'operator.one',
      displayName: 'Operator One Updated',
      role: 'viewer',
      isActive: true,
    },
  });
});

test('user API protects the last active administrator', async () => {
  users.push({
    id: 1,
    username: 'admin',
    displayName: 'Administrator',
    role: 'admin',
    isActive: true,
  });

  const deleted = await request('/api/users/1', { method: 'DELETE' });
  assert.equal(deleted.response.status, 409);

  const demoted = await request('/api/users/1', {
    method: 'PUT',
    body: JSON.stringify({
      username: 'admin',
      displayName: 'Administrator',
      role: 'viewer',
      isActive: true,
    }),
  });
  assert.equal(demoted.response.status, 409);
});

test('user API is restricted to administrators', async () => {
  const viewerToken = createAuthToken({ id: 100, username: 'viewer', role: 'viewer' });
  const result = await request('/api/users', { token: viewerToken });
  assert.equal(result.response.status, 403);
});

test('technicians list API is accessible to all authenticated users and returns active users', async () => {
  users.push(
    { id: 1, username: 'tech.active', displayName: 'Active Technician', role: 'editor', isActive: true },
    { id: 2, username: 'tech.inactive', displayName: 'Inactive Technician', role: 'editor', isActive: false }
  );

  const viewerToken = createAuthToken({ id: 100, username: 'viewer', role: 'viewer' });
  const result = await request('/api/users/technicians', { token: viewerToken });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.length, 1);
  assert.equal(result.body[0].username, 'tech.active');
  assert.equal(result.body[0].displayName, 'Active Technician');
  assert.equal(result.body[0].passwordHash, undefined);
});
