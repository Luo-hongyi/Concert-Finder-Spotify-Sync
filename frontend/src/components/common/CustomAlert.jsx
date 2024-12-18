import { Alert, Snackbar } from '@mui/material';

/**
 * CustomAlert Component - A reusable alert notification component
 * @param {string|object} message - The message to display in the alert
 * @param {string} severity - The severity level of the alert ('success', 'error', 'warning', 'info')
 * @param {function} onClose - Callback function to handle alert closure
 */
export const CustomAlert = ({ message, severity = 'success', onClose }) => {
  if (!message) return null;

  return (
    // Snackbar - Container that handles the positioning and auto-hiding of the alert
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={5000}
      open={Boolean(message)}
      sx={{ marginTop: '64px' }}
      onClose={onClose}
    >
      {/* Alert - The actual notification component that displays the message */}
      <Alert severity={severity} sx={{ width: '100%' }} variant="filled" onClose={onClose}>
        {/* Handle both string messages and message objects */}
        {typeof message === 'string' ? message : message.message || (severity === 'error' ? 'Error' : '')}
      </Alert>
    </Snackbar>
  );
};
