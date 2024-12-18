import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../../contexts/AuthContext';
import { UseMessage } from '../../contexts/MessageContext';
import { useToggleState } from '../../hooks/useToggleState';

/**
 * Header component that provides the main navigation bar for the application.
 * Features include:
 * - Brand logo and name
 * - Search functionality for artists
 * - Notification toggle for logged-in users
 * - User profile access
 * - Authentication controls
 *
 * @component
 * @returns {JSX.Element} The rendered Header component
 */
export const Header = () => {
  const theme = useTheme(); // Theme hook
  const navigate = useNavigate(); // Navigation hook
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if viewport is mobile

  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const { user, isLoggedIn } = UseAuthContext(); // User authentication state
  const { showNotification } = UseMessage(); // Notification context

  // Toggle notifications state using custom hook
  const {
    state: isNotificationsEnabled,
    toggle: toggleNotifications,
    isLoading: isNotificationLoading,
  } = useToggleState(false, async (newState) => {
    // Should call actual notification toggle API, not implemented yet
    // Temporary API call simulation
    const result = { success: true, enabled: newState };

    if (result.success) {
      if (newState) {
        showNotification('Successfully subscribed to email notifications for upcoming concerts');
      } else {
        showNotification('Email notifications have been unsubscribed');
      }
    }

    return result;
  });

  // Navigate to search results page with artist name
  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/events?type=search&keyword=${searchTerm}`);
      setSearchTerm('');
    }
  };

  // Navigate to home page when logo is clicked
  const handleLogoClick = () => {
    navigate('/');
  };

  // Navigate to profile page when avatar is clicked
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Navigate to login page
  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
      {/* Main container - Horizontal layout with padding */}
      <Stack alignItems="center" direction="row" sx={{ width: '100%', px: 2, position: 'relative' }}>
        {/* Logo Section - Brand identity and home navigation */}
        <Stack
          alignItems="center"
          direction="row"
          spacing={0}
          sx={{
            cursor: 'pointer',
            minWidth: 'fit-content',
          }}
          onClick={handleLogoClick}
        >
          {/* Logo Icon */}
          <AudiotrackIcon
            sx={{
              color: theme.palette.primary.main,
            }}
          />
          {/* Brand Text - Hidden on mobile */}
          {!isMobile && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                // fontStyle: 'italic',
                whiteSpace: 'nowrap',
                color: theme.palette.primary.main,
              }}
            >
              Concert Finder
            </Typography>
          )}
        </Stack>

        {/* Search Section - Centered with responsive width */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            px: 2,
            maxWidth: '600px',
            minWidth: '200px',
            margin: '0 auto',
          }}
        >
          {/* Search Input Field with Icon Button */}
          <TextField
            fullWidth
            placeholder="Search artist..."
            size="small"
            value={searchTerm}
            slotProps={{
              input: {
                // Search icon and button positioned at the end of input
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSearch}>
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </Box>

        {/* Actions Section - Right-aligned user interactions */}
        <Stack alignItems="center" direction="row" spacing={1} sx={{ minWidth: 'fit-content' }}>
          {isLoggedIn ? (
            <>
              {/* Notification Toggle Button */}
              <IconButton
                className={isNotificationsEnabled ? 'Mui-active' : ''}
                disabled={isNotificationLoading}
                onClick={toggleNotifications}
              >
                <NotificationsIcon fontSize="small" />
              </IconButton>
              {/* User Avatar with Name Tooltip */}
              <Tooltip arrow title={user.name}>
                <IconButton onClick={handleProfileClick}>
                  <Avatar>
                    <Typography fontSize="body2">{user.name[0]}</Typography>
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          ) : (
            // Sign In Button for Non-authenticated Users
            <Button disableElevation color="grey" startIcon={<LoginIcon />} variant="contained" onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </Stack>
      </Stack>
    </AppBar>
  );
};
