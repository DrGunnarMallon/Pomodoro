// styles/theme.ts
export const colors = {
  primaryBackground: '#ffe5e0', // Main app background
  cardBackground: '#fff0f0',    // Background for cards, modals, etc.
  cardBorder: '#ffc0cb',       // Light pink border for cards

  textPrimary: '#660000',      // Dark red for main titles and important text
  textSecondary: '#800000',    // Medium red for subtitles and less important text
  textParagraph: '#444444',    // Dark gray for body text for readability
  textOnPrimaryButton: '#FFFFFF',// White text on dark red buttons
  textOnAccent: '#FFFFFF',       // White text on accent color elements

  accentRed: '#C21807',        // Main accent red (buttons, highlights)
  accentDarkRed: '#A01305',    // Darker shade of accent for pressed states or borders
  accentLightRed: '#fe9a8a',   // Lighter red, used for old home screen bg

  buttonPrimary: '#C21807',    // Primary button color
  buttonSecondary: '#800000',  // Secondary button color (e.g., less critical actions)
  buttonDisabled: '#cccccc',   // Disabled button state

  white: '#FFFFFF',
  black: '#000000',
  gray: '#888888',             // General purpose gray
  lightGray: '#D3D3D3',        // For inactive elements, borders

  timerWorkText: '#C21807',
  timerBreakText: '#2E8B57',   // Sea green for break timer text
  breakBackground: '#e0ffe0',  // Light green for break screen background

  // Status/Urgency specific colors
  urgencyHigh: '#C21807',
  urgencyMedium: '#FF8C00', // Dark Orange
  urgencyLow: '#2E8B57',   // Sea Green
  statusDone: '#28a745',    // Green for "Done" status in task modal
  statusKeepTodo: '#007bff', // Blue for "Keep as To-Do" in task modal
};

export const fonts = {
  main: Platform.OS === 'ios' ? 'System' : 'sans-serif', // System default
  title: 'SpaceMono', // Custom loaded font
  body: Platform.OS === 'ios' ? 'System' : 'sans-serif', // System default for readability
};

export const fontSizes = {
  xxlarge: 36, // Main screen titles
  xlarge: 30,  // Large titles (e.g., About page main title)
  large: 24,   // Section headers
  mediumPlus: 20, // Slightly larger than medium
  medium: 18,  // Body text, button text
  regular: 16, // Standard text, input text
  small: 14,   // Subtitles, captions
  xsmall: 12,  // Fine print, iteration counters
};

export const spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

export const SIZES = { // For responsive design, if needed
    // TODO: Add screen dimensions if complex responsive logic is required
};

export const SHADOWS = {
  light: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
};

// styles/theme.ts
import { Platform } from 'react-native'; // Added for Platform specific font selection

// ... (rest of the theme file as previously defined)
// Note: I've added Platform to the import list at the top of this block.
// The content of colors, fonts, fontSizes, spacing, SIZES, SHADOWS remains the same as previously defined.
// This is just to acknowledge the import for Platform.OS.
// If the tool has issues with re-defining the whole file, this comment can be removed.
// For the sake of the tool, I will repeat the full structure.

export const theme = {
  colors,
  fonts,
  fontSizes,
  spacing,
  SHADOWS,
};

export default theme;
