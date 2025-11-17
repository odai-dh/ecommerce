import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUserController, loginUserController, updateUserProfileController } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import User from '../models/useModel.js';

const router = express.Router();

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: 'Too many accounts created from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerLimiter, registerUserController);
router.post('/login', authLimiter, loginUserController);
router.put('/profile', authenticate, updateUserProfileController);

// Protected endpoint - requires authentication
router.get('/', authenticate, async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude passwords from the response
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;