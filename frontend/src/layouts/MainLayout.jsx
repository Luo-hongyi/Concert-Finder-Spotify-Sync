import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { darkTheme } from '../theme/darkTheme';

/**
 * Main layout component that wraps the entire application
 * Provides theme context and basic page structure
 * @returns {JSX.Element} The main layout wrapper component
 */
export const MainLayout = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline /> {/* Reset CSS to provide consistent styling */}
    <Header />
    {/* Main content container with custom max width */}
    <Container maxWidth={false} sx={{ maxWidth: '1920px' }}>
      <Outlet /> {/* Renders child routes */}
    </Container>
  </ThemeProvider>
);
