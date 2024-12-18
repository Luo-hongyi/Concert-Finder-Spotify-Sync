import { Box, Skeleton, Stack } from '@mui/material';

/**
 * A skeleton loading component that displays a placeholder for an event list item.
 * Includes animated loading states for image, date/time, and content sections.
 *
 * @component
 * @return {JSX.Element} A skeleton loading placeholder for an event item
 */
export const EventListItemSkeleton = () => (
  // Main container with flex layout and border bottom
  <Box
    sx={{
      display: 'flex',
      alignItems: 'stretch',
      gap: 2,
      py: 2,
      px: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
      minHeight: 120,
    }}
  >
    {/* Left image skeleton container */}
    <Box
      sx={{
        width: 180,
        height: 120,
        borderRadius: 1,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Image placeholder skeleton */}
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>

    {/* Date/time section with right border */}
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
      {/* Date skeleton elements */}
      <Skeleton animation="wave" height={32} sx={{ mx: 'auto', my: 0.5 }} width="80%" />
      <Skeleton animation="wave" height={20} sx={{ mx: 'auto' }} width="70%" />
    </Box>

    {/* Main content area with multiple skeleton lines */}
    <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
      {/* Title and description skeleton lines */}
      <Skeleton animation="wave" height={20} width="30%" />
      <Skeleton animation="wave" height={24} width="60%" />
      <Skeleton animation="wave" height={20} width="25%" />
      <Skeleton animation="wave" height={20} width="40%" />
    </Stack>

    {/* Commented out action buttons section */}
    {/* <Stack alignItems="center" direction="row" spacing={1}>
      <Skeleton animation="wave" height={24} sx={{ borderRadius: 3 }} width={80} />
      <Skeleton animation="wave" height={40} variant="circular" width={40} />
    </Stack> */}
  </Box>
);
