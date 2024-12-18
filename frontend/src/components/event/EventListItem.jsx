import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import StadiumOutlinedIcon from '@mui/icons-material/StadiumOutlined';
import { Box, Chip, IconButton, ListItem, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../../contexts/AuthContext';
import { useFavorite } from '../../hooks/useFavorite';

/**
 * Renders a single event item in the event list
 * @param {Object} props.event - The event object containing event details
 * @returns {JSX.Element} A list item component displaying event information
 */
export const EventListItem = ({ event }) => {
  const navigate = useNavigate();
  const eventDate = event.time ? new Date(`${event.date}T${event.time}`) : new Date(`${event.date}T00:00:00`);
  const { isLoggedIn } = UseAuthContext();
  const { isFavorited, toggleFavorite, isFavoriteLoading } = useFavorite(event.id);

  // Status configuration for different event states
  const statusConfig = {
    onsale: { label: 'On Sale', color: '#4CAF50' },
    offsale: { label: 'Sold Out', color: '#FFA726' },
    cancelled: { label: 'Cancelled', color: '#EF5350' },
    rescheduled: { label: 'Rescheduled', color: '#42A5F5' },
    postponed: { label: 'Postponed', color: '#ff9800' },
  };

  return (
    // List item component for displaying event information
    <ListItem
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 2,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: 120,
        transition: 'background-color 0.2s', // Add transition effect
        '&:hover': {
          backgroundColor: 'action.hover', // MUI default hover background color
          cursor: 'pointer',
        },
      }}
      onClick={() => navigate(`/event?id=${event.id}`)} // Make entire row clickable
    >
      {/* Event thumbnail image container */}
      <Box
        sx={{
          width: 180,
          borderRadius: 1,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Box
          alt={event.name}
          component="img"
          src={event.image_ratio3_2}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Date and time section */}
      <Box
        sx={{
          width: 80,
          textAlign: 'center',
          borderRight: '1px solid',
          borderColor: 'divider',
          pr: 2,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            // color: 'text.secondary',
          }}
        >
          {eventDate.toLocaleString('en-US', { month: 'short' })}
        </Typography>
        <Typography
          sx={{
            fontSize: '1.5rem',
          }}
        >
          {eventDate.getDate()}
        </Typography>
        {event.time && (
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            {eventDate.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Typography>
        )}
      </Box>

      {/* Main event information section */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack spacing={0.25}>
          {/* Artist name */}
          <Typography sx={{ color: 'text.secondary' }} variant="body2">
            {event.artistName}
          </Typography>

          {/* Event name */}
          <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1">
            {event.name}
          </Typography>

          {/* Music genre */}
          <Typography sx={{ color: 'text.secondary' }} variant="body2">
            Music | {event.genre === 'Undefined' || event.genre === '' ? 'General' : event.genre}
          </Typography>

          {/* Venue and location information */}
          {event.venue && (
            <Stack alignItems="center" direction="row" spacing={1}>
              <StadiumOutlinedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography noWrap variant="body2">
                {/* Format location string: Venue - City · State · Country (Distance) */}
                {`${event.venue} - ${event.city}${event.state ? ` · ${event.state}` : ''} · ${event.countryCode}${
                  event.distance ? ` (${Math.round(Number(event.distance)) || 0}km)` : ''
                }`}
              </Typography>
            </Stack>
          )}

          {/* Ticket price information */}
          <Stack alignItems="center" direction="row" spacing={1}>
            <LocalActivityOutlinedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography noWrap variant="body2">
              {event.priceRanges}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Right side controls section */}
      <Stack alignItems="center" direction="row" spacing={1}>
        {/* Event status chip */}
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

        {/* Favorite button - only shown when user is logged in */}
        {isLoggedIn && (
          <IconButton
            disabled={isFavoriteLoading}
            size="small"
            sx={{
              color: isFavorited ? '#ff4081' : 'text.secondary',
              '&:hover': {
                color: isFavorited ? '#ff4081' : 'text.primary',
              },
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling to avoid triggering list item click
              toggleFavorite();
            }}
          >
            <FavoriteIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        )}

        {/* Navigation arrow */}
        <IconButton sx={{ color: 'text.secondary' }}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </ListItem>
  );
};
