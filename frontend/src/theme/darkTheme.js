import { createTheme } from '@mui/material';

// Color constants definition
// Centralized management of all color values foreasy modification and maintenance
const colors = {
  brand: {
    main: '#1db954', // Brand primary color
    mainHover: '#1ed760', // Primary color hover state
  },
  grey: {
    main: '#272727', // Main grey, used for buttons and backgrounds
    dark: '#202020', // Dark grey, used for hover states
  },
  background: {
    default: '#282c34', // Application default background color
    paper: '#1a1a1a', // Card and panel background color
    appBar: '#121212', // Top navigation bar background color
  },
  text: {
    primary: '#ffffff', // Primary text color (white)
    dark: '#000000', // Dark text (used for light backgrounds)
  },
  status: {
    error: {
      background: '#2c1517', // Error status background color
      text: '#f48fb1', // Error status text color
    },
  },
  input: {
    background: 'rgba(255, 255, 255, 0.15)', // Input field background color
    backgroundHover: 'rgba(255, 255, 255, 0.25)', // Input field hover background color
  },
};

// Common style constants
// Define global shared style valuesto ensure UI consistency
const commonStyles = {
  borderRadius: {
    button: '20px', // Button border radius
    input: '20px', // Input field border radius
    alert: '8px', // Alert border radius
  },
  transitions: {
    transform: 'transform 0.2s', // Unified animation transition effect
  },
  sizes: {
    avatar: { width: 24, height: 24 }, // Avatar size
    button: { height: 32 }, // Button height
    iconButton: { width: 32, height: 32 }, // Icon button size
    input: { height: 32 }, // Input field height
    appBar: { height: 60 }, // Top navigation bar height
  },
  spacing: {
    input: '8px 16px', // Input field padding
    appBar: '8px 16px', // Navigation bar padding
    appBarBottom: '20px', // Navigation bar bottom margin
  },
};

// Common hover effects
// Define reusable hoveranimations and transitions
const hoverStyles = {
  button: {
    '&:hover': {
      backgroundColor: colors.brand.mainHover,
    },
  },
  // Enhanced hover effect with scale transform
  card: {
    textAlign: 'center',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      cursor: 'pointer',
    },
    width: '100%',
    position: 'relative',
  },
  // Lift effect with gradient overlay on hover
  cardLift: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      cursor: 'pointer',
      '& .MuiCardContent-root': {
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
      },
    },
  },
};

// Component style overrides
// Unified management of all MUI component customizations
const components = {
  // Button component styles
  MuiButton: {
    styleOverrides: {
      root: {
        height: commonStyles.sizes.button.height,
        borderRadius: commonStyles.borderRadius.button,
        textTransform: 'none', // Disable button text auto-capitalization
        padding: commonStyles.spacing.button,
        ...hoverStyles.button, // Add hover effect
      },
      containedGrey: {
        backgroundColor: colors.grey.main,
        '&:hover': {
          backgroundColor: colors.grey.dark,
        },
      },
    },
  },

  // Card component styles with hover variants
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.paper,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
    },
    variants: [
      {
        props: { variant: 'hover-scale' },
        style: hoverStyles.card,
      },
      {
        props: { variant: 'hover-lift' },
        style: hoverStyles.cardLift,
      },
    ],
  },

  // Alert component styles
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: commonStyles.borderRadius.alert,
      },
      standardError: {
        backgroundColor: colors.status.error.background,
        color: colors.status.error.text,
      },
    },
  },

  // Top AppBar styles with flexible layout
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.appBar,
        padding: commonStyles.spacing.appBar,
        minHeight: `${commonStyles.sizes.appBar.height}px`,
        height: `${commonStyles.sizes.appBar.height}px`,
        marginBottom: commonStyles.spacing.appBarBottom,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiToolbar-root': {
          minHeight: `${commonStyles.sizes.appBar.height}px`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  },

  // Circular progress bar style
  // MuiCircularProgress: {
  //   styleOverrides: {
  //     root: {
  //       color: colors.brand.main,
  //     },
  //   },
  // },

  // Text layout style
  MuiTypography: {
    styleOverrides: {
      root: {
        color: colors.text.primary,
      },
    },
  },

  // Avatar component style
  MuiAvatar: {
    styleOverrides: {
      root: {
        ...commonStyles.sizes.avatar,
        backgroundColor: `${colors.brand.main}`,
        // border: `1px solid ${colors.brand.main}`,
        '& .MuiTypography-root': {
          color: colors.text.dark,
          fontSize: '0.875rem',
        },
      },
    },
  },

  // Switchable state icon button style
  MuiIconButton: {
    styleOverrides: {
      root: {
        ...commonStyles.sizes.iconButton,
        '&.Mui-active': {
          color: colors.brand.main,
        },
        '&:hover .MuiAvatar-root': {
          backgroundColor: `${colors.brand.mainHover}`,
          border: `1px solid ${colors.brand.mainHover}`,
        },
      },
      // sizeSmall: {
      //   padding: 4,
      // },
    },
  },

  // Text input box style
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: commonStyles.borderRadius.input,

          '& .MuiInputAdornment-root': {
            marginRight: '-12px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
          },
        },
      },
    },
  },

  // Autocomplete drop-down menu styles
  // MuiAutocomplete: {
  //   styleOverrides: {
  //     listbox: {
  //       backgroundColor: 'transparent !important',
  //     },
  //     option: {
  //       backgroundColor: 'transparent !important',
  //       '&:hover, &[aria-selected="true"], &.Mui-focused': {
  //         backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
  //       },
  //     },
  //   },
  // },

  MuiCssBaseline: {
    // 1. Auto-fill style, forcibly remove the background color of auto-fill, achieved through ultra-long transition time
    // 2. Add card hover effects
    styleOverrides: `
      input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
        transition-delay: 999999s;
        transition-property: background-color;
      }
      .hover-card {
        text-align: center;
        transition: transform 0.2s;
        width: 100%;
        position: relative;
      }
      .hover-card:hover {
        transform: scale(1.05);
        cursor: pointer;
      }
    `,
  },

  // Box component with hovercard functionality
  MuiBox: {
    styleOverrides: {
      root: {
        '&.MuiBox-root.hover-card': {
          textAlign: 'center',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
            cursor: 'pointer',
          },
          width: '100%',
          position: 'relative',
        },
      },
    },
  },
};

// Create and export theme
// UseMUI's createTheme function to generate theme configuration
export const darkTheme = createTheme({
  // Palette configuration
  palette: {
    mode: 'dark',
    primary: { main: colors.brand.main },
    grey: {
      main: colors.grey.main,
      dark: colors.grey.dark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
  },
  // Component style overrides
  components,
});
