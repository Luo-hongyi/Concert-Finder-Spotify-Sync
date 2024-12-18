import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * A card component that displays an artist's avatar and name.
 * Clicking the card navigates to the artist's event list page.
 *
 * @param {Object} props - Component props
 * @param {Object} props.artist - The artist data object
 * @returns {JSX.Element} The rendered artist card
 */
export const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  // Click card to navigate to artist detail page
  const handleCardClick = () => {
    // Exclude sync button
    if (!artist.sync_button) {
      // Navigate to artist concert list page with artist info
      navigate(`/events?type=artist&artistId=${artist.ticketmaster_id}`, {
        state: {
          artist,
        },
      });
    }
  };

  return (
    // Outer container of the card
    <Box
      className="hover-card"
      sx={{
        display: 'flex', // Add this: use flex layout
        flexDirection: 'column', // Add this: vertical arrangement
        alignItems: 'center', // Add this: horizontally center aligned
      }}
      onClick={handleCardClick}
    >
      {/* Artist avatar container */}
      <Box
        sx={{
          width: { xs: '120px', sm: '150px' },
          height: { xs: '120px', sm: '150px' },
          position: 'relative',
          mb: 0.75,
        }}
      >
        {/* Artist avatar */}
        <Box
          alt={artist.name}
          component="img"
          src={artist.image}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            minWidth: '120px',
            minHeight: '120px',
            maxWidth: '200px',
            maxHeight: '200px',
          }}
        />

        {/* Number of upcoming events: Not used because it's not stable */}
        {/* {artist.upcoming_events > 0 && (
          <Tooltip arrow placement="top" title={`Upcoming ${artist.upcoming_events} events`}>
            <Box
              sx={{
                position: 'absolute',
                bottom: '4%',
                right: '4%',
                bgcolor: 'primary.main',
                color: 'black',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
              }}
            >
              {artist.upcoming_events}
            </Box>
          </Tooltip>
        )} */}
      </Box>

      {/* Artist name */}
      <Typography
        noWrap
        component="h3"
        sx={{
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 1.2,
          textAlign: 'center',
          px: 1,
          color: '#ffffff',
          letterSpacing: '0.5px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {artist.name}
      </Typography>
    </Box>
  );
};
