import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Container, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../contexts/AuthContext';
import loginBg from '/login.jpg';

/**
 * Login component for user authentication
 * Provides a form interface for users to sign in with email and password
 * @returns {JSX.Element} Login page component
 */
const Login = () => {
  // Navigation hook for redirecting after login
  const navigate = useNavigate();
  const { login } = UseAuthContext();

  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles email input changes
   * @param {React.ChangeEvent} e - Change event
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  /**
   * Handles password input changes
   * @param {React.ChangeEvent} e - Change event
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  /**
   * Handles form submission and authentication
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      // Login failed
      if (response.error) {
        setError('Login failed, check email and password and try again.');
        setIsLoading(false);
        return;
      }
      // Login successful, redirect to home page after 0.5s delay, ensure the login state is updated
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed, refresh page and try again.');
      setIsLoading(false);
    }
  };

  return (
    // Main container with full viewport height
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      {/* Login card container */}
      <Paper sx={{ width: '100%', display: 'flex', minHeight: '600px', borderRadius: 2 }}>
        {/* Left section - Background image and welcome text */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: { xs: 'none', md: 'block' },
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay container for welcome text */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Welcome heading and description */}
            <Typography component="h1" sx={{ mb: 2 }} variant="h3">
              Welcome Back
            </Typography>
            <Typography variant="body1">Discover your favorite concert, follow your favorite artists.</Typography>
          </Box>
        </Box>

        {/* Right section - Login form */}
        <Box sx={{ flex: 2, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Form container with max width */}
          <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
            {/* Login form header and signup link */}
            <Typography gutterBottom component="h1" variant="h4">
              Sign In
            </Typography>
            <Typography sx={{ mb: 3 }} variant="body1">
              New to Concert-Finder?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Sign Up
              </Link>
            </Typography>

            {/* Login form with email and password inputs */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                // required
                disabled={isLoading}
                label="Email"
                margin="normal"
                // type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <TextField
                fullWidth
                // required
                disabled={isLoading}
                label="Password"
                margin="normal"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />

              {/* Error message display area */}
              <Box sx={{ height: 76, mt: 2 }}>{error && <Alert severity="error">{error}</Alert>}</Box>

              {/* Submit button with loading state */}
              <LoadingButton
                fullWidth
                loading={isLoading}
                loadingIndicator={<Box sx={{ display: 'flex', alignItems: 'center' }}>Signing in...</Box>}
                size="large"
                sx={{ mt: 1 }}
                type="submit"
                variant="contained"
              >
                Sign In
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
