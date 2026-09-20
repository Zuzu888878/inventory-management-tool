import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pool from './config.js';

const schemaUrl = new URL('./db/schema.sql', import.meta.url);

try {
  const schema = await readFile(fileURLToPath(schemaUrl), 'utf8');
  await pool.query(schema);
  console.log('Database schema initialized');
} catch (error) {
  console.error('Failed to initialize database:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
