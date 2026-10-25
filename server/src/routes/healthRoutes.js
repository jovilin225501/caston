import express from 'express';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = isDbConnected();

  return res.status(200).json({
    status: 'ok',
    service: 'CampusConnect API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

export default router;
