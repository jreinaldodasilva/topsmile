import mongoose from 'mongoose';

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/topsmile';
  
  const options: mongoose.ConnectOptions = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
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
    
    console.log(`🔄 Connecting to MongoDB (attempt ${retries + 1}/${MAX_RETRIES})...`);
    
    await mongoose.connect(uri, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`🔄 ${signal} received. Shutting down gracefully...`);
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Handle process exit
    process.on('exit', (code) => {
      console.log(`👋 Process exiting with code: ${code}`);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Log additional details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    if (retries < MAX_RETRIES - 1) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retries);
      console.log(`Retrying connection in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      await connectToDatabase(retries + 1);
    } else {
      console.error('❌ Max MongoDB connection retries reached. Exiting process.');
      process.exit(1);
    }
  }
};

// Connection event listeners with better logging
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('connecting', () => {
  console.log('🔄 MongoDB connecting...');
});

mongoose.connection.on('connected', () => {
  console.log('🔌 MongoDB connected');
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