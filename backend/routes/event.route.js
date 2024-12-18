const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/auth.middleware');
const { getEvents } = require('../services/ticketmaster.service');
const zipcodes = require('zipcodes');

/**
 * Utility function to get user's coordinates
 *@param {Request} req - Express request object
 * @returns {Object} Object containing latitude and longitude
 */
const getCoordinates = (req) => {
  let latitude = 40.1164; // Default UIUC latitude
  let longitude = -88.2434; // Default UIUC longitude

  if (req.isAuthenticated && req.user.zip_code) {
    // For logged-in users: convert zip code to coordinates
    const location = zipcodes.lookup(req.user.zip_code);
    if (location) {
      latitude = location.latitude;
      longitude = location.longitude;
    }
  } else if (req.query.latitude && req.query.longitude) {
    // For non-logged-in users: use provided coordinates
    latitude = parseFloat(req.query.latitude);
    longitude = parseFloat(req.query.longitude);
  }

  console.log('getCoordinates:', { latitude, longitude });
  return { latitude, longitude };
};

/**
 * Event Feeds Route
 * - Not logged in: Shows recent concerts for any artist
 * - Logged in: Shows recent concerts for followed artists
 */
router.get('/event-feeds', checkAuth, async (req, res, next) => {
  console.log('\nEvent Feeds');
  // Parse query parameters
  const size = parseInt(req.query.size);
  const startDateStr = req.query.startDateStr;
  const endDateStr = req.query.endDateStr;
  const searchlocation = req.query.searchlocation;
  let events;

  try {
    // Get user location coordinates
    const { latitude, longitude } = getCoordinates(req);

    if (req.isAuthenticated && req.user.followed_artists?.length > 0) {
      // For logged-in users: Get concerts for followed artists
      const attractionIds = req.user.followed_artists
        .filter((artist) => artist.ticketmaster_id)
        .map((artist) => artist.ticketmaster_id);

      events = await getEvents({
        latitude,
        longitude,
        attractionIds, // Get events for followed artists
        size: size,
        sort: 'date,asc',
        followedEvents: req.user.followed_events, // Check if events already followed
        startDateStr,
        endDateStr,
        searchlocation,
      });
    } else {
      // For non-logged-in users: Get any recent concerts in US/CA
      console.log('Not logged in');
      events = await getEvents({
        latitude,
        longitude,
        countryCode: 'CA,US', // Get events in US/CA
        size: size,
        sort: 'date,asc',
        followedEvents: [], // No events followed for non-logged-in users
        startDateStr,
        endDateStr,
        searchlocation,
      });
    }

    res.json(events);
  } catch (error) {
    next(error);
  }
});

/**
 * Followed Events Route
 * - Notlogged in: Returns empty array
 * - Logged in: Returns user's followed events
 */
