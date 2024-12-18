import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { UseAuthContext } from '../contexts/AuthContext';
import { UseMessage } from '../contexts/MessageContext';

/**
 * Profile component for user settings and management
 * @returns {JSX.Element} Profile page component
 */
const Profile = () => {
  const { user, fetchUser, updateUser, logout } = UseAuthContext();
  const { showError, showNotification } = UseMessage();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    verifyPassword: '',
    zip_code: '',
    range: 100,
  });

  // Fetch user data on page load
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize form fields with user data whenever user object updates
  // Maintains existing form state while updating only user-specific fields
  // prev represents the previous form state, preserving password fields while updating user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        zip_code: user.zip_code || '',
        range: user.range || 100,
      }));
    }
  }, [user]);

  /**
   * Handle input field changes
   * @param {React.ChangeEvent} e - Change event from input field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, // Spread operator to maintain existing form state
      [name]: value,
    }));
  };

  /**
   * Handle form submission for profile updates
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Validate password
      if (formData.password && formData.password !== formData.verifyPassword) {
        showError('Passwords do not match');
        return;
      }

      // Validate distance
      const range = Number(formData.range);
      if (isNaN(range) || range < 0) {
        showError('Please enter a valid positive number for distance');
        return;
      }

      // Save user profile
      await updateUser(formData);
      showNotification('Profile updated successfully');
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
  };

  return (
    <Container maxWidth="md">
      {/* Profile Card */}
      <Paper
        sx={{
          mt: 8,
          borderRadius: 2,
        }}
      >
        {/* Header Banner with Background Image */}
        <Box
          sx={{
            height: '120px',
            backgroundImage: 'url(/profile_bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            px: 4,
          }}
        >
          {/* Page Title */}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Profile Settings
          </Typography>
        </Box>

        {/* Form Content Area */}
        <Box sx={{ px: 4, pb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Read-only Email Field */}
              <TextField disabled fullWidth label="Email" value={user?.email || ''} variant="outlined" />

              {/* Name Input Field */}
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                variant="outlined"
                onChange={handleChange}
              />

              {/* Password Input Field */}
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                variant="outlined"
                onChange={handleChange}
              />

              {/* Password Verification Field */}
              <TextField
                fullWidth
                label="Verify Password"
                name="verifyPassword"
                type="password"
                value={formData.verifyPassword}
                variant="outlined"
                onChange={handleChange}
              />

              {/* Zip Code and Distance Range Row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Zip/Postal Code Input */}
                <TextField
                  fullWidth
                  label="Zip/Postal Code"
                  name="zip_code"
                  value={formData.zip_code}
                  variant="outlined"
                  onChange={handleChange}
                />

                {/* Distance Range Input */}
                <TextField
                  fullWidth
                  label="Favorite Distance (km)"
                  name="range"
                  type="text"
                  value={formData.range}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Box>

              {/* Update Profile Button Container */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button disabled={isLoading} sx={{ minWidth: 150 }} type="submit" variant="contained">
                  Update Profile
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Paper>

      {/* Logout Card */}
      <Paper sx={{ p: 4, mt: 3, borderRadius: 2 }}>
        {/* Logout Button Container */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            color="error"
            disabled={isLoading}
            variant="outlined"
            sx={{
              minWidth: 150,
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.04)',
                borderColor: 'error.main',
                color: 'error.main',
              },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
