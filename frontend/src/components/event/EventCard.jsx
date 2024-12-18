import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Card, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Status configuration for different event states
const statusConfig = {
  onsale: { label: 'On Sale', color: '#4CAF50' },
  offsale: { label: 'Sold Out', color: '#FFA726' },
  cancelled: { label: 'Cancelled', color: '#EF5350' },
  rescheduled: { label: 'Rescheduled', color: '#42A5F5' },
};

/**
 * A card component that displays event information in a visually appealing format.
 * Includes event image, status, favorite indicator, and basic event details.
 *
 * @param {Object} props
 * @param {Object} props.event - The event object containing event details
 * @returns {React.ReactElement} A Material-UI Card component
 */
export const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/event?id=${event.id}`);
  };

  return (
    // Card component with hover-lift effect
    <Card
      variant="hover-lift"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        background: 'transparent',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
      onClick={handleCardClick}
    >
      {/* Event Image */}
      <CardMedia
        alt={event.name}
        component="img"
        image={event.image_ratio3_2}
        sx={{
          aspectRatio: '3/2',
          objectFit: 'cover',
          borderRadius: 2,
        }}
      />

      {/* Favorite Icon - Displayed when event is followed */}
      {event.followed && (
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <FavoriteIcon
            sx={{
              color: '#ff4081',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              fontSize: '1.2rem',
            }}
          />
        </Box>
      )}

      {/* Event Status Chip - Shows current event status */}
      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        {event.status && (
          <Chip
            label={statusConfig[event.status].label}
            size="small"
            sx={{
              backgroundColor: 'rgba(0,0,0,0.56)',
              color: statusConfig[event.status].color,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        )}
      </Box>

      {/* Content Container - Contains event details with gradient background */}
      <CardContent
        sx={{
          flexGrow: 1,
          p: 1.5,
          position: 'absolute',
          bottom: -8,
          width: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)',
          borderRadius: '0 0 8px 8px',
          transform: 'translateY(8px)',
        }}
      >
        {/* Event Name */}
        <Typography
          gutterBottom
          noWrap
          component="h3"
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: '0.75rem',
            mb: 0.5,
            lineHeight: 1.2,
            textAlign: 'left',
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {event.name}
        </Typography>

        {/* Date, Time and Location Container */}
        <Stack spacing={0.25}>
          {/* Date and Time Display */}
          <Stack alignItems="flex-start" direction="row" spacing={1}>
            <Typography
              color="white"
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              {new Date(`${event.date}T${event.time}`).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Typography>
          </Stack>

          {/* Venue and Location Display */}
          <Stack alignItems="flex-start" direction="row" spacing={1}>
            <Typography
              noWrap
              color="white"
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                opacity: 0.65,
                lineHeight: 1.2,
              }}
            >
              {`${event.venue ? `${event.venue}, ` : ''}${event.city}, ${event.countryCode}`}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
