const jwt = require('jsonwebtoken');
const { findUser } = require('../utils/users.dao');

/**
 * Middleware to verify user authentication status
 * Authentication is optional - this middleware only checks the login status
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const checkAuth = async (req, res, next) => {
  // Extract JWT token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Initialize authentication state
  req.isAuthenticated = false;
  req.user = null;

  if (token) {
    try {
      // Verify JWT token and decode user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await findUser(decoded.email);

      // Set authentication state if user exists
      if (user) {
        req.isAuthenticated = true;
        req.user = user;
      }
    } catch (error) {
      console.log('Invalid token or user not found');
    }
  }

  next();
};

module.exports = checkAuth;
