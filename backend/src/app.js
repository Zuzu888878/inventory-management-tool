import express from 'express';
import morgan from 'morgan';
import assetRoutes from './modules/assets/assets.routes.js';
import sparePartsRoutes from './modules/spareParts/spareParts.routes.js';
import maintenanceRoutes from './modules/maintenance/maintenance.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import { login } from './modules/auth/auth.controller.js';

const app = express();

morgan.token('local-date', () => new Date().toLocaleString());
morgan.token('response-size', (req, res) => res.getHeader('content-length') || '0');

app.use(
  morgan(
    '[:local-date] :method :url -> :status in :response-time ms (:response-size bytes)'
  )
);

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
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);

export default app;
