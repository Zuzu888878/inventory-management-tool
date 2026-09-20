import express from 'express';
import assetRoutes from './routes.js';
import sparePartsRoutes from './sparePartsRoutes.js';
import maintenanceRoutes from './maintenanceRoutes.js';
import { login } from './controllers.js';

const app = express();

// Middleware for parsing JSON request bodies.
app.use(express.json());

// Simple root endpoint for testing the API status
app.get('/', (req, res) => {
  res.json({ message: 'Leets AG Asset Management API is running' });
});

app.post('/api/login', login);

// Asset API routes
app.use('/api/assets', assetRoutes);
app.use('/api/spare-parts', sparePartsRoutes);
app.use('/api/maintenance', maintenanceRoutes);

export default app;
