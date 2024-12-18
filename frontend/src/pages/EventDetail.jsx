import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlightIcon from '@mui/icons-material/Flight';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import { Box, Button, Card, CardContent, CardMedia, Chip, Container, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Marker as LeafletMarker, MapContainer, TileLayer } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import { LoadingEffect } from '../components/common/LoadingEffect';
import { UseAuthContext } from '../contexts/AuthContext';
import { UseMessage } from '../contexts/MessageContext';
import useEvents from '../hooks/useEvents';
import { useFavorite } from '../hooks/useFavorite';
// import { getEventApi } from '../services/apiService';

// Status configuration for event states
const statusConfig = {
  onsale: { label: 'On Sale', color: '#4CAF50' },
  offsale: { label: 'Sold Out', color: '#FFA726' },
  cancelled: { label: 'Cancelled', color: '#EF5350' },
  rescheduled: { label: 'Rescheduled', color: '#42A5F5' },
  postponed: { label: 'Postponed', color: '#ff9800' },
};

/**
 * Component to display when no event is found
 * @returns {JSX.Element} Empty event card with placeholder image
 */
const EmptyEvent = () => (
  <Card sx={{ maxWidth: 'lg', mx: 'auto' }}>
    <CardMedia
      alt="No event"
      component="img"
      image="/hero.jpg"
      sx={{
        width: '100%',
        height: 160,
        objectFit: 'cover',
      }}
    />
    <Typography sx={{ textAlign: 'center', p: 2 }}>No event found</Typography>
  </Card>
);

/**
 * Main component for displaying detailed information about an event
 * @returns {JSX.Element} Event detail page
 */
