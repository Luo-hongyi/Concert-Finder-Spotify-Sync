import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Container, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../contexts/AuthContext';
import loginBg from '/login.jpg';

/**
 * Signup component for user registration
 * @returns {JSX.Element} Signup form component
 */
const Signup = () => {
  const navigate = useNavigate();
  const { signup } = UseAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verifyPassword: '',
    name: '',
    zip_code: '61820',
    range: '250',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   */
  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  /**
   * Handles form submission
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.email || !formData.password || !formData.verifyPassword || !formData.name) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password match
    if (formData.password !== formData.verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
      navigate('/pre-sync-spotify');
    } catch (err) {
      setError('Registration failed. Email already exists.');
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ width: '100%', display: 'flex', minHeight: '600px', borderRadius: 2 }}>
        {/* Left side - Background image section */}
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
          {/* Overlay box with welcome text */}
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
            {/* Welcome text content */}
            <Typography component="h1" sx={{ mb: 2 }} variant="h3">
              Welcome
            </Typography>
            <Typography variant="body1">Discover your favorite concert, follow your favorite artists.</Typography>
          </Box>
        </Box>

        {/* Right side - Registration form section */}
        <Box sx={{ flex: 2, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Form container */}
          <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
            {/* Form header section */}
            <Typography gutterBottom component="h1" variant="h4">
              Sign Up
            </Typography>

            {/* Sign in link section */}
            <Typography sx={{ mb: 3 }} variant="body1">
              Create a Concert-Finder Account. Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Sign In
              </Link>
            </Typography>

            {/* Registration form */}
            <form onSubmit={handleSubmit}>
              {/* Required fields section */}
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label="Email"
                margin="normal"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label="Password"
                margin="normal"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label="Verify Password"
                margin="normal"
                name="verifyPassword"
                type="password"
                value={formData.verifyPassword}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label="Account Name"
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              {/* Optional fields section */}
              <TextField
                fullWidth
                disabled={isLoading}
                label="Zip/Postal Code"
                margin="normal"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                disabled={isLoading}
                label="Favorite Distance (km)"
                margin="normal"
                name="range"
                type="text"
                value={formData.range}
                onChange={handleChange}
              />

              {/* Error message display area */}
              <Box sx={{ height: 76, mt: 2 }}>{error && <Alert severity="error">{error}</Alert>}</Box>

              {/* Submit button */}
              <LoadingButton
                fullWidth
                loading={isLoading}
                loadingIndicator={<Box sx={{ display: 'flex', alignItems: 'center' }}>Creating account...</Box>}
                size="large"
                sx={{ mt: 1 }}
                type="submit"
                variant="contained"
              >
                Sign Up
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
