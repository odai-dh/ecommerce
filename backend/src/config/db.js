import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Remove deprecated options - no longer needed in Mongoose 6+
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit - let the server run even if DB fails initially
    console.error('⚠️  Server will continue running. Check your MONGO_URI environment variable.');
  }
};

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

export default connectDB;
