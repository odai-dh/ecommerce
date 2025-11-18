import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import validateEnv from './config/validateEnv.js';

// Load environment variables first
dotenv.config();

// Validate environment variables (warns but doesn't exit in production)
validateEnv();

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Required for Render and other cloud platforms

// Start server FIRST (so Render detects the port is open)
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Server started at: ${new Date().toISOString()}`);

  // Connect to MongoDB AFTER server is listening
  // This prevents timeout issues on Render
  connectDB().then(() => {
    console.log('📊 Database connection attempted');
  }).catch((err) => {
    console.error('Database connection failed:', err.message);
  });
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error(`❌ Server error: ${error.message}`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
