const express = require('express');
const router = express.Router();
const { FRONTEND_URI } = require('../config/spotify.config');
const { saveUser, findUser } = require('../utils/users.dao');
const { generateAuthUrl, getAccessToken, getFollowedArtists } = require('../services/spotify.service');
const { getTicketmasterIds } = require('../services/ticketmaster.service');
/*
   Spotify Sync Flow
   ----------------------------
   User->Frontend: Click sync Spotify button
   Frontend->Backend: Send sync Spotify request
   Backend->Spotify->Frontend: Redirect to authorization page
   Spotify->User: Show authorization confirmation page
   User->Spotify: Confirm authorization
   Spotify->Backend: Return one-time authorization code
   Backend->Spotify: Exchange code for access_token & refresh_token
   Backend->Spotify: Get user's followed artists using access_token
   Backend->Ticketmaster: Get Ticketmaster IDs using artist names
   Backend->Database: Save followed artists
   Backend->Frontend: Sync success, redirect to frontend with success flag
*/

/**
 * Initiates Spotify login process
 * @route GET /login-spotify
 * @param {string} req.query.email - User's email address
 * @returns {void} Redirects to Spotify authorization page
 */
router.get('/login-spotify', (req, res) => {
  const email = req.query.email;
  console.log('\nlogin-spotify email: ', email);

  const authUrl = generateAuthUrl(email);
  res.redirect(authUrl);
});

/**
 * Handles Spotify OAuth callback
 * @route GET /callback
 * @param {string} req.query.code - Authorization code from Spotify
 * @param {string} req.query.state - Base64 encoded email
 * @returns {void} Redirects to frontend with sync status
 */
router.get('/callback', async (req, res, next) => {
  try {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const email = Buffer.from(state, 'base64').toString('utf8');

    const user = await findUser(email);
    if (!user) {
      console.log('\nUser not found: ', email);
      return res.redirect(`${FRONTEND_URI}?sync_spotify=failed`);
    }

    const { access_token } = await getAccessToken(code);
    let followed = await getFollowedArtists(access_token);
    // console.log('\nFollowed artists: ', followed);

    // Get Ticketmaster artist IDs
    const ticketmasterIds = await getTicketmasterIds(followed);
    // console.log('\nTicketmaster IDs: ', ticketmasterIds);

    // Merge Ticketmaster data with followed artists
    followed.forEach((followed) => {
      const ticketmaster = ticketmasterIds.find((id) => id.name === followed.name);
      followed.ticketmaster_id = ticketmaster?.ticketmaster_id;
      followed.ticketmaster_url = ticketmaster?.ticketmaster_url;
      followed.upcoming_events = ticketmaster?.upcoming_events;
      followed.ticketmaster_image_16_9 = ticketmaster?.ticketmaster_image_16_9;
      followed.ticketmaster_image_3_2 = ticketmaster?.ticketmaster_image_3_2;
      followed.ticketmaster_genre = ticketmaster?.ticketmaster_genre;
      followed.youtube_link = ticketmaster?.youtube_link;
      followed.twitter_link = ticketmaster?.twitter_link;
      followed.itunes_link = ticketmaster?.itunes_link;
      followed.lastfm_link = ticketmaster?.lastfm_link;
      followed.spotify_link = ticketmaster?.spotify_link;
      followed.facebook_link = ticketmaster?.facebook_link;
      followed.musicbrainz_link = ticketmaster?.musicbrainz_link;
      followed.instagram_link = ticketmaster?.instagram_link;
      followed.wiki_link = ticketmaster?.wiki_link;
      followed.homepage_link = ticketmaster?.homepage_link;
    });

    // Save updated user data to database
    user.followed_artists = followed;
    await saveUser(user);

    console.log('\nSync Spotify success, redirect to: ', FRONTEND_URI);
    res.redirect(`${FRONTEND_URI}?sync_spotify=success`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
