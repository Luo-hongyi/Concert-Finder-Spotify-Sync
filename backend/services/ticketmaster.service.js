const { ticketmasterApi } = require('../utils/axios.clients');
const { isStateCode } = require('../utils/stateUtils');

// Virtual venue images for background display
const VIRTUAL_VENUE_IMAGES = [
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1468359601543-843bfaef291a?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1481162854517-d9e353af153d?w=1200&auto=format&fit=crop',
];

// Fields required for list mode display
const LIST_MODE_FIELDS = [
  'id',
  'followed',
  'artistId',
  'artistName',
  'name',
  'genre',
  'date',
  'time',
  'venue',
  'city',
  'state',
  'countryCode',
  'distance',
  'status',
  'image_ratio3_2',
  'priceRanges',
];

/**
 * Get a virtual venue image based on event ID
 * @param {string} eventId - The event ID
 * @returns {string} URL of the virtual venue image
 */
const getVirtualVenueImage = (eventId) => {
  // Get the last character of the event ID
  const lastChar = eventId.slice(-1);
  // Convert character to ASCII value
  const lastDigit = lastChar.charCodeAt(0);
  // Ensure index is within bounds of VIRTUAL_VENUE_IMAGES array
  const index = lastDigit % VIRTUAL_VENUE_IMAGES.length;

  return VIRTUAL_VENUE_IMAGES[index];
};

/**
 * Fetch Ticketmaster IDs and additional information for given artists
 * @param {Array<{name: string}>} artists - Array of artist objects containing names
 * @returns {Promise<Array>} Array of artist information including Ticketmaster IDs and social links
 */
async function getTicketmasterIds(artists) {
  const results = [];

  for (const artist of artists) {
    // await delay(100);

    // Get artist information
    const { data } = await ticketmasterApi.get('/attractions.json', {
      params: { keyword: artist.name },
    });

    // Find matching artist
    const attraction = data._embedded?.attractions?.find((a) => a.name.toLowerCase() === artist.name.toLowerCase());
    if (attraction) {
      // console.log('attraction', attraction);
      results.push({
        // Artist Information from Ticketmaster
        name: artist.name,
        ticketmaster_id: attraction.id,
        ticketmaster_url: attraction.url || '',
        ticketmaster_genre: 'Music | ' + (attraction.classifications?.[0]?.genre?.name || 'General'),
        upcoming_events: attraction.upcomingEvents?._total || 0,

        // Artist Images
        ticketmaster_image_16_9:
          attraction.images?.find((img) => img.ratio === '16_9' && img.width === 1024)?.url || '',
        ticketmaster_image_3_2: attraction.images?.find((img) => img.ratio === '3_2' && img.width === 305)?.url || '',

        // Artist Social Links
        youtube_link: attraction?.externalLinks?.youtube?.[0]?.url || '',
        twitter_link: attraction?.externalLinks?.twitter?.[0]?.url || '',
        itunes_link: attraction?.externalLinks?.itunes?.[0]?.url || '',
        lastfm_link: attraction?.externalLinks?.lastfm?.[0]?.url || '',
        spotify_link: attraction?.externalLinks?.spotify?.[0]?.url || '',
        wiki_link: attraction?.externalLinks?.wiki?.[0]?.url || '',
        facebook_link: attraction?.externalLinks?.facebook?.[0]?.url || '',
        musicbrainz_link: attraction?.externalLinks?.musicbrainz?.[0]?.url || '',
        instagram_link: attraction?.externalLinks?.instagram?.[0]?.url || '',
        homepage_link: attraction?.externalLinks?.homepage?.[0]?.url || '',
      });
    }
  }

  return results;
}

/**
 * Fetch event information from Ticketmaster API
 * @param {Object} options - Search parameters
 * @param {string[]} [options.eventIds=[]] - Specific event IDs to fetch (highest priority)
 * @param {string[]} [options.attractionIds=[]] - Artist/attraction IDs to fetch events for (second priority)
 * @param {number} [options.latitude=40.1164] - Latitude (UIUC default)
 * @param {number} [options.longitude=-88.2434] - Longitude (UIUC default)
 * @param {number} [options.radius] - Search radius in kilometers
 * @param {string} [options.countryCode=''] - Country code filter
 * @param {number} [options.size] - Number of results to return (max 9999)
 * @param {string} [options.keyword=''] - Search keyword
 * @param {string} [options.sort=''] - Sort order
 * @param {string} [options.startDateStr] - Start date for event search
 * @param {string} [options.endDateStr] - End date for event search
 * @param {string} [options.mode='LIST'] - Output mode ('LIST' or 'DETAIL')
 * @param {string[]} [options.followedEvents=[]] - Array of event IDs followed by user
 * @param {string} [options.searchlocation=''] - Location search string (city or state code)
 * @returns {Promise<{events: Array, spellcheck: string, originalKeyword: string, error?: string}>}
 */
