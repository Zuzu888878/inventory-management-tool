import dotenv from 'dotenv';
import app from './app.js';
import pool from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('Connected to PostgreSQL');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();