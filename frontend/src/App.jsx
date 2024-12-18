import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { UseAuthContext } from './contexts/AuthContext';
import { UseMessage } from './contexts/MessageContext';
import { MainLayout } from './layouts/MainLayout';
import { NoHeaderLayout } from './layouts/NoHeaderLayout';
import EventDetail from './pages/EventDetail';
import { EventList } from './pages/EventList';
import Home from './pages/Home';
import Login from './pages/Login';
import PreSyncSpotify from './pages/PreSyncSpotify';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

// Private route component
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = UseAuthContext();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      // Delay checking login status to avoid immediate redirect
      setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);
    }
  }, [isLoggedIn]);

  if (shouldRedirect) {
    return <Navigate replace to="/" />;
  }

  return children;
};

// EventListWrapper component - Forces EventList unmount/remount when search changes
const EventListWrapper = () => {
  const location = useLocation();
  return <EventList key={location.search} />;
};

const App = () => {
  const { showError, showNotification } = UseMessage();

  // Handle Spotify sync status from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const syncStatus = params.get('sync_spotify');

    if (syncStatus === 'failed') {
      showError('Spotify synchronization failed, please try again.');
    } else if (syncStatus === 'success') {
      showNotification('Spotify synchronization successful!');
    }

    if (syncStatus) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      {/* Routes with MainLayout (includes Header) */}
      <Route element={<MainLayout />}>
        <Route element={<Home />} path="/" />
        <Route element={<EventListWrapper />} path="/events" />
        <Route element={<EventDetail />} path="/event" />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Routes with NoHeaderLayout (no Header, but includes darkTheme) */}
      <Route element={<NoHeaderLayout />}>
        <Route element={<Login />} path="/login" />
        <Route element={<Signup />} path="/signup" />
        <Route element={<PreSyncSpotify />} path="/pre-sync-spotify" />
      </Route>
    </Routes>
  );
};

export default App;
