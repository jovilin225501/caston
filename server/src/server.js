import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDevDataIfNeeded } from './utils/seedDevData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Establish database connection
    await connectDB();

    // Auto-seed sample events and credentials if running empty database in development
    if (process.env.NODE_ENV !== 'production') {
      await seedDevDataIfNeeded();
    }

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 CampusConnect Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Commencing graceful shutdown...`);
      server.close(async () => {
        console.log('[Server] HTTP connections closed.');
        await disconnectDB();
        process.exit(0);
      });

      // Force terminate after 10 seconds if not closed cleanly
      setTimeout(() => {
        console.error('[Server] Forcing shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error(`[Server Error] Startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
