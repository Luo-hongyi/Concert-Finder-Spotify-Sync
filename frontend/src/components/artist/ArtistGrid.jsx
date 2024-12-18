import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArtistCard } from './ArtistCard';

/**
 * Renders a responsive grid of artist cards, including a Spotify sync button
 * @param {Object} props
 * @param {Array} props.artists - Array of artist objects to display
 * @returns {JSX.Element} A grid layout of artist cards
 */
export const ArtistGrid = ({ artists }) => {
  const navigate = useNavigate();

  return (
    // Main container - Responsive grid layout for artist cards
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        p: 3,
        mb: 0,
        mx: 0,
        background: (theme) =>
          `linear-gradient(${theme.palette.background.paper} 60%, ${theme.palette.background.default} 100%)`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(6, 1fr)',
          xl: 'repeat(10, 1fr)',
        },
        gap: { xs: 2, sm: 3 },
        width: '100%',
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      {/* Display artist cards for each artist in the array */}
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}

      {/* Spotify Sync Button */}
      {/* Navigates to pre-sync confirmation page when clicked */}
      <Box onClick={() => navigate('/pre-sync-spotify')}>
        <ArtistCard
          artist={{
            id: 'sync-spotify',
            name: 'Sync with Spotify',
            image: '/sync-spotify.jpg',
            sync_button: true,
          }}
        />
      </Box>
    </Box>
  );
};
