import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '5432';
const database = process.env.DB_NAME || 'inventory_management_db';
const user = process.env.DB_USER || 'postgres';
const pool = new Pool({
  host,
  port,
  database,
  user,
  password: process.env.DB_PASSWORD || 'postgres',
  connectionTimeoutMillis: 5000,
});

try {
  await pool.query('SELECT 1');
  console.log(`PostgreSQL is ready (${user}@${host}:${port}/${database})`);
} catch (error) {
  console.error(`Could not connect to PostgreSQL at ${host}:${port}/${database} as ${user}.`);

  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    console.error('Start the PostgreSQL server, then check DB_HOST and DB_PORT in backend/.env.');
    console.error('Install PostgreSQL: https://www.postgresql.org/download/');
  } else if (error.code === '3D000') {
    console.error(`The database "${database}" does not exist. Create it with: createdb -U ${user} ${database}`);
    console.error('Alternatively, create the database in pgAdmin, then run this launcher again.');
  } else if (error.code === '28P01' || error.code === '28000') {
    console.error('The database credentials were rejected. Update DB_USER and DB_PASSWORD in backend/.env.');
  } else {
    console.error(`PostgreSQL reported: ${error.message}`);
    console.error('Check the DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD values in backend/.env.');
  }

  process.exitCode = 1;
} finally {
  await pool.end();
}
