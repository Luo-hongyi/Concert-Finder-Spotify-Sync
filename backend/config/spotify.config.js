require('dotenv').config();

// Get the first frontend address as the primary address
const primaryFrontendUrl = process.env.FRONTEND_ORIGINS.split(';')[0];

const config = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REDIRECT_URI: `${process.env.BACKEND_SERVER}/callback`, // Redirect URI for Spotify authentication
  FRONTEND_URI: primaryFrontendUrl, // Use the full frontend URL directly
  SCOPES: 'user-follow-read user-read-email', // Spotify scopes for user data access
};

module.exports = config;
