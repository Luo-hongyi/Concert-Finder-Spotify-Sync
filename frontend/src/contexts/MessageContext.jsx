import { createContext, useContext, useState } from 'react';
import { CustomAlert as Alert } from '../components/common/CustomAlert';

const MessageContext = createContext();

/**
 * Context provider component for handling application messages and notifications
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} NotificationProvider component
 */
export const NotificationProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  /**
   * Display an error message with auto-dismiss
   * @param {string} message
   */
  const showError = (message) => {
    setError(message);
    // Auto clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  /**
   * Display a notification message with auto-dismiss
   * @param {string} message
   */
  const showNotification = (message) => {
    setNotification(message);
    // Auto clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  /**
   * Clear current error message
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Clear current notification message
   */
  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <MessageContext.Provider
      value={{
        error,
        notification,
        showError,
        showNotification,
        clearError,
        clearNotification,
      }}
    >
      <Alert message={error} severity="error" onClose={clearError} />
      <Alert message={notification} severity="success" onClose={clearNotification} />
      {children}
    </MessageContext.Provider>
  );
};

/**
 * Custom hook for accessing message context
 * @returns {Object} Message context value
 * @throws {Error} If used outside of NotificationProvider
 */
export const UseMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
