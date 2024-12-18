import { Box, Container, Link as MuiLink, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom';
import { ArtistHero } from '../components/artist/ArtistHero';
import { LoadingEffect } from '../components/common/LoadingEffect';
import { EventCardDetailed } from '../components/event/EventCardDetailed';
import { EventListItem } from '../components/event/EventListItem';
import { EventSearchFilter } from '../components/event/EventSearchFilter';
import useEvents from '../hooks/useEvents';

/**
 * Empty state component to display when no events are found
 * @param {Object} props - Component props
 * @param {string} props.emptyText - Text to display when no results
 * @param {Object} props.spellcheck - Spellcheck suggestions object
 * @returns {JSX.Element} Empty state component
 */
const EmptyState = ({ emptyText, spellcheck }) => {
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  return (
    <Box sx={{ p: 3 }}>
      {/* Display spellcheck suggestions if available */}
      {spellcheck?.spellcheck ? (
        <>
          No results found for "{spellcheck.originalKeyword}". Did you mean{' "'}
          <MuiLink
            component={RouterLink}
            sx={{
              color: 'inherit',
              textDecoration: 'underline',
              '&:visited': {
                color: 'inherit',
              },
            }}
            to={`/events?type=search&keyword=${spellcheck.spellcheck}${startDate ? `&startDate=${startDate}` : ''}${
              endDate ? `&endDate=${endDate}` : ''
            }`}
          >
            {spellcheck.spellcheck}
          </MuiLink>
          "?
        </>
      ) : (
        // Display empty state message if no spellcheck suggestions are available
        emptyText
      )}
    </Box>
  );
};

/**
 * Main event list component that displays events in different views
 * Handles various event listing types: feeds, favorites, recommended, artist events, search results
 */
export const EventList = () => {
  // console.log('EventList');

  // Get artist data from router state if available
  const { artist } = useLocation().state || {};
  // artist && console.log('artist', artist);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const artistId = searchParams.get('artistId');
  const keyword = searchParams.get('keyword') || '';
  const startDateStr = searchParams.get('startDate') || '';
  const endDateStr = searchParams.get('endDate') || '';
  const searchlocation = searchParams.get('searchlocation') || '';

  // console.log('searchFilters', { startDateStr, endDateStr, searchlocation });

  // State for search filters
  const [searchFilters, setSearchFilters] = useState({ startDateStr, endDateStr, searchlocation });

  // Update search filters state when search parameters change
  useEffect(() => {
    setSearchFilters({ startDateStr, endDateStr, searchlocation });
  }, [startDateStr, endDateStr, searchlocation]);

  /**
   * Get page title based on the current event list type
   * @returns {string} The page title
   */
  const getTitle = () => {
    switch (type) {
      case 'feeds':
        return 'Upcoming Events For You';
      case 'favorites':
        return 'All Favorite Events';
      case 'recommended':
        return 'Recommended Events';
      case 'artist':
        return artist?.name ? `${artist?.name}'s Upcoming Events` : 'Upcoming Events';
      case 'search':
        return keyword ? `Search Results for "${keyword}"` : 'Events';
      default:
        return 'Events';
    }
  };

  /**
   * Get empty state message based on the current event list type
   * @returns {string} The empty state message
   */
  const getEmptyText = () => {
    switch (type) {
      case 'favorites':
        return 'No favorite events';
      case 'artist':
        return 'No events found';
      case 'recommended':
        return 'No recommended events';
      case 'search':
        return keyword ? `No events found for "${keyword}"` : 'No events found';
      default:
        return 'No events found';
    }
  };

  /**
   * Get fetch size for different event list types
   * @returns {number} Number of events to fetch
   */
  const getFetchSize = () => {
    switch (type) {
      case 'feeds':
        return 200;
      case 'favorites':
        return 200;
      case 'recommended':
        return 200;
      case 'artist':
        return 200;
      case 'search':
        return 200;
      default:
        return 200;
    }
  };

  /**
   * Get fetch options including filters for API request
   * @returns {Object} Options object for event fetching
   */
  const getFetchOptions = () => {
    const options = {
      ...searchFilters, // Search filters: startDateStr, endDateStr, city or state
    };
    // console.log('getFetchOptions: ', options);
    switch (type) {
      case 'artist':
        return { artistId, ...options }; // Search by artist ID
      case 'search':
        return { keyword, ...options }; // Search by keyword
      default:
        return options;
    }
  };

  // Using useEvents hook to fetch and manage event data
  // Parameters:
  // - type: Event listing type (feeds/favorites/recommended/artist/search)
  // - size: Number of events to fetch
  // - options: Fetch configuration (artistId, keyword, filters)
  // Returns:
  // - events: Array of event objects
  // - spellcheck: Spellcheck suggestions for search terms
  // - isLoading: Loading state indicator
  const { events, spellcheck, isLoading } = useEvents(type, getFetchSize(), getFetchOptions());

  return (
    <Container maxWidth={false}>
      {/* Display artist hero section if artist data is available, otherwise display title */}
      {artist ? (
        <ArtistHero artist={artist} />
      ) : (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 'bold' }} variant="h4">
            {getTitle()}
          </Typography>
        </Box>
      )}

      {/* Loading state display */}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 300px)', // Subtract approximate header height
          }}
        >
          <LoadingEffect size="large" text="" variant="notes" />
        </Box>
      )}

      {/* Search filter section - hidden for favorites and artist events */}
      {!isLoading && type !== 'favorites' && type !== 'artist' && <EventSearchFilter />}

      {/* Event list container */}
      {!isLoading && (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
            ...(isSmallScreen && { p: 2, display: 'grid', gap: 2 }), // Grid layout for small screens
          }}
        >
          {/* Empty state display */}
          {events?.length === 0 && <EmptyState emptyText={getEmptyText()} spellcheck={spellcheck} />}

          {/* Event list rendering - card view for small screens, list view for larger screens */}
          {events?.map((event) =>
            isSmallScreen ? (
              <EventCardDetailed key={event.id} event={event} showFavorite={true} />
            ) : (
              <EventListItem key={event.id} event={event} />
            )
          )}
        </Box>
      )}
    </Container>
  );
};

/**
 * Wrapper component to force remount of EventList when search parameters change
 */
const EventListWrapper = () => {
  const location = useLocation();
  return <EventList key={location.search} />;
};

export default EventListWrapper;
