import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { darkTheme } from '../theme/darkTheme';

/**
 * Layout component without header that provides dark theme and basic page structure
 * Wraps child components with MUI ThemeProvider and Container
 * @returns {JSX.Element} Layout component
 */
export const NoHeaderLayout = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline /> {/* Reset CSS to MUI baseline */}
    {/* Main content container with custom max width */}
    <Container maxWidth={false} sx={{ maxWidth: '1920px' }}>
      <Outlet /> {/* Renders child route components */}
    </Container>
  </ThemeProvider>
);