async function getEvents({
  eventIds = [], // Highest priority, ignores other parameters when present
  attractionIds = [], // Second highest priority, ignores other parameters when present
  latitude = 40.1164, // Default UIUC latitude
  longitude = -88.2434, // Default UIUC longitude
  radius, // Radius in kilometers
  countryCode = '', // Country code filter
  size, // Default 20
  keyword = '', // Keyword
  sort = '', // Sort order
  startDateStr, // Start date
  endDateStr, // End date
  mode = 'LIST', // Output mode, default is LIST
  followedEvents = [], // List of event IDs followed by user
  searchlocation = '', // Location search string (city or state code)
} = {}) {
  try {
    const params = new URLSearchParams();

    // Add location information - Always needed, used to calculate distance
    params.append('latlong', `${latitude},${longitude}`);
    params.append('unit', 'km');

    // Process eventIds (highest priority)
    // console.log('eventIds:', eventIds);
    if (eventIds.length > 0) {
      params.append('id', eventIds.join(','));
    } else if (attractionIds.length > 0) {
      // Process attractionIds (second highest priority)
      params.append('attractionId', attractionIds.join(','));
    } else if (keyword) {
      // Process keyword search
      params.append('keyword', keyword);
    }

    if (radius && Number.isInteger(radius)) {
      params.append('radius', radius.toString());
    }

    if (countryCode) {
      params.append('countryCode', countryCode);
    }

    // Start time and end time
    if (startDateStr) {
      params.append('localStartDateTime', `${startDateStr}`);
      console.log('Using localStartDateTime:', startDateStr);
    }
    if (endDateStr) {
      params.append('localEndDateTime', `${endDateStr}`);
      console.log('Using localEndDateTime:', endDateStr);
    }

    // Use default current time if no date range is specified
    if (!startDateStr && !endDateStr) {
      const now = new Date();
      // Get current time in the US Central Time Zone
      // This is a performance consideration, this project is based on UIUC location, so no need to implement complex timezone conversion
      const ctTime = now
        .toLocaleString('en-US', {
          timeZone: 'America/Chicago',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6');

      params.append('localStartDateTime', ctTime);
      console.log('Using default localStartDateTime:', ctTime);
    }
    // size = 5; // test only

    if (sort) {
      params.append('sort', sort);
    }

    // Process size parameter
    const validSize = Math.min(Math.max(1, Math.round(size)), 9999);
    params.append('size', validSize.toString());

    // If there is a keyword search, add spellcheck request
    if (keyword) {
      params.append('includeSpellcheck', 'yes');
    }

    // Process location search
    console.log('searchlocation:', searchlocation);
    if (searchlocation) {
      const cleanedLocation = searchlocation.trim().replace(/[^a-zA-Z\s]/g, '');
      const stateCode = isStateCode(cleanedLocation);

      if (stateCode) {
        params.append('stateCode', stateCode); // search text is a state code
      } else {
        params.append('city', cleanedLocation); // search text may be a city name
      }
    }

    // Call Ticketmaster API
    const response = await ticketmasterApi.get(`/events?${params.toString()}`);
    const events = response.data._embedded?.events || [];

    // Ticketmaster may return events outside the date range, so we need to remove them
    const filteredEvents = events.filter((event) => {
      if (!event.dates?.start?.localDate) return false;

      const eventDate = new Date(event.dates.start.localDate);
      const startDate = startDateStr ? new Date(startDateStr.split('T')[0]) : null;
      const endDate = endDateStr ? new Date(endDateStr.split('T')[0]) : null;

      // Compare only dates
      eventDate.setHours(0, 0, 0, 0);
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(0, 0, 0, 0);

      // If no date range is specified, returns all events
      if (!startDate && !endDate) return true;

      // If only the start date is specified
      if (startDate && !endDate) {
        return eventDate >= startDate;
      }

      // If only the end date is specified
      if (!startDate && endDate) {
        return eventDate <= endDate;
      }

      // If both start and end dates are specified
      return eventDate >= startDate && eventDate <= endDate;
    });

    // Get spellcheck suggestion
    const spellcheck = response.data.spellcheck?.suggestions?.[0]?.suggestion || '';
    const originalKeyword = response.data.spellcheck?.original || '';

    // If there are no search results but spelling suggestions, return an object containing the spelling suggestions.
    if (filteredEvents.length === 0 && spellcheck) {
      return {
        events: [],
        spellcheck,
        originalKeyword,
      };
    }

    return {
      // Normalize event data
      events: filteredEvents.map((event) => {
        const fullData = {
          id: event.id || '',
          followed: followedEvents.includes(event.id),

          // Artist
          artistId: event._embedded?.attractions?.[0]?.id || '',
          artistName: (() => {
            const attraction = event._embedded?.attractions?.[0];
            let artistName = attraction?.name;
            if (!artistName) {
              // Extract artist name from event name using different patterns
              if (event.name?.includes(' presents ')) {
                artistName = event.name.split(' presents ')[0];
              } else if (event.name?.includes(' - ')) {
                artistName = event.name.split(' - ')[0];
              } else {
                artistName = '';
              }
            }
            return artistName;
          })(),

          // Event
          name: event.name || '',
          date: event.dates?.start?.localDate || '',
          time: event.dates?.start?.localTime || '',
          status: event.dates?.status?.code || '',
          url: event.url || '',
          image_ratio16_9_large: event.images?.find((img) => img.ratio === '16_9' && img.width === 1024)?.url || '',
          image_ratio16_9: event.images?.find((img) => img.ratio === '16_9' && img.width === 640)?.url || '',
          image_ratio3_2: event.images?.find((img) => img.ratio === '3_2' && img.width === 305)?.url || '',
          image_ratio4_3: event.images?.find((img) => img.ratio === '4_3' && img.width === 305)?.url || '',
          genre: event.classifications?.[0]?.genre?.name || '',
          priceRanges: event.priceRanges?.length
            ? (() => {
                // Filter out invalid prices and create unique price ranges
                const validPrices = event.priceRanges.filter((price) => price.min != null && price.max != null);
                if (!validPrices.length) return 'Price unavailable';

                // Create set of unique price ranges
                const uniquePrices = [
                  ...new Set(validPrices.map((price) => `${price.min.toFixed(2)} - ${price.max.toFixed(2)}`)),
                ];

                return `${validPrices[0].currency} ${uniquePrices.join(', ')}`;
              })()
            : 'Price unavailable',

          // Venue
          venue: event._embedded?.venues?.[0]?.name || '',
          venueUrl: (() => {
            const venueName = event._embedded?.venues?.[0]?.name;
            if (!venueName) return '';
            return (
              event._embedded?.venues?.[0]?.url || `https://www.google.com/search?q=${encodeURIComponent(venueName)}`
            );
          })(),
          venueImage: event._embedded?.venues?.[0]?.images?.[0]?.url || '',
          venueBackgroundImage: getVirtualVenueImage(event.id), // Use event ID to determine venue background image
          city: event._embedded?.venues?.[0]?.city?.name || '',
          state: event._embedded?.venues?.[0]?.state?.stateCode || '',
          country: event._embedded?.venues?.[0]?.country?.name || '',
          countryCode: event._embedded?.venues?.[0]?.country?.countryCode || '',
          address: event._embedded?.venues?.[0]?.address?.line1 || '',
          distance: event._embedded?.venues?.[0]?.distance || 0,
          location: {
            latitude: Number(event._embedded?.venues?.[0]?.location?.latitude) || 0,
            longitude: Number(event._embedded?.venues?.[0]?.location?.longitude) || 0,
          },

          // informations
          info: [
            event.info,
            event.pleaseNote,
            event.accessibility?.info,
            event.ticketLimit?.info,
            event.additionalInfo,
            event._embedded?.venues?.[0]?.generalInfo?.generalRule,
            event._embedded?.venues?.[0]?.accessibleSeatingDetail,
          ]
            .filter((text) => text?.trim())
            .map((text) =>
              text
                .replace(/\r\n/g, '\n')
                .split('\n')
                .filter((line) => line.trim())
            ),
        };

        // LIST mode only returns the required fields
        if (mode === 'LIST') {
          return Object.fromEntries(Object.entries(fullData).filter(([key]) => LIST_MODE_FIELDS.includes(key)));
        }

        // DETAIL mode returns all fields
        return fullData;
      }),

      // Spellcheck suggestion
      spellcheck,
      originalKeyword,
    };
  } catch (error) {
    const message = error?.response?.data?.errors?.[0]?.detail || 'Ticketmaster: Unknown error';
    console.error('Error fetching events:', message);
    return {
      events: [],
      spellcheck: '',
      originalKeyword: '',
      error: message,
    };
  }
}

module.exports = {
  getTicketmasterIds,
  getEvents,
};
