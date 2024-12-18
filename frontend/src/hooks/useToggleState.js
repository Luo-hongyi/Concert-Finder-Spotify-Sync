import { useState } from 'react';

/**
 * A custom React hook for managing toggle state with loading status check
 * @param {boolean} initialState - Initial state of the toggle
 * @param {Function} onToggle - Callback function to handle toggle changes
 * @returns {Object} Object containing state, toggle function, loading status and setState
 */
export const useToggleState = (initialState = false, onToggle) => {
  // Initialize toggle state and loading status
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = async () => {
    // Prevent multiple calls while loading
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Call the provided toggle handler and update state based on response
      const result = await onToggle(!state);
      if (result.success) {
        setState(result.enabled);
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    } finally {
      // Reset loading state regardless of success/failure
      setIsLoading(false);
    }
  };

  // Return hook interface
  return {
    state,
    toggle,
    isLoading,
    setState,
  };
};
