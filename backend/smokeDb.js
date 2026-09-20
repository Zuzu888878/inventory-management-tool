import pool from './config.js';

const client = await pool.connect();

try {
  await client.query('BEGIN');

  const assetResult = await client.query(
    `INSERT INTO assets (asset_code, name, category)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [`SMOKE-${Date.now()}`, 'Smoke test asset', 'test']
  );
  const assetId = assetResult.rows[0].id;

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

  console.log('Database smoke test passed');
} catch (error) {
  console.error('Database smoke test failed:', error.message);
  process.exitCode = 1;
} finally {
  await client.query('ROLLBACK');
  client.release();
  await pool.end();
}
