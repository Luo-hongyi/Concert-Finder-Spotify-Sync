const axios = require('axios');
const https = require('https');

/**
 * Creates and configures an axios instance with default settings and error handling
 * @param {Object} config - Custom axios configuration options
 * @returns {import('axios').AxiosInstance} Configured axios instance
 */
const createAxiosInstance = (config = {}) => {
  const instance = axios.create({
    timeout: 15000, // Default timeout of 15 seconds
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // Allows self-signed SSL certificates for development
      keepAlive: false, // Prevents connection pooling for better resource management
    }),
    ...config,
  });

  // Add response interceptor for global error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(`\nAxiosInstance Error (${config.baseURL || 'unknown'}):`, error.message);
      throw error;
    }
  );

  return instance;
};

// API Client Initialization
// Each client is configured for specific service endpoints

/**
 * Spotify OAuth authentication API client
 * Used for token management and authentication flows
 */
const spotifyAccountApi = createAxiosInstance({
  baseURL: 'https://accounts.spotify.com/api',
});

/**
 * Spotify Web API client
 * Handles all Spotify service endpoints except authentication
 */
const spotifyApi = createAxiosInstance({
  baseURL: 'https://api.spotify.com/v1',
});

/**
 * Ticketmaster Discovery API client
 * Manages all event-related API requests
 */
const ticketmasterApi = createAxiosInstance({
  baseURL: 'https://app.ticketmaster.com/discovery/v2',
});

// Ticketmaster request interceptor configuration
ticketmasterApi.interceptors.request.use((config) => {
  // Initialize params object if not present
  config.params = config.params || {};

  // Configure required API parameters
  config.params.apikey = require('../config/ticketmaster.config').APIKEY || 'QAk8zGc1PXKr9Y92MuRJvhSkyzxiLTS6';
  config.params.classificationName = config.params.classificationName || 'Music'; // Filter results to music events
  config.params.locale = config.params.locale || 'en-us'; // Set default language and region

  // Generate and log complete request URL for debugging
  const fullUrl = axios.getUri({
    url: config.url,
    baseURL: config.baseURL,
    params: config.params,
  });

  console.log('Request URL:', fullUrl);

  return config;
});

/**
 * @exports {Object} API clients and factory function
 * @property {Function} createAxiosInstance - Factory function for creating new axios instances
 * @property {import('axios').AxiosInstance} spotifyAccountApi - Spotify authentication client
 * @property {import('axios').AxiosInstance} spotifyApi - Spotify Web API client
 * @property {import('axios').AxiosInstance} ticketmasterApi - Ticketmaster API client
 */
module.exports = {
  createAxiosInstance,
  spotifyAccountApi,
  spotifyApi,
  ticketmasterApi,
};
