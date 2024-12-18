import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useSpotifySync } from '../hooks/useSpotifySync';

/**
 * PreSyncSpotify component displays a page for initiating Spotify artist synchronization
 * with information about test account limitations
 * @returns {JSX.Element} PreSyncSpotify component
 */
const PreSyncSpotify = () => {
  const { syncSpotify } = useSpotifySync();

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InfoIcon
            sx={{
              fontSize: 40,
              color: 'text.secondary',
              opacity: 0.9,
              mr: 2,
            }}
          />
          <Typography gutterBottom sx={{ fontWeight: 'bold', mb: 0 }} variant="h5">
            Sync Spotify Following Artists
          </Typography>
        </Box>

        <Typography sx={{ mb: 2 }} variant="body1">
          Due to Spotify developer account limitations, synchronization is currently only available for specific test
          accounts.
        </Typography>

        <Typography sx={{ mb: 2 }} variant="body1">
          Please use Spotify account{' '}
          <Box component="span" sx={{ fontWeight: 'bold', display: 'inline-block' }}>
            concert_finder@163.com
          </Box>{' '}
          and password "concertfinder409" for synchronization test.
        </Typography>

        <Button fullWidth size="large" sx={{ mt: 2 }} variant="contained" onClick={syncSpotify}>
          Start Sync
        </Button>
      </Paper>
    </Container>
  );
};

export default PreSyncSpotify;
