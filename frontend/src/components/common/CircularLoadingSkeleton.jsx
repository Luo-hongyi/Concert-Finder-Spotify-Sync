import { Box, Skeleton } from '@mui/material';

/**
 * A loading placeholder component that displays a circular skeleton with optional text below
 * @param {object} props - Component props
 * @returns {JSX.Element} Circular loading skeleton component
 */
export const CircularLoadingSkeleton = ({ size = 200 }) => (
  <Box sx={{ width: size, m: 1 }}>
    <Skeleton animation="wave" height={size} variant="circular" width={size} />
    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
      <Skeleton animation="wave" height={24} variant="text" width="60%" />
      {/* <Skeleton animation="wave" height={20} variant="text" width="60%" /> */}
    </Box>
  </Box>
);
