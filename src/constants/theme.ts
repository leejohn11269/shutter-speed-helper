/**
 * OCEAN_FRESH preset + the brief's accent overrides.
 * The `name` field MUST stay exactly as in preset.ts.
 */

export const theme = {
  name: 'ocean-fresh',

  colors: {
    bg: {
      primary: '#EDF4F6',
      secondary: '#DCEAF0',
      tertiary: '#CFE2EB',
      deep: '#C8DFE9',
    },
    surface: {
      card: '#FFFFFF',
      alt: '#F4F9FB',
      graphite: '#223038',
      graphiteDeep: '#161F23',
      ink: '#182124',
    },
    brand: {
      primary: '#2A85AB',
      accent: '#E028AE',
      accentDeep: '#B81E8C',
      secondary: '#B0BADD',
      warning: '#E0902A',
      success: '#2BA06B',
    },
    text: {
      primary: '#182124',
      secondary: '#55646B',
      onDark: '#F3F9FB',
      mutedOnDark: '#B0BADD',
      inverse: '#FFFFFF',
    },
    ui: {
      borderLight: 'rgba(24,33,36,0.07)',
      borderLightStrong: 'rgba(24,33,36,0.12)',
      borderOnDark: 'rgba(176,186,221,0.20)',
      hairlineOnDark: 'rgba(176,186,221,0.14)',
      glassOnDark: 'rgba(255,255,255,0.05)',
      tintPrimary: 'rgba(42,133,171,0.10)',
      tintPrimaryStrong: 'rgba(42,133,171,0.22)',
      scrim: 'rgba(16,23,27,0.55)',
    },
  },

  gradients: {
    light: ['#EDF4F6', '#DCEAF0', '#CFE2EB'],
    lightDeep: ['#F2F8FA', '#DCEAF0', '#C8DFE9'],
    dark: ['rgba(24,33,36,0.94)', 'rgba(16,23,27,0.97)', 'rgba(10,15,18,0.99)'],
    graphite: ['#223038', '#161F23'],
    graphiteBadge: ['#223038', '#141D21'],
    action: ['#E028AE', '#B81E8C'],
    meter: ['#2A85AB', '#E028AE'],
  },

  typography: {
    hero: { fontSize: 30, fontWeight: '800' as const, letterSpacing: 5 },
    display: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 0.4 },
    title: { fontSize: 19, fontWeight: '800' as const, letterSpacing: 1 },
    subtitle: { fontSize: 14, fontWeight: '800' as const, letterSpacing: 1.2 },
    body: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 0.2 },
    label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 2.2 },
    micro: { fontSize: 9, fontWeight: '800' as const, letterSpacing: 2 },
  },

  radius: { pill: 10, sm: 12, md: 14, tile: 16, lg: 18, xl: 20, sheet: 24, full: 999 },

  spacing: { xs: 4, sm: 8, md: 10, lg: 14, xl: 16, xxl: 24 },

  shadows: {
    card: {
      shadowColor: '#2A85AB',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    cardStrong: {
      shadowColor: '#2A85AB',
      shadowOpacity: 0.14,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
    action: {
      shadowColor: '#E028AE',
      shadowOpacity: 0.38,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 7,
    },
    module: {
      shadowColor: '#182124',
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
  },

  animation: {
    entry: { tension: 48, friction: 7 },
    press: { tension: 300, friction: 16 },
    fadeScreen: 200,
    fadeElement: 180,
  },
} as const;

export type Theme = typeof theme;
export default theme;
