import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../../contexts/AuthContext';

/**
 * Hero component for the homepage
 * Displays a banner with background image, text content and CTA button
 * Adjusts layout based on user authentication status
 * @returns {JSX.Element} Hero section component
 */
export const Hero = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn } = UseAuthContext();

  return (
    // Hero section container
    <Box
      sx={{
        position: 'relative',
        height: isLoggedIn ? '20vh' : '25vh',
        minHeight: isLoggedIn ? '300px' : '400px',
        width: '100%',
        mb: 3,
        backgroundImage: 'url(/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Gradient overlay for better text visibility */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Content container with text and call-to-action button */}
      <Container
        maxWidth="md"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Main headline text */}
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3rem' },
            fontWeight: 700,
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mb: 2,
            letterSpacing: '-1px',
            lineHeight: 1.2,
          }}
        >
          Discover Your Next Concert Experience
        </Typography>

        {/* Subheading text */}
        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'rgba(255,255,255,0.9)',
            mb: isLoggedIn ? 0 : 4,
            maxWidth: '600px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Connect with Spotify to follow your favorite artists and never miss their shows near you
        </Typography>

        {/* Call-to-action button - only shown to non-logged-in users */}
        {!isLoggedIn && (
          <Button
            size="large"
            variant="contained"
            sx={{
              width: 'fit-content',
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
              color: 'black',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            onClick={() => navigate('/signup')}
          >
            Start Now
          </Button>
        )}
      </Container>
    </Box>
  );
};
