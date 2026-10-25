import mongoose from 'mongoose';

let mongoServerInstance = null;
let isConnecting = false;

export const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  isConnecting = true;
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '' && mongoUri !== 'memory') {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`[MongoDB] Connected successfully to Atlas/External database: ${conn.connection.host}`);
      isConnecting = false;
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
      isConnecting = false;
      return conn;
    } catch (memErr) {
      console.warn('[MongoDB] mongodb-memory-server not available or failed to start:', memErr.message);
      const fallbackLocalUri = 'mongodb://127.0.0.1:27017/campusconnect';
      const conn = await mongoose.connect(fallbackLocalUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[MongoDB] Connected to local MongoDB fallback at ${fallbackLocalUri}`);
      isConnecting = false;
      return conn;
    }
  } catch (error) {
    isConnecting = false;
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    console.warn('[MongoDB Notice] If deploying on Render, please ensure IP "0.0.0.0/0" (Allow access from anywhere) is added in MongoDB Atlas -> Network Access.');
    
    // Auto-retry connection in the background every 8 seconds without crashing the server process
    console.log('[MongoDB] Scheduling connection retry in 8 seconds...');
    setTimeout(connectDB, 8000);
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
