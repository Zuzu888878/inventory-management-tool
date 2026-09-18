import express from 'express';
import assetRoutes from './routes.js';


const app = express();

// Middleware for parsing JSON request bodies.
app.use(express.json());

// Simple root endpoint for testing the API status
app.get('/', (req, res) => {
    res.json({ message: 'Leets AG Asset Management API is running' });
});

// Asset API routes
app.use('/api/assets', assetRoutes);

export default app;