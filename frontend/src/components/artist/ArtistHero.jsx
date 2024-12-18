import AlbumIcon from '@mui/icons-material/Album';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';

/**
 * Renders a Wikipedia icon as a styled "W" letter
 * @returns {JSX.Element} Wikipedia icon component
 */
const WikipediaIcon = () => (
  <Typography
    variant="button"
    sx={{
      fontWeight: 600,
      fontSize: { xs: '1.1rem', sm: 'inherit' },
      fontFamily: 'Georgia, "Times New Roman", serif',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        color: 'primary.main',
        transform: 'scale(1.05)',
      },
    }}
  >
    W
  </Typography>
);

/**
 * Renders a social media link with an icon and tooltip
 * @param {Object} props Component props
 * @param {string} props.url The URL to link to
 * @param {JSX.Element} props.icon The icon component to display
 * @param {string} props.label The tooltip label text
 * @returns {JSX.Element|null} Social link component or null if no URL provided
 */
const SocialLink = ({ url, icon, label }) => {
  if (!url) return null;

  return (
    <Tooltip arrow title={label}>
      <IconButton
        aria-label={label}
        href={url}
        rel="noopener noreferrer"
        size="small"
        target="_blank"
        sx={{
          color: 'white',
          '&:hover': {
            color: 'primary.main',
            transform: 'scale(1.1)',
          },
          fontSize: { xs: '0.8rem', sm: '1.25rem' },
          padding: { xs: '4px', sm: '8px' },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

/**
 * Hero section component that displays artist information and social media links
 * @param {Object} props Component props
 * @param {Object} props.artist The artist data object
 * @returns {JSX.Element} Artist hero component
 */
export const ArtistHero = ({ artist }) => (
  // Container box for the entire hero section
  <Box
    sx={{
      position: 'relative',
      height: { xs: '12vh', sm: '16vh' },
      minHeight: { xs: '150px', sm: '200px' },
      width: '100%',
      mb: 3,
      backgroundColor: 'background.paper',
      borderRadius: 2,
      overflow: 'hidden',
    }}
  >
    {/* Background box with blur effect and overlay */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${artist.ticketmaster_image_16_9})`,
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

    {/* Content container with flex layout */}
    <Container
      sx={{
        height: '100%',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, sm: 4 },
      }}
    >
      {/* Artist avatar - hidden on mobile screens */}
      <Box
        sx={{
          width: 150,
          height: 150,
          flexShrink: 0,
          position: 'relative',
          display: { xs: 'none', sm: 'block' }, // Hide on xs, show on sm and above
        }}
      >
        {/* Artist image with circular crop */}
        <Box
          alt={artist.name}
          component="img"
          src={artist.image}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        />
      </Box>

      {/* Artist information container */}
      <Box sx={{ flex: 1 }}>
        {/* Artist name with responsive typography */}
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            mb: { xs: 1, sm: 1.5 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          {artist.name}
        </Typography>

        {/* Social media links container with responsive spacing */}
        <Stack direction="row" spacing={{ xs: 0.25, sm: 0.5 }}>
          {/* Individual social media links */}
          <SocialLink icon={<MusicNoteIcon />} label="Spotify" url={artist.spotify_link} />
          <SocialLink icon={<YouTubeIcon />} label="YouTube" url={artist.youtube_link} />
          <SocialLink icon={<AppleIcon />} label="Apple Music" url={artist.itunes_link} />
          <SocialLink icon={<AlbumIcon />} label="Last.fm" url={artist.lastfm_link} />
          <SocialLink icon={<FacebookIcon />} label="Facebook" url={artist.facebook_link} />
          <SocialLink icon={<TwitterIcon />} label="Twitter" url={artist.twitter_link} />
          <SocialLink icon={<InstagramIcon />} label="Instagram" url={artist.instagram_link} />
          <SocialLink icon={<WikipediaIcon />} label="Wikipedia" url={artist.wiki_link} />
          <SocialLink icon={<LanguageIcon />} label="Website" url={artist.homepage_link} />
          <SocialLink icon={<LaunchIcon />} label="Ticketmaster" url={artist.ticketmaster_url} />
        </Stack>
      </Box>
    </Container>
  </Box>
);
