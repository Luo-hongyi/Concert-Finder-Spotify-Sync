const querystring = require('querystring');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPES } = require('../config/spotify.config');
const { spotifyApi, spotifyAccountApi } = require('../utils/axios.clients');

/**
 * Generates a Spotify authorization URL with the specified email as state parameter
 * @param {string} email - User's email address to be encoded as state
 * @returns {string} Complete Spotify authorization URL
 */
const generateAuthUrl = (email) => {
  // Encode email as base64 for state parameter
  const state = Buffer.from(email).toString('base64');
  return (
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state,
      show_dialog: true,
      prompt: 'login',
    })
  );
};

/**
 * Exchanges authorization code for access token
 * @param {string} code - Authorization code received from Spotify
 * @returns {Promise<Object>} Token response containing access_token, refresh_token, etc.
 */
const getAccessToken = async (code) => {
  // Request access token using authorization code
  const response = await spotifyAccountApi.post(
    '/token',
    querystring.stringify({
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
    {
      headers: {
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};

/**
 * Retrieves user's followed artists from Spotify
 * @param {string} accessToken - Valid Spotify access token
 * @returns {Promise<Array>} Array of artist objects with normalized data structure
 */
const getFollowedArtists = async (accessToken) => {
  // Fetch followed artists using Spotify API
  const response = await spotifyApi.get('/me/following', {
    params: { type: 'artist' },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Transform and normalize artist data
  return response.data.artists.items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    followers: artist.followers.total,
    image: artist.images[0].url,
  }));
};

module.exports = {
  generateAuthUrl,
  getAccessToken,
  getFollowedArtists,
};
