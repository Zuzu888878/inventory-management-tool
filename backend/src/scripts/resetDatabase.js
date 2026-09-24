import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const database = process.env.DB_NAME || 'inventory_management_db';
const maintenanceDatabase = process.env.DB_MAINTENANCE_NAME || 'postgres';

if (['postgres', 'template0', 'template1'].includes(database.toLowerCase())) {
  console.error(`Refusing to reset protected database "${database}". Set DB_NAME to the app database in backend/.env.`);
  process.exit(1);
}

if (database === maintenanceDatabase) {
  console.error('DB_NAME and DB_MAINTENANCE_NAME must be different. Set DB_MAINTENANCE_NAME to postgres or another maintenance database.');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: maintenanceDatabase,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  connectionTimeoutMillis: 5000,
});
const quotedDatabase = `"${database.replaceAll('"', '""')}"`;

try {
  await pool.query('SELECT 1');
  await pool.query(
    'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()',
    [database],
  );
  await pool.query(`DROP DATABASE IF EXISTS ${quotedDatabase}`);
  await pool.query(`CREATE DATABASE ${quotedDatabase}`);
  console.log(`Database "${database}" was recreated successfully.`);
} catch (error) {
  console.error(`Could not recreate database "${database}": ${error.message}`);
  console.error(`Connect to the PostgreSQL server at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'} and check that ${process.env.DB_USER || 'postgres'} can create and drop databases.`);
  console.error('If your server uses a different maintenance database, set DB_MAINTENANCE_NAME in backend/.env.');
  process.exitCode = 1;
} finally {
  await pool.end();
}
