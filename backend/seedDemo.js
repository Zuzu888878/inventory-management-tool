import pool from './config.js';

const demoAssets = [
  ['DEMO-LATHE-01', 'CNC Precision Lathe', 'Machining', 'warning', 'online'],
  ['DEMO-MILL-01', 'Vertical Milling Machine', 'Machining', 'active', 'online'],
  ['DEMO-COMP-01', 'Workshop Air Compressor', 'Utilities', 'maintenance', 'offline'],
  ['DEMO-PUMP-01', 'Hydraulic Test Pump', 'Testing', 'active', 'online'],
];

const client = await pool.connect();

try {
  await client.query('BEGIN');

  await client.query(`
    DELETE FROM maintenance_records
    WHERE asset_id IN (SELECT id FROM assets WHERE asset_code LIKE 'DEMO-%')
  `);
  await client.query("DELETE FROM assets WHERE asset_code LIKE 'DEMO-%'");
  await client.query("DELETE FROM spare_parts WHERE name LIKE '[Demo] %'");

  const assetIds = {};
  for (const [assetCode, name, category, status, iotState] of demoAssets) {
    const result = await client.query(
      `INSERT INTO assets (asset_code, name, category, status, iot_state, location, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [assetCode, name, category, status, iotState, 'Demo Workshop', 'Seeded demonstration asset']
    );
    assetIds[assetCode] = result.rows[0].id;
  }

  await client.query(
    `INSERT INTO spare_parts (name, manufacturer_number, compatible_machine_type, quantity_in_stock, description)
     VALUES
       ('[Demo] Cutting Insert', 'DEMO-INSERT-01', 'CNC Lathe', 0, 'Demo item showing an out-of-stock alert'),
       ('[Demo] Hydraulic Filter', 'DEMO-FILTER-01', 'Hydraulic Test Pump', 3, 'Demo item showing a low-stock alert'),
       ('[Demo] Drive Belt', 'DEMO-BELT-01', 'Workshop Air Compressor', 12, 'Demo item with healthy stock'),
       ('[Demo] Coolant Concentrate', 'DEMO-COOLANT-01', 'CNC Lathe', 4, 'Demo item showing a low-stock alert'),
       ('[Demo] Safety Guard', 'DEMO-GUARD-01', 'Vertical Milling Machine', 25, 'Demo item with healthy stock')`
  );

  await client.query(
    `INSERT INTO maintenance_records
       (asset_id, maintenance_type, scheduled_date, status, technician, notes)
     VALUES
       ($1, 'Spindle inspection', CURRENT_DATE - 14, 'planned', 'Alex Morgan', 'Demo overdue maintenance'),
       ($2, 'Quarterly service', CURRENT_DATE + 7, 'planned', 'Jamie Lee', 'Demo upcoming maintenance'),
       ($3, 'Compressor repair', CURRENT_DATE, 'in_progress', 'Alex Morgan', 'Demo maintenance due today'),
       ($4, 'Annual calibration', CURRENT_DATE - 45, 'completed', 'Jamie Lee', 'Demo completed maintenance')`,
    [assetIds['DEMO-LATHE-01'], assetIds['DEMO-MILL-01'], assetIds['DEMO-COMP-01'], assetIds['DEMO-PUMP-01']]
  );

  await client.query('COMMIT');
  console.log('Demo assets, spare parts, and maintenance records seeded');
} catch (error) {
  await client.query('ROLLBACK');
  console.error('Failed to seed demo data:', error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