router.get('/followed-events', checkAuth, async (req, res, next) => {
  console.log('\nFollowed Events');
  const size = parseInt(req.query.size);

  if (!req.isAuthenticated) {
    return res.json({ events: [] });
  }

  try {
    // Get user coordinates
    const { latitude, longitude } = getCoordinates(req);

    // For logged-in users: Getfollowed events
    if (req.user.followed_events?.length < 1) {
      return res.json({ events: [] });
    }

    const events = await getEvents({
      latitude,
      longitude,
      eventIds: req.user.followed_events, // Get followed events
      size: size,
      sort: 'date,asc',
      followedEvents: req.user.followed_events, // Check if events already followed
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

/**
 * Recommended Events Route
 * -Not logged in: Shows events within 250km of UIUC (61820)
 * - Logged in: Shows events within user's set location and range
 * - Strictly sorted by distance (nearest first)
 */
router.get('/recommended-events', checkAuth, async (req, res, next) => {
  console.log('\nRecommended Events');
  try {
    // Get user coordinates and set search radius
    const { latitude, longitude } = getCoordinates(req);
    const radius = req.isAuthenticated ? req.user.range || 250 : 250;

    // Fetch events within the specified radius
    const events = await getEvents({
      latitude,
      longitude,
      radius, // Set search radius
      size: 40, // Fetch more events initially to allow for filtering
      sort: 'distance,asc',
      followedEvents: req.isAuthenticated ? req.user.followed_events : [], // Check if events already followed
    });

    // Filter out events already shown in Event Feeds for logged-in users
    if (req.isAuthenticated && req.user.followed_artists?.length > 0) {
      const followedArtistIds = req.user.followed_artists
        .filter((artist) => artist.ticketmaster_id)
        .map((artist) => artist.ticketmaster_id);

      // Remove events where any performer is in user's followed artists
      events.events = events.events.filter((event) => {
        const eventArtistIds = event.attractions?.map((attraction) => attraction.id) || [];
        return !eventArtistIds.some((id) => followedArtistIds.includes(id));
      });
    }

    // Filter out events already shown in Followed Events for logged-in users
    if (req.isAuthenticated && req.user.followed_events?.length > 0) {
      events.events = events.events.filter((event) => !req.user.followed_events.includes(event.id));
    }

    // Randomly shuffle and limit to 8 events for variety in recommendations
    events.events = events.events.sort(() => Math.random() - 0.5).slice(0, 8);

    res.json(events);
  } catch (error) {
    next(error);
  }
});

/**
 * Artist Events Route
 * Returns events fora specific artist
 * @param {string} req.query.id - Artist's Ticketmaster ID
 */
router.get('/artist-events', checkAuth, async (req, res, next) => {
  const size = parseInt(req.query.size);
  const artistId = req.query.id;
  const searchlocation = req.query.searchlocation;

  try {
    const { latitude, longitude } = getCoordinates(req);
    const events = await getEvents({
      latitude,
      longitude,
      attractionIds: [artistId], // Get events for a specific artists
      size: size,
      sort: 'date,asc',
      followedEvents: req.isAuthenticated ? req.user.followed_events : [], // Check if events already followed
      searchlocation,
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

/**
 * Search Events Route
 * Search events bykeyword, date range and location
 */
router.get('/search-events', checkAuth, async (req, res, next) => {
  const size = parseInt(req.query.size);
  const keyword = req.query.keyword;
  const startDateStr = req.query.startDateStr;
  const endDateStr = req.query.endDateStr;
  const searchlocation = req.query.searchlocation;

  try {
    // Get user coordinates
    const { latitude, longitude } = getCoordinates(req);

    const events = await getEvents({
      latitude,
      longitude,
      keyword, // Search keyword
      size: size,
      sort: 'date,asc',
      followedEvents: req.isAuthenticated ? req.user.followed_events : [], // Check if events already followed
      startDateStr,
      endDateStr,
      searchlocation,
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

/**
 * Event Details Route
 * Get detailed informationfor a specific event
 * @param {string} req.query.eventId - Event's Ticketmaster ID
 */
router.get('/event-by-id', checkAuth, async (req, res, next) => {
  console.log('\nEvent By Id');
  const eventId = req.query.eventId;
  try {
    // Get user coordinates
    const { latitude, longitude } = getCoordinates(req);

    // Getevent information
    const events = await getEvents({
      eventIds: [eventId], // Get specific event, only one event
      latitude,
      longitude,
      size: 1,
      sort: 'distance,asc',
      followedEvents: req.isAuthenticated ? req.user.followed_events : [], // Check if event already followed
      mode: 'DETAIL',
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

/**
 * Toggle Event Favorite Status Route
 * Add or remove an event from user's favorites
 * @param {string} req.body.eventId - Event's Ticketmaster ID
 * @param {boolean} req.body.state - True to favorite, false to unfavorite
 */
router.post('/events/favorite', checkAuth, async (req, res, next) => {
  // Event ID and favorite state
  const { eventId, state } = req.body;

  try {
    if (!req.isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const user = req.user;
    const followedEvents = user.followed_events || [];

    if (state) {
      // Add to favorites
      if (!followedEvents.includes(eventId)) {
        followedEvents.push(eventId);
      }
    } else {
      // Remove from favorites
      const index = followedEvents.indexOf(eventId);
      if (index > -1) {
        followedEvents.splice(index, 1);
      }
    }

    // Update user's favorite list
    await req.user.updateOne({ followed_events: followedEvents });

    res.json({
      success: true,
      enabled: state,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
