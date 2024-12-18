import { Box } from '@mui/material';
import { EventCard } from './EventCard';

/**
 * Renders a responsive grid layout of event cards
 * @param {Object} props
 * @param {Array} props.events - Array of event objects to display
 * @param {Object} props.columns - Breakpoint-specific column counts
 * @param {React.ComponentType} props.CardComponent - Component to render each event
 */
export const EventGrid = ({
  events,
  // Default responsive column configuration
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  },
  // Default card component to use
  CardComponent = EventCard,
}) => (
  // Container Box component for the grid layout
  <Box
    sx={{
      display: 'grid',
      // Responsive grid columns configuration
      gridTemplateColumns: {
        xs: `repeat(${columns.xs}, 1fr)`,
        sm: `repeat(${columns.sm}, 1fr)`,
        md: `repeat(${columns.md}, 1fr)`,
        lg: `repeat(${columns.lg}, 1fr)`,
        xl: `repeat(${columns.xl}, 1fr)`,
      },
      // Responsive gap spacing between grid items
      gap: { xs: 2, sm: 3 },
      width: '100%',
    }}
  >
    {/* Map through events array and render each event using the CardComponent */}
    {events.map((event) => (
      <CardComponent key={event.id} event={event} />
    ))}
  </Box>
);
