/**
 * Validates required environment variables at startup
 * Warns if variables are missing but doesn't exit in production
 */
export const validateEnv = () => {
  const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n⚠️  WARNING: Server may not function correctly without these variables!');
    console.error('Please set them in your deployment platform (Render, Vercel, etc.)\n');

    // Only exit in development, not production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables are set');
  }

  // Validate JWT_SECRET strength if it exists
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security.');
  }
};

export default validateEnv;
