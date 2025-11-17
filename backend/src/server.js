import dotenv from 'dotenv';
import app from './app.js';
import validateEnv from './config/validateEnv.js';

// Load environment variables first
dotenv.config();

// Validate environment variables
validateEnv();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});