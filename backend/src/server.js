import dotenv from 'dotenv';
import app from './app.js';
import validateEnv from './config/validateEnv.js';

// Load environment variables first
dotenv.config();

// Validate environment variables (warns but doesn't exit in production)
validateEnv();

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Required for Render and other cloud platforms

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
