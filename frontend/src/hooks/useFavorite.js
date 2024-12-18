import { useEffect } from 'react';
import { UseAuthContext } from '../contexts/AuthContext';
import { useToggleState } from './useToggleState';

/**
 * Custom hook to manage favorite/unfavorite functionality for events
 * @param {string} eventId - The ID of the event to favorite/unfavorite
 * @returns {Object} Object containing favorite state and control functions
 */
export const useFavorite = (eventId) => {
  const { user, isLoggedIn, updateUser } = UseAuthContext();

  const {
    state: isFavorited,
    toggle: toggleFavorite,
    isLoading: isFavoriteLoading,
    setState: setIsFavorited,
  } = useToggleState(false, async (newState) => {
    // Skip operation if user is not logged in
    if (!isLoggedIn) {
      return { success: false };
    }

    // Update favorites list
    const updatedFollowedEvents = newState
      ? [...(user.followed_events || []), eventId]
      : (user.followed_events || []).filter((id) => id !== eventId);

    // Update user with new favorites list
    await updateUser({
      ...user,
      followed_events: updatedFollowedEvents,
    });

    return { success: true };
  });

  // Initialize favorite state based on user data
  useEffect(() => {
    if (user?.followed_events?.includes(eventId)) {
      setIsFavorited(true);
    }
  }, [user, eventId, setIsFavorited]);

  return {
    isFavorited,
    toggleFavorite,
    isFavoriteLoading,
  };
};
