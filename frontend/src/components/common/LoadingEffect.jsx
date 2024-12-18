import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';

// Animation: Note bouncing effect
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

// Animation: Wave scaling effect
const wave = keyframes`
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0.5); }
  100% { transform: scaleY(1); }
`;

// Animation: Pulsing circle effect
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
`;

// Animation: Dot bounce effect
const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

/**
 * Displays a circular loading indicator with a centered music note
 * @param {Object} props Component props
 */
const CircularWithNote = ({ containerSize, iconSize, mainColor }) => (
  // Container for positioning the circular progress and note
  <Box sx={{ position: 'relative' }}>
    {/* Circular progress indicator */}
    <CircularProgress
      size={containerSize}
      sx={{
        color: mainColor,
        opacity: 0.8,
      }}
    />
    {/* Centered music note icon */}
    <MusicNoteIcon
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: iconSize,
        color: mainColor,
      }}
    />
  </Box>
);

/**
 * Displays three music notes with sequential bouncing animation
 * @param {Object} props Component props
 */
const BouncingNotes = ({ iconSize, mainColor }) => (
  // Horizontal stack for note alignment
  <Stack direction="row" spacing={0}>
    {['note1', 'note2', 'note3'].map((id) => (
      // Individual bouncing note
      <MusicNoteIcon
        key={id}
        sx={{
          fontSize: iconSize,
          color: mainColor,
          animation: `${bounce} 0.8s ease-in-out ${id.slice(-1) * 0.2}s infinite`,
        }}
      />
    ))}
  </Stack>
);

/**
 * Shows animated vertical bars with wave-like movement
 * @param {Object} props Component props
 */
const GradientWave = ({ iconSize, mainColor }) => (
  // Horizontal stack for wave bars
  <Stack direction="row" spacing={0.5} sx={{ height: iconSize }}>
    {['wave1', 'wave2', 'wave3', 'wave4', 'wave5'].map((id, index) => (
      // Individual wave bar with gradient
      <Box
        key={id}
        sx={{
          width: 4,
          height: '100%',
          background: `linear-gradient(to bottom, ${mainColor}, ${mainColor}33)`,
          animation: `${wave} 1s ease-in-out ${index * 0.1}s infinite`,
          borderRadius: 4,
        }}
      />
    ))}
  </Stack>
);

/**
 * Creates expanding circles with fade-out animation
 * @param {Object} props Component props
 */
const PulseEffect = ({ containerSize, iconSize, mainColor }) => (
  // Container for pulse circles
  <Box sx={{ position: 'relative', width: containerSize, height: containerSize }}>
    {['pulse1', 'pulse2', 'pulse3'].map((id, index) => (
      // Individual pulsing circle
      <Box
        key={id}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: iconSize,
          height: iconSize,
          borderRadius: '50%',
          backgroundColor: mainColor,
          animation: `${pulse} 1.5s ease-out ${index * 0.5}s infinite`,
        }}
      />
    ))}
    <MusicNoteIcon />
  </Box>
);

/**
 * Displays three dots with sequential bounce animation
 * @param {Object} props Component props
 */
const MinimalistDots = ({ mainColor }) => (
  // Horizontal stack for dots
  <Stack direction="row" spacing={1}>
    {['dot1', 'dot2', 'dot3'].map((id, index) => (
      // Individual bouncing dot
      <Box
        key={id}
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: mainColor,
          animation: `${dotBounce} 1.4s ease-in-out ${index * 0.16}s infinite`,
        }}
      />
    ))}
  </Stack>
);

/**
 * Main loading effect component that renders different loading animations
 * @param {Object} props Component props
 * @param {('circular'|'notes'|'wave'|'pulse'|'dots')} [props.variant='circular'] Animation variant to display
 * @param {('small'|'medium'|'large'|'xlarge')} [props.size='medium'] Size of the loading effect
 * @param {string} [props.text='Loading...'] Text to display below the animation
 */
export const LoadingEffect = ({ variant = 'circular', size = 'medium', text = 'Loading...' }) => {
  const theme = useTheme();
  const mainColor = theme.palette.primary.main;

  // Size configuration for different loading effect variants
  const sizeConfig = {
    small: { container: 100, icon: 24 },
    medium: { container: 150, icon: 32 },
    large: { container: 200, icon: 40 },
    xlarge: { container: 250, icon: 50 },
  };

  const containerSize = sizeConfig[size].container;
  const iconSize = sizeConfig[size].icon;

  // Render different loading variants based on prop
  const renderVariant = () => {
    switch (variant) {
      case 'circular':
        return <CircularWithNote containerSize={containerSize} iconSize={iconSize} mainColor={mainColor} />;
      case 'notes':
        return <BouncingNotes iconSize={iconSize} mainColor={mainColor} />;
      case 'wave':
        return <GradientWave iconSize={iconSize} mainColor={mainColor} />;
      case 'pulse':
        return <PulseEffect containerSize={containerSize} iconSize={iconSize} mainColor={mainColor} />;
      case 'dots':
        return <MinimalistDots mainColor={mainColor} />;
      default:
        return <CircularWithNote containerSize={containerSize} iconSize={iconSize} mainColor={mainColor} />;
    }
  };

  // Main container for loading effect and text
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        gap: 2,
      }}
    >
      {renderVariant()}
      {/* Loading text display */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          opacity: 0.8,
          fontWeight: 500,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
