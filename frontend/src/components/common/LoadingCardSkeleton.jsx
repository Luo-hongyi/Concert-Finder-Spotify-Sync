import { Box, Card, CardContent, Skeleton } from '@mui/material';

/**
 * A reusable loading skeleton component that displays a placeholder while content is being fetched.
 * Supports two display variants: card style (default) and list style.
 *
 * @param {Object} props - Component props
 * @returns {JSX.Element} Loading skeleton component
 */
export const LoadingCardSkeleton = ({ width = '100%', height = 200, variant = 'default' }) => {
  if (variant === 'list') {
    return (
      // Container box for list variant
      <Box sx={{ width }}>
        <Skeleton animation="wave" height={height} variant="rectangular" width={width} />
        <Box sx={{ p: 2 }}>
          <Skeleton animation="wave" height={24} width="40%" />
          <Skeleton animation="wave" height={32} width="70%" />
          <Skeleton animation="wave" height={24} width="30%" />
        </Box>
      </Box>
    );
  }

  // Default card variant
  return (
    <Card sx={{ width, m: 1 }}>
      <Skeleton animation="wave" height={height} variant="rectangular" width={width} />
      <CardContent>
        <Skeleton animation="wave" height={32} variant="text" width="60%" />
        <Skeleton animation="wave" height={24} variant="text" width="40%" />
      </CardContent>
    </Card>
  );
};
