import { useState } from 'react';
import { UseMessage } from '../contexts/MessageContext';
import { getFollowedArtistsApi } from '../services/apiService';

/**
 * Custom hook to fetch and manage followed artists from Spotify
 * @returns {Object} Object containing artists array, loading state and refetch function
 */
export const useSpotifyFollowedArtists = () => {
  // State for storing artists data
  const [artists, setArtists] = useState([]);

  // Loading state indicator
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = UseMessage();

  /**
   * Fetches the current user's followed artists from Spotify API
   */
  const refetch = async () => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;

    setIsLoading(true);

    try {
      const artists = await getFollowedArtistsApi();
      setArtists(artists);
    } catch (err) {
      showError(err.message || 'Failed to retrieve data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    artists,
    isLoading,
    refetch,
  };
};
