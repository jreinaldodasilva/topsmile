import mongoose from 'mongoose';

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/topsmile';
  
  const options: mongoose.ConnectOptions = {
    // Remove deprecated options that are now default
    // useNewUrlParser and useUnifiedTopology are default in Mongoose 6+
  };

  return { uri, options };
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    const { uri, options } = getDatabaseConfig();
    
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(uri, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🔄 Shutting down gracefully...');
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Exit process on connection failure
    process.exit(1);
  }
};

// Connection event listeners
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});