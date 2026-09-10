import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import express from 'express';
import assetRoutes from './routes.js';

const app = express();

// Middleware für JSON-Requests
app.use(express.json());

// Optionaler Test-Endpunkt
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API-Routen einbinden
app.use('/api/assets', assetRoutes);

export default app;