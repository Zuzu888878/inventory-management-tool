import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, types } = pg;

// PostgreSQL DATE values do not contain a time or timezone. Keep them as
// YYYY-MM-DD strings so JSON serialization cannot shift them to another day.
types.setTypeParser(types.builtins.DATE, (value) => value);

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'inventory_management_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pool.on('error', (error) => {
    console.error('PostgreSQL connection error:', error.message);
});

export default pool;
