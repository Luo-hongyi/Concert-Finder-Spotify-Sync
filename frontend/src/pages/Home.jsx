import { Box, Button, Container, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArtistGrid } from '../components/artist/ArtistGrid';
import { LoadingEffect } from '../components/common/LoadingEffect';
import { EventCardDetailed } from '../components/event/EventCardDetailed';
import { EventGrid } from '../components/event/EventGrid';
import { Hero } from '../components/home/Hero';
import { UseAuthContext } from '../contexts/AuthContext';
import useEvents from '../hooks/useEvents';
import { useSpotifyFollowedArtists } from '../hooks/useSpotifyFollowedArtists';

// Event number for each section
const HOME_FEEDS_SIZE = 12;
const HOME_FAVORITES_SIZE = 200;
const HOME_RECOMMENDED_SIZE = 8;

/**
 * Empty state component for sections with no content
 * @param {Object} props
 * @param {string} props.message
 * @returns {JSX.Element} Empty state component
 */
const EmptyState = ({ message }) => (
  <Box sx={{ py: 3, px: 2 }}>
    <Typography color="text.secondary" sx={{ fontWeight: 500, opacity: 0.8 }} variant="body1">
      {message}
    </Typography>
  </Box>
);

/**
 * Home page component that displays various sections of events and artists
 * @returns {JSX.Element} Home page component
 */
const Home = () => {
  const navigate = useNavigate();

  // Get authentication state from AuthContext
  const { isLoggedIn } = UseAuthContext();

  // Fetch followed artists from Spotify API with loading state and refetch capability
  const {
    artists, // Array of followed artists
    isLoading: isLoadingArtists, // Loading state indicator
    refetch: refetchArtists, // Function to manually trigger a refetch
  } = useSpotifyFollowedArtists();

  // ** Fetch different types of events using custom hooks ** //
  // Get event feeds with pagination
  const {
    events: eventFeeds, // Array of event feed items
    isLoading: isLoadingEventFeeds, // Loading state for event feeds
  } = useEvents('feeds', HOME_FEEDS_SIZE);

  // Get user's followed/favorite events
  const {
    events: followedEvents, // Array of events user has followed
    isLoading: isLoadingFollowed, // Loading state for followed events
  } = useEvents('favorites', HOME_FAVORITES_SIZE);

  // Get personalized event recommendations
  const {
    events: recommendedEvents, // Array of recommended events
    isLoading: isLoadingRecommended, // Loading state for recommendations
    refetch: refetchRecommended, // Function to refresh recommendations
  } = useEvents('recommended', HOME_RECOMMENDED_SIZE);

  // Fetch artists data when user logs in or logs out
  useEffect(() => {
    if (isLoggedIn) {
      refetchArtists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  /**
   * Renders a section with consistent styling and loading states
   * @param {string} title - Section title
   * @param {boolean} isLoading - Loading state
   * @param {JSX.Element} Skeleton - Loading skeleton component
   * @param {JSX.Element} children - Content to render
   * @param {boolean} showMore - Whether to show "more" button
   * @param {Function} onMore - Callback for "more" button
   * @param {string} moreText - Text for "more" button
   * @param {string} emptyText - Text for empty state
   * @param {number} dataLength - Length of data array
   * @returns {JSX.Element} Section component
   */
  const section = (
    title, // section title
    isLoading, // loading state
    Skeleton, // skeleton component
    children, // children component
    showMore = false, // show more button
    onMore = undefined, // more button click event
    moreText = 'More...', // more button text
    emptyText = 'No content available', // empty state text
    dataLength = -1 // data length
  ) => (
    // Container for each section
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        p: 3,
        mb: 3,
        mx: 0,
      }}
    >
      {/* Header with title and more button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {/* section title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '1.7rem',
            letterSpacing: '-0.5px',
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '140%',
              height: 2,
              background: 'linear-gradient(90deg, #4CAF50, transparent)',
              borderRadius: 2,
            },
          }}
        >
          {title}
        </Typography>

        {/* MORE button */}
        {showMore && (
          <Button
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              textDecoration: 'underline',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
            }}
            onClick={onMore}
          >
            {moreText}
          </Button>
        )}
      </Box>
      {/* section content: event cards */}
      {isLoading && Skeleton}
      {!isLoading && dataLength === 0 && <EmptyState message={emptyText} />}
      {!isLoading && dataLength !== 0 && children}
    </Box>
  );

  return (
    // main container
    <Container maxWidth={false}>
      {/* {!isLoggedIn && <Hero />} */}
      <Hero />

      {/* favorite artists section */}
      {isLoggedIn &&
        section(
          'Favorite Artists', // section title
          isLoadingArtists, // loading state
          // <CircularLoadingSkeleton size={140} />, // skeleton component
          <LoadingEffect size="large" text="" variant="wave" />, // loading animation component
          <ArtistGrid artists={artists} />, // children component
          false, // no MORE button
          undefined,
          'No more',
          'Your favorite artists will appear here', // empty state text
          artists?.length || 1 // minimum has 1 button(sync spotify button)
        )}

      {section(
        'Event Feeds', // section title
        isLoadingEventFeeds, // loading state
        // <LoadingCardSkeleton height="60px" width="200px" />, // skeleton component
        <LoadingEffect size="large" text="" variant="wave" />, // loading animation component
        <EventGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }} events={eventFeeds} />, // children component
        true, // show MORE button
        () => navigate('/events?type=feeds'), // more button click event
        'More', // MORE button text
        'Follow artists to see their events here', // empty state text
        eventFeeds?.length || 0
      )}

      {isLoggedIn &&
        section(
          'Favorite Events', // section title
          isLoadingFollowed, // loading state
          // <LoadingCardSkeleton height="60px" width="200px" />, // skeleton component
          <LoadingEffect size="large" text="" variant="wave" />, // loading animation component
          <EventGrid
            CardComponent={EventCardDetailed}
            columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
            events={followedEvents}
          />,
          true, // show MORE button
          () => navigate('/events?type=favorites'), // more button click event
          'All', // MORE button text
          'Your favorite events will appear here', // empty state text
          followedEvents?.length || 0
        )}

      {section(
        'Recommended Events', // section title
        isLoadingRecommended, // loading state
        // <LoadingCardSkeleton height="40px" width="200px" />, // skeleton component
        <LoadingEffect size="large" text="" variant="wave" />, // loading animation component
        <EventGrid columns={{ xs: 1, sm: 2, md: 4, lg: 6, xl: 8 }} events={recommendedEvents} />, // children component
        true, // show MORE button
        refetchRecommended, // more button click event
        'Show Different', // more button text
        'No recommended events', // empty state text
        recommendedEvents?.length || 0
      )}
    </Container>
  );
};

export default Home;
