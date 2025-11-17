import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, updateUser } from '../service/user.js';

// Password validation function
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return errors;
};

// Register a new user
export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: passwordErrors.join('. ') });
    }

    // Check if the user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed Password:', hashedPassword);

    // Create the user
    const user = await createUser({ name, email, password: hashedPassword });
    console.log('User created:', user);


    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login a user
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT
    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserProfileController = async (req, res) => {
    try {
      const userId = req.user.id; // Extracted from the JWT token Look it up, how i can estract data frome jwt token
      const { name, email, password } = req.body;
  
      // Validate input
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }
  
      // Prepare updated fields
      const updatedFields = { name, email };
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedFields.password = await bcrypt.hash(password, salt);
      }
  
  
      // Update user in the database
      const updatedUser = await updateUser(userId, updatedFields);
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
};