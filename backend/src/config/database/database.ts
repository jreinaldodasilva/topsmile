import mongoose from 'mongoose';
import logger from '../../utils/logger';

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/topsmile';
  
  const options: mongoose.ConnectOptions = {
    maxPoolSize: 50, // Increased for production workloads (recommended 20-50)
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false // Disable mongoose buffering
  };

  return { uri, options };
};

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export const connectToDatabase = async (retries = 0): Promise<void> => {
  try {
    const { uri, options } = getDatabaseConfig();
    
    logger.info(`🔄 Connecting to MongoDB (attempt ${retries + 1}/${MAX_RETRIES})...`);
    
    await mongoose.connect(uri, options);
    
    logger.info('✅ MongoDB connected successfully');
    logger.info(`📊 Database: ${mongoose.connection.name}`);
    logger.info(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`🔄 ${signal} received. Shutting down gracefully...`);
      try {
        await mongoose.connection.close();
        logger.info('✅ MongoDB connection closed');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, '❌ Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Handle process exit
    process.on('exit', (code) => {
      logger.info(`👋 Process exiting with code: ${code}`);
    });

  } catch (error) {
    logger.error({ error }, '❌ MongoDB connection error');
    
    // Log additional details for debugging
    if (error instanceof Error) {
      logger.error({ message: error.message, stack: error.stack }, 'Error details');
    }
    
    if (retries < MAX_RETRIES - 1) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retries);
      logger.info(`Retrying connection in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      await connectToDatabase(retries + 1);
    } else {
      logger.error('❌ Max MongoDB connection retries reached. Exiting process.');
      process.exit(1);
    }
  }
};

// Connection event listeners with better logging
mongoose.connection.on('error', (error) => {
  logger.error({ error }, '❌ MongoDB connection error');
});

mongoose.connection.on('disconnected', () => {
  logger.info('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected');
});

mongoose.connection.on('connecting', () => {
  logger.info('🔄 MongoDB connecting...');
});

mongoose.connection.on('connected', () => {
  logger.info('🔌 MongoDB connected');
});

// Export connection state helper
export const getDatabaseConnectionState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const state = mongoose.connection.readyState;
  return {
    state,
    stateName: states[state as keyof typeof states],
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};