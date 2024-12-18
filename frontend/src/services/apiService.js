import axios from 'axios';
import { loadToken, removeToken } from '../utils/localStorage';

// Create an instance of axios with custom configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning when testing with ngrok tunnel
  },
  withCredentials: true, // Allow sending cookies and authentication headers with cross-origin requests
  timeout: 20000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Load authentication token from local storage
    const token = loadToken();
    // console.log('API Request:', {
    //   method: config.method,
    //   url: config.url,
    //   hasToken: Boolean(token),
    //   token,
    // });
    return {
      ...config, // original configs
      headers: {
        ...config.headers, // original headers
        Authorization: token ? `Bearer ${token}` : undefined, // Add authorization header if token is present
      },
    };
  },
  (error) => Promise.reject(error) // Reject the promise if there's an error
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the response status is 401 (Unauthorized), remove the token and redirect to login page
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ********** User related APIs ********** //

/**
 * Register a new user
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @param {string} zip_code
 * @param {number} range
 * @returns {Promise<Object>}
 */
export const signupApi = async (email, password, name, zip_code, range) => {
  const response = await api.post('/signup', { email, password, name, zip_code, range });
  return response.data;
};

/**
 * User login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export const loginApi = async (email, password) => {
  // console.log('Sending login request');
  const response = await api.post('/login', { email, password });
  // console.log('Login API response:', response);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error('Login failed');
};

/**
 * User logout
 * @returns {Promise<Object>}
 */
export const logoutApi = async () => {
  const response = await api.post('/logout');
  return response.data;
};

/**
 * Fetch user profile data
 * @returns {Promise<Object>}
 */
export const fetchUserApi = async () => {
  const response = await api.get('/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const updateUserApi = async (userData) => {
  const response = await api.put('/profile', userData);
  return response.data;
};

// ********** Artist related APIs ********** //

/**
 * Get user's followed artists
 * @returns {Promise<Object>}
 */
export const getFollowedArtistsApi = async () => {
  const response = await api.get('/followed-artists');
  return response.data;
};

// ********** Event related APIs ********** //

/**
 * Get event feeds with filtering options
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getEventFeedsApi = async (options) => {
  const params = new URLSearchParams({
    size: options.size,
  });
  if (options.latitude) {
    params.append('latitude', options.latitude);
    params.append('longitude', options.longitude);
  }
  if (options.searchlocation) {
    params.append('searchlocation', options.searchlocation);
  }
  if (options.startDateStr) {
    params.append('startDateStr', options.startDateStr);
    params.append('endDateStr', options.endDateStr);
  }
  // console.log(`✈️ getEventFeedsApi:`, params.toString().split('&'));
  const response = await api.get(`/event-feeds?${params}`);
  return response.data;
};

/**
 * Get user's followed events
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getFollowedEventsApi = async (options) => {
  const params = new URLSearchParams({
    size: options.size,
  });
  if (options.latitude) {
    params.append('latitude', options.latitude);
    params.append('longitude', options.longitude);
  }

  const response = await api.get(`/followed-events?${params}`);
  return response.data;
};

/**
 * Get recommended events
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getRecommendedEventsApi = async (options) => {
  const params = new URLSearchParams({
    size: options.size,
  });
  if (options.latitude) {
    params.append('latitude', options.latitude);
    params.append('longitude', options.longitude);
  }
  const response = await api.get(`/recommended-events?${params}`);
  return response.data;
};

/**
 * Get artist events and profile information
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getArtistEventsApi = async (options) => {
  const params = new URLSearchParams({
    id: options.artistId,
    size: options.size,
  });
  if (options.latitude) {
    params.append('latitude', options.latitude);
    params.append('longitude', options.longitude);
  }

  const response = await api.get(`/artist-events?${params}`);
  return response.data;
};

/**
 * Search events with spell check support
 * Returns spell check results in originalKeyword and spellcheck when no results found
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const searchEventsApi = async (options) => {
  const params = new URLSearchParams({
    keyword: options.keyword,
    size: options.size,
  });
  if (options.latitude) {
    params.append('latitude', options.latitude);
    params.append('longitude', options.longitude);
  }
  if (options.searchlocation) {
    params.append('searchlocation', options.searchlocation);
  }
  if (options.startDateStr) {
    params.append('startDateStr', options.startDateStr);
    params.append('endDateStr', options.endDateStr);
  }

  const response = await api.get(`/search-events?${params}`);
  return response.data;
};

/**
 * Get specific event by ID
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getEventByIdApi = async (options) => {
  // console.log('getEventByIdApi: ', options.eventId, options.size, options.locationData);
  const params = new URLSearchParams({
    eventId: options.eventId,
    size: options.size,
  });
  if (options.latitude) {
    params.append('latitude', options.latitude);
    params.append('longitude', options.longitude);
  }

  const response = await api.get(`/event-by-id?${params}`);
  // console.log('event-by-id count:', response.data.events.length);
  return response.data;
};

/**
 * !TODO: Toggle user notification settings
 * @param {string} userId
 * @param {boolean} enabled
 * @returns {Promise<Object>}
 */
export const toggleNotificationApi = async (userId, enabled) =>
  // Mock API call delay
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, enabled });
    }, 500);
  });
