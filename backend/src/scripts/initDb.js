import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pool from '../config/database.js';

const schemaUrl = new URL('../../db/schema.sql', import.meta.url);

try {
  const schema = await readFile(fileURLToPath(schemaUrl), 'utf8');
  await pool.query(schema);
  await pool.query(`
    ALTER TABLE maintenance_records ADD COLUMN IF NOT EXISTS technician_id BIGINT REFERENCES users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS maintenance_records_technician_id_idx ON maintenance_records (technician_id);
  `);
  console.log('Database schema initialized');
} catch (error) {
  console.error('Failed to initialize database:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
