import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/MessageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode: Helps identify potential issues in the application: Remove in production
  // <React.StrictMode>
  <BrowserRouter>
    {/* NotificationProvider: Provides notification functionality */}
    <NotificationProvider>
      {/* AuthProvider: Provides authentication context */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </NotificationProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
