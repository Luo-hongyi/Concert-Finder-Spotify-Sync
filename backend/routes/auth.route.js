const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { findUser, saveUser, deleteAllUsers, deleteUser, findAllUsers } = require('../utils/users.dao');
const checkAuth = require('../middlewares/auth.middleware');
const { hashPassword, verifyPassword, resetUserPassword } = require('../utils/password.utils');

// JWT authentication middleware
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const jwt = require('jsonwebtoken');

/**
 * Create JWT token for user authentication
 * @param {string} email - User's email address
 * @returns {string} JWT token
 */
const createToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '72h',
  });
};

/**
 * User registration endpoint
 * @route POST /signup
 */
router.post('/signup', async (req, res) => {
  // console.log('\nSignUp: ', req.body);
  const { email, name, password, zip_code, range } = req.body;
  try {
    // Validate input
    if (!email || !password || !name) {
      console.log('\nMissing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check for existing user
    const user = await findUser(email);
    if (user) {
      console.log('\nUser already exists');
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash password
    const hashedPassword = await hashPassword(password);
    const newUser = { email, name, password: hashedPassword, zip_code, range };

    // Save user to database
    await saveUser(newUser);

    // Generate authentication token
    const token = createToken(email);

    // Remove sensitive data
    delete newUser.password;

    // Return token and user info
    res.json({
      token,
      user: newUser,
    });

    console.log('\nUser registered successfully');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

/**
 * User login endpoint
 * @route POST /login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Input validation
    if (!email || !password) {
      console.log('\nEmail and password are required');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await findUser(email);
    if (!user) {
      console.log('\nUser not found');
      return res.status(400).json({ error: 'User not found' });
    }

    // Password validation
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.log('\nInvalid password');
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Create token
    const token = createToken(user.email);

    // Remove sensitive data
    delete user.password;

    // Return token and user info
    res.json({
      token,
      user,
    });

    console.log('\nLogin success');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

/**
 * User logout endpoint
 * @route POST /logout
 */
router.post('/logout', (req, res) => {
  console.log('\nLogout Request: ', req.body);
  // Frontend will clear localStorage
  res.json({ message: 'Logged out successfully' });
});

/**
 * Get user profile endpoint
 * @route GET /profile
 * @middleware checkAuth - Verifies user authentication
 */
router.get('/profile', checkAuth, async (req, res) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const user = await findUser(req.user.email);

  // Remove sensitive data
  delete user.password;

  res.json(user);
});

/**
 * Update user profile endpoint
 * @route PUT /profile
 * @middleware checkAuth - Verifies user authentication
 */
router.put('/profile', checkAuth, async (req, res) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Only update name, password, zip_code, range, and followed_events
  const { name, password, zip_code, range, followed_events } = req.body;

  // Create update object with only fields that need to be updated
  const updateData = {
    email: req.user.email, // Add email field for identification
  };
  if (name) updateData.name = name;
  if (zip_code) updateData.zip_code = zip_code;
  if (range) updateData.range = range;
  if (followed_events) updateData.followed_events = followed_events;

  // Only update password if new password is provided
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await saveUser(updateData); // Pass object containing email
  res.json(user);
});

// Test endpoints below
/**
 * Get all user accounts (Testing only)
 * @route GET /users-account
 */
router.get('/users-account', async (req, res) => {
  let users = await findAllUsers();
  // First convert MongoDB documents to plain JS objects
  users = JSON.parse(JSON.stringify(users));

  users = users.map((user) => {
    // eslint-disable-next-line no-unused-vars
    const { followed_artists, followed_events, ...rest } = user;
    return rest;
  });
  res.json(users);
});

/**
 * Get all users data (Testing only)
 * @route GET /users
 */
router.get('/users', async (req, res) => {
  const users = await findAllUsers();
  res.json(users);
});

/**
 * Delete all users (Testing only)
 * @route GET /delete-users
 */
router.get('/delete-users', async (req, res) => {
  await deleteAllUsers();
  res.json({ message: 'All users deleted' });
});

/**
 * Delete specific user (Testing only)
 * @route DELETE /delete-user
 */
router.delete('/delete-user', async (req, res) => {
  const email = req.query.email;
  await deleteUser(email);
  res.json({ message: 'User deleted' });
});

/**
 * Reset user password (Testing only)
 * @route GET /reset-password
 */
router.get('/reset-password', async (req, res) => {
  const email = req.query.email;
  const newPassword = req.query.password;
  const result = await resetUserPassword(email, newPassword);
  res.json({ message: `Password reset successful for ${email}(${newPassword}): ${result ? 'OK' : 'Failed'}` });
});

module.exports = router;
