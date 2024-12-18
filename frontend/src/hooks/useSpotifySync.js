import { UseAuthContext } from '../contexts/AuthContext';

/**
 * Custom hook for handling Spotify account synchronization
 * @returns {Object} Object containing syncSpotify function
 */
export const useSpotifySync = () => {
  // Get user data from AuthContext
  const { user } = UseAuthContext();

  /**
   * Initiates Spotify authentication flow
   * Redirects to backend login endpoint, which then redirects to Spotify login page
   */
  const syncSpotify = () => {
    const { email } = user;

    // Redirect to backend login endpoint, which will redirect to Spotify login page
    window.location.href = `${import.meta.env.VITE_BACKEND_SERVER}/login-spotify?email=${email}`;
  };

  return { syncSpotify };
};