export const EventDetail = () => {
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = UseMessage();
  const { isLoggedIn } = UseAuthContext();

  const { isFavorited, toggleFavorite, isFavoriteLoading } = useFavorite(event?.id);

  const { events, isLoading } = useEvents('default', 1, { eventId: searchParams.get('id') });

  // Update event state
  useEffect(() => {
    setEvent(events[0]);
    // console.log('event: ', events[0]);
  }, [events]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Handle share functionality - copy event link to clipboard
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showNotification('Event link copied');
    } catch (err) {
      showNotification('Failed to copy event link');
      console.error('Failed to copy:', err);
    }
  };

  // Loading state - show loading effect
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <LoadingEffect size="large" text="" variant="notes" />
      </Box>
    );
  }

  // No event found - show empty event card
  if (events.length === 0) {
    return <EmptyEvent />;
  }

  // Normal display of event information
  const eventDate = event.time ? new Date(`${event.date}T${event.time}`) : new Date(`${event.date}T00:00:00`);
  return (
    <Container maxWidth={false}>
      {/* Hero section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'auto', sm: '30vh' },
          minHeight: { xs: 'auto', sm: '300px' },
          width: '100%',
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden',
          py: { xs: 4, sm: 0 },
        }}
      >
        {/* Blurred background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${event.image_ratio16_9_large})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.1)',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        />

        {/* Hero content container */}
        <Container
          sx={{
            height: '100%',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: { xs: 1, sm: 6 },
          }}
        >
          {/* Event image */}
          <Box
            sx={{
              width: { xs: '280px', sm: '250px', md: '350px' },
              flexShrink: 0,
              position: 'relative',
              aspectRatio: '3/2',
            }}
          >
            <Box
              alt={event.name}
              component="img"
              src={event.image_ratio3_2}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 2,
                objectFit: 'cover',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              }}
            />
          </Box>

          {/* Event information */}
          <Stack spacing={1} sx={{ flex: 1, color: 'white', width: { xs: '100%', sm: 'auto' } }}>
            {/* Event name */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' },
                lineHeight: 1.2,
              }}
            >
              {event.name}
            </Typography>

            {/* Artist name */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '0.9rem', sm: '1.2rem', md: '1.5rem' },
                opacity: 0.9,
              }}
            >
              {event.artistName}
            </Typography>

            {/* Event date and time */}
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontSize: { xs: '0.9rem', sm: '1.25rem' },
              }}
            >
              {event.time
                ? eventDate.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })
                : eventDate.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
            </Typography>

            {/* Event genre */}
            <Typography sx={{ opacity: 0.8 }} variant="body1">
              Music | {event.genre === 'Undefined' || event.genre === '' ? 'General' : event.genre}
            </Typography>

            {/* Ticket price information and status */}
            <Stack alignItems="center" direction="row" spacing={1}>
              <LocalActivityIcon
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                }}
              />
              <Typography sx={{ opacity: 0.8 }} variant="body1">
                {event.priceRanges}
              </Typography>
              {event.status && (
                <Chip
                  label={statusConfig[event.status].label}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: statusConfig[event.status].color,
                    height: 24,
                  }}
                />
              )}
            </Stack>

            {/* Empty spacing element */}
            <Box sx={{ height: 12 }} />

            {/* Action buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{
                mt: 4,
                width: { xs: '100%', sm: 'auto' },
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              {/* Buy tickets button */}
              {event.url && (
                <Button
                  href={event.url}
                  rel="noopener noreferrer"
                  size="small"
                  startIcon={<LaunchIcon />}
                  target="_blank"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Buy Tickets
                </Button>
              )}

              {/* Share button */}
              <Button
                size="small"
                startIcon={<ShareIcon />}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
                onClick={handleShare}
              >
                Share
              </Button>

              {/* Favorite button - toggle favorite state */}
              {isLoggedIn && (
                <Button
                  disabled={isFavoriteLoading}
                  size="small"
                  variant="outlined"
                  startIcon={
                    <FavoriteIcon
                      sx={{
                        color: isFavorited ? '#ff4081' : 'inherit',
                      }}
                    />
                  }
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: isFavorited ? '#ff4081' : 'white',
                    '&:hover': {
                      borderColor: isFavorited ? '#ff4081' : 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    ...(isFavorited && {
                      borderColor: '#ff4081',
                    }),
                  }}
                  onClick={toggleFavorite}
                >
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Venue information section */}
      {event.location?.latitude !== 0 && event.location?.longitude !== 0 && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {/* Basic information card */}
          <Card sx={{ p: 2, height: { xs: 'auto', sm: 480 }, position: 'relative', overflow: 'hidden' }}>
            {/* Background image with blur effect */}
            {event.venueBackgroundImage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${event.venueBackgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(3px)',
                  zIndex: 0,
                  opacity: 0.9,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              />
            )}

            {/* Venue content area */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                height: '100%',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* OpenStreetMap */}
              {event.location?.latitude && event.location?.longitude && (
                <Box
                  sx={{
                    width: { xs: '100%', sm: '50%' },
                    height: { xs: '300px', sm: '100%' },
                    mr: { sm: 2 },
                  }}
                >
                  <MapContainer
                    center={[Number(event.location.latitude), Number(event.location.longitude)]}
                    style={{ height: '100%', width: '100%', borderRadius: '4px' }}
                    zoom={14}
                  >
                    <TileLayer attributionControl={false} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LeafletMarker position={[Number(event.location.latitude), Number(event.location.longitude)]} />
                    <style> {`.leaflet-control-container .leaflet-bottom.leaflet-right { display: none; }`} </style>
                  </MapContainer>
                </Box>
              )}

              {/* Venue address information */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  py: { xs: 2, sm: 0 },
                }}
              >
                <Stack spacing={2} sx={{ width: '100%' }}>
                  {/* Venue name and link */}
                  {event.venueUrl ? (
                    <Link
                      href={event.venueUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: { xs: '1.1rem', sm: '1.3rem' },
                          background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        {event.venue}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '1.1rem', sm: '1.3rem' },
                        background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {event.venue}
                    </Typography>
                  )}

                  {/* Venue image */}
                  {event.venueImage && (
                    <Box
                      alt={event.venue}
                      component="img"
                      src={event.venueImage}
                      sx={{
                        width: { xs: '100%', sm: '150px' },
                        objectFit: 'contain',
                        borderRadius: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    />
                  )}

                  {/* Address information */}
                  <Stack spacing={0.5}>
                    {/* Address, city, state */}
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <LocationOnIcon
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        }}
                      />
                      <Typography sx={{ fontSize: '1rem' }} variant="body1">
                        {event.address}
                      </Typography>
                    </Stack>

                    <Typography sx={{ pl: { xs: '28px', sm: '32px' }, fontSize: '1rem' }} variant="body1">
                      {`${event.city}${event.state ? `, ${event.state}` : ''}`}
                    </Typography>

                    <Typography sx={{ pl: { xs: '28px', sm: '32px' }, fontSize: '1rem' }} variant="body1">
                      {event.country}
                    </Typography>

                    {/* Distance */}
                    {event.distance && (
                      <Stack alignItems="center" direction="row" spacing={1}>
                        {(() => {
                          const iconProps = {
                            sx: {
                              color: 'text.secondary',
                              fontSize: { xs: '1.2rem', sm: '1.5rem' },
                            },
                          };

                          // Display different icons based on distance
                          if (event.distance <= 2) return <DirectionsWalkIcon {...iconProps} />;
                          if (event.distance <= 5) return <DirectionsBikeIcon {...iconProps} />;
                          if (event.distance <= 500) return <DirectionsCarIcon {...iconProps} />;
                          return <FlightIcon {...iconProps} />;
                        })()}

                        {/* Distance in kilometers */}
                        <Typography sx={{ fontSize: '1rem' }} variant="body1">
                          {Math.round(event.distance) === 0 ? 'Nearby' : `${Math.round(event.distance)} km`}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Card>
        </Stack>
      )}

      {/* Information card */}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: 'text.primary',
              }}
            >
              Informations
            </Typography>

            {/* Event information paragraphs */}
            <Stack spacing={1}>
              {event.info?.length > 0 ? (
                event.info.map((paragraphs, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Stack key={index} spacing={1}>
                    {paragraphs.map((paragraph, i) => (
                      <Typography
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          whiteSpace: 'pre-wrap',
                          p: 2,
                          borderRadius: 1,
                          background: 'rgba(0, 0, 0, 0.1)',
                          fontSize: '0.95rem',
                          lineHeight: 1.5,
                          letterSpacing: '0.3px',
                        }}
                      >
                        {paragraph}
                      </Typography>
                    ))}
                  </Stack>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    p: 2,
                    borderRadius: 1,
                    background: 'rgba(0, 0, 0, 0.1)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    letterSpacing: '0.3px',
                  }}
                >
                  No additional information is available for this event.
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EventDetail;
