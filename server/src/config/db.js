import mongoose from 'mongoose';

let mongoServerInstance = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '' && mongoUri !== 'memory') {
      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB] Connected successfully to Atlas/External database: ${conn.connection.host}`);
      return conn;
    }

    // In-memory fallback for zero-friction local development and automated testing
    console.log('[MongoDB] No external MONGODB_URI provided. Initializing in-memory MongoDB instance for local dev/testing...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongoServerInstance.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] In-memory MongoDB running at: ${inMemoryUri}`);
      return conn;
    } catch (memErr) {
      console.warn('[MongoDB] mongodb-memory-server not available or failed to start:', memErr.message);
      // Attempt localhost default connection as last resort
      const fallbackLocalUri = 'mongodb://127.0.0.1:27017/campusconnect';
      const conn = await mongoose.connect(fallbackLocalUri);
      console.log(`[MongoDB] Connected to local MongoDB fallback at ${fallbackLocalUri}`);
      return conn;
    }
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    // If running in development without strict DB requirement on startup, do not crash immediately
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
    }
    console.log('[MongoDB] Database disconnected gracefully.');
  } catch (error) {
    console.error(`[MongoDB Disconnect Error]: ${error.message}`);
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};
