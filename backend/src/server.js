import dotenv from 'dotenv';
import app from './app.js';
import pool from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('Connected to PostgreSQL');

        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        server.on('error', (error) => {
            console.error(`Failed to listen on port ${PORT}: ${error.message}`);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT in backend/.env.`);
            }
            process.exitCode = 1;
            pool.end();
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        console.error('Check that PostgreSQL is running and backend/.env has the correct DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD.');
        process.exit(1);
    }
};

startServer();
