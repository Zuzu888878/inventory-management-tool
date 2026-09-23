import pool from './config.js';
import { hashPassword } from './passwords.js';

const client = await pool.connect();

try {
  await client.query('BEGIN');

  const assetResult = await client.query(
    `INSERT INTO assets (asset_code, name, category, machine_type)
     VALUES ($1, $2, $3, $4)
     RETURNING id, machine_type`,
    [`SMOKE-${Date.now()}`, 'Smoke test asset', 'test', 'Smoke machine type']
  );
  const assetId = assetResult.rows[0].id;

  if (assetResult.rows[0].machine_type !== 'Smoke machine type') {
    throw new Error('Asset machine type could not be persisted');
  }

  await client.query(
    `INSERT INTO spare_parts (name, quantity_in_stock)
     VALUES ($1, $2)`,
    ['Smoke test part', 1]
  );

  const maintenanceResult = await client.query(
    `INSERT INTO maintenance_records (
       asset_id, maintenance_type, scheduled_date, status
     ) VALUES ($1, $2, CURRENT_DATE, $3)
     RETURNING id`,
    [assetId, 'Smoke inspection', 'planned']
  );

  const joinedResult = await client.query(
    `SELECT maintenance_records.id
     FROM maintenance_records
     JOIN assets ON assets.id = maintenance_records.asset_id
     WHERE maintenance_records.id = $1`,
    [maintenanceResult.rows[0].id]
  );

  if (joinedResult.rowCount !== 1) {
    throw new Error('Maintenance-to-asset relationship could not be read');
  }

  const passwordHash = await hashPassword('smoke-test-password');
  const userResult = await client.query(
    `INSERT INTO users (username, display_name, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, role`,
    [`smoke.${Date.now()}`, 'Smoke test user', passwordHash, 'viewer']
  );

  if (userResult.rows[0].role !== 'viewer') {
    throw new Error('User role could not be persisted');
  }

  console.log('Database smoke test passed');
} catch (error) {
  console.error('Database smoke test failed:', error.message);
  process.exitCode = 1;
} finally {
  await client.query('ROLLBACK');
  client.release();
  await pool.end();
}
