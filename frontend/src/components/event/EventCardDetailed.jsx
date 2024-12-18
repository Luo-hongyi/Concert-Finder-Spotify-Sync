import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StadiumIcon from '@mui/icons-material/Stadium';
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../../contexts/AuthContext';
import { useFavorite } from '../../hooks/useFavorite';

// Status configuration for different event states
const statusConfig = {
  onsale: { label: 'On Sale', color: '#4CAF50' },
  offsale: { label: 'Sold Out', color: '#FFA726' },
  cancelled: { label: 'Cancelled', color: '#EF5350' },
  rescheduled: { label: 'Rescheduled', color: '#42A5F5' },
};

/**
 * A detailed event card component that displays comprehensive information about an event
 * including image, artist details, venue information, and status.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.event - Event data object
 * @param {boolean} [props.showFavorite=false] - Whether to show the favorite button
 * @returns {React.ReactElement} A detailed event card component
 */
export const EventCardDetailed = ({ event, showFavorite = false }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = UseAuthContext();
  const { isFavorited, toggleFavorite, isFavoriteLoading } = useFavorite(event.id);

  const handleCardClick = () => {
    navigate(`/event?id=${event.id}`);
  };

  return (
    // Main card container with hover effect
    <Card
      variant="hover-lift"
      sx={{
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.05)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
      }}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '45%',
          height: '45%',
        }}
      >
        {/* Event image */}
        <Box
          alt={event.name}
          component="img"
          src={event.image_ratio3_2}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Favorite button - Only shows when showFavorite is true and user is logged in */}
        {showFavorite && isLoggedIn && (
          <IconButton
            disabled={isFavoriteLoading}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: isFavorited ? '#ff4081' : 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
          >
            <FavoriteIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        )}
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: 2, position: 'relative' }}>
        <Stack spacing={0.25}>
          {/* Artist Name */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {event.artistName}
          </Typography>

          {/* Concert Name */}
          <Typography
            noWrap
            variant="h6"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              lineHeight: 1.2,
            }}
          >
            {event.name}
          </Typography>

          {/* Music Genre */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            Music | {event.genre === 'Undefined' || event.genre === '' ? 'General' : event.genre}
          </Typography>

          {/* Date and Time */}
          <Stack alignItems="center" direction="row" spacing={1}>
            <AccessTimeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography variant="body2">
              {new Date(`${event.date}T${event.time}`).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Typography>
          </Stack>

          {/* Venue Information */}
          <Stack alignItems="center" direction="row" spacing={1}>
            <StadiumIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography noWrap variant="body2">
              {event.venue}
            </Typography>
          </Stack>

          {/* Location Details (City, State, Country) */}
          <Stack alignItems="center" direction="row" spacing={1}>
            <LocationOnIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography noWrap variant="body2">
              {`${event.city} · ${event.state} · ${event.countryCode}`}
            </Typography>
          </Stack>

          {/* Price and Status Section */}
          <Stack alignItems="center" direction="row" justifyContent="space-between">
            {/* Ticket Price Range */}
            <Stack alignItems="center" direction="row" spacing={1}>
              <LocalActivityIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2">{event.priceRanges}</Typography>
            </Stack>

            {/* Event Status Chip */}
            {event.status && (
              <Chip
                label={statusConfig[event.status].label}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  color: statusConfig[event.status].color,
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 3,
                }}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
