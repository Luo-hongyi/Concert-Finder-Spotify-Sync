import { useEffect, useState } from 'react';
import { UseAuthContext } from '../contexts/AuthContext';
import { UseMessage } from '../contexts/MessageContext';
import {
  getArtistEventsApi,
  getEventByIdApi,
  getEventFeedsApi,
  getFollowedEventsApi,
  getRecommendedEventsApi,
  searchEventsApi,
} from '../services/apiService';

/**
 * Gets the current geolocation of the user
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
const getCurrentLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: 0, longitude: 0 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve({ latitude: 0, longitude: 0 });
      }
    );
  });

/**
 * Determines whether to use location data for the API request
 * @param {boolean} isLoggedIn - User's login status
 * @returns {Promise<{latitude: number, longitude: number} | undefined>}
 */
const getLocationForRequest = async (isLoggedIn) => {
  // 1. Get current location
  const location = await getCurrentLocation();

  // 2. Check if location is valid (not 0,0)
  const isValidLocation = location.latitude !== 0 || location.longitude !== 0;

  // 3. Determine whether to use location parameter
  // - Logged in users: Don't use location, backend will get preferred location from user profile
  // - Non-logged in users: Use location if valid, otherwise undefined
  const shouldUseLocation = !isLoggedIn && isValidLocation;

  return shouldUseLocation ? location : undefined;
};

/**
 * Custom hook for fetching different types of events
 * @param {string} type - Type of events to fetch (feeds/favorites/recommended/artist/search)
 * @param {number} defaultSize - Default number of events to fetch
 * @param {Object} options - Additional options for the API request
 * @returns {Object} Events data, spellcheck info, loading state and refetch function
 */
const useEvents = (type, defaultSize, options = {}) => {
  const [events, setEvents] = useState([]);
  const [spellcheck, setSpellcheck] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = UseMessage();
  const { isLoggedIn } = UseAuthContext();

  // console.log('useEvents options:', options);

  /**
   * Fetches events data based on the specified type and parameters
   * @param {number} [newSize=defaultSize] - Number of events to fetch, defaults to defaultSize
   * @returns {Promise<void>} - Returns nothing, updates the events state internally
   */
  const refetch = async (newSize = defaultSize) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Get location information
      const locationData = await getLocationForRequest(isLoggedIn);
      // console.log('locationData:', locationData);

      // Convert date picker format (YYYY-MM-DD) to full datetime
      const startDateStr = options.startDateStr ? `${options.startDateStr}T00:00:00` : '';
      const endDateStr = options.endDateStr ? `${options.endDateStr}T23:59:59` : '';

      // Prepare options for API request
      const optionsForApi = {
        size: newSize,
        startDateStr,
        endDateStr,
        searchlocation: options.searchlocation,
      };
      if (locationData) {
        optionsForApi.latitude = locationData.latitude;
        optionsForApi.longitude = locationData.longitude;
      }

      let response;
      switch (type) {
        // Get event feeds
        case 'feeds':
          response = await getEventFeedsApi(optionsForApi);
          break;

        // Get followed events, 200=no limit, this is ticketmaster's limit
        case 'favorites':
          response = await getFollowedEventsApi(optionsForApi);

          break;

        // Get recommended concerts based on user's location preferences or current location
        case 'recommended':
          response = await getRecommendedEventsApi(optionsForApi);
          break;

        // Get artist events
        case 'artist':
          optionsForApi.artistId = options.artistId;
          response = await getArtistEventsApi(optionsForApi);
          break;

        // Search concerts
        case 'search':
          optionsForApi.keyword = options.keyword;
          response = await searchEventsApi(optionsForApi);
          break;

        // Default is to get a specific event by ID
        default:
          optionsForApi.eventId = options.eventId;
          response = await getEventByIdApi(optionsForApi);
          break;
      }

      // Set events list
      setEvents(response.events || []);

      // Set spellcheck info
      setSpellcheck({
        originalKeyword: response.originalKeyword || '',
        spellcheck: response.spellcheck || '',
      });
    } catch (err) {
      showError(err.message || 'Failed to retrieve data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, defaultSize, JSON.stringify(options)]);

  return {
    events,
    spellcheck,
    isLoading,
    refetch,
  };
};

export default useEvents;
