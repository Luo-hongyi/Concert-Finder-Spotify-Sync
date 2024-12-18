const express = require('express');
const router = express.Router();
const { findUser } = require('../utils/users.dao');
const checkAuth = require('../middlewares/auth.middleware');

/**
 * Get user's followed artists (synced with Spotify profile)
 * @route GET /followed-artists
 * @middleware checkAuth - Verifies user authentication
 * @returns {Array} List of followed artists
 */
router.get('/followed-artists', checkAuth, async (req, res, next) => {
  console.log('\nFollowed Artists');
  // Return empty array if user is not authenticated
  if (!req.isAuthenticated) {
    console.log('Not authenticated\n');
    return res.json([]);
  }

  try {
    // Fetch user information from database
    const user = await findUser(req.user.email);
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // Return user's followed artists array
    res.json(user.followed_artists);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
