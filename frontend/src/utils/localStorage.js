// src/utils/localStorage.js

// Safe JSON parsing utility
/**
 * Safely parses a JSON string, returns null if parsing fails
 * @param {string} value - The string to parse
 * @returns {object|null} Parsed object or null if parsing fails
 */
const safeJSONParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return null;
  }
};

// Stores an item in localStorage
/**
 * Stores an item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {boolean} [shouldStringify=true] - Whether to stringify the value
 * @returns {boolean} Success status
 */
export const setItem = (key, value, shouldStringify = true) => {
  try {
    const serializedValue = shouldStringify ? JSON.stringify(value) : value;
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Storage Error:', error.message);
    return false;
  }
};

// Retrieves an item from localStorage
/**
 * Retrieves an item from localStorage
 * @param {string} key - Storage key
 * @param {boolean} [shouldParse=true] - Whether to parse the retrieved value
 * @returns {*} Retrieved value or null if not found
 */
export const getItem = (key, shouldParse = true) => {
  try {
    const item = localStorage.getItem(key);
    return shouldParse ? safeJSONParse(item) : item;
  } catch (error) {
    console.error('Retrieval Error:', error.message);
    return null;
  }
};

// Removes an item from localStorage
/**
 * Removes an item from localStorage
 * @param {string} key - Storage key to remove
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Removal Error:', error.message);
    return false;
  }
};

// Clears all data from localStorage
/**
 * Clears all data from localStorage
 * @returns {boolean} Success status
 */
export const clearAllStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Clear Error:', error.message);
    return false;
  }
};

// JWT Token operations
export const TOKEN_KEY = 'jwt_token';
export const loadToken = () => localStorage.getItem(TOKEN_KEY);
export const storeToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// User operations
export const USER_KEY = 'user';
export const loadUser = () => localStorage.getItem(USER_KEY);
export const storeUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(USER_KEY);
