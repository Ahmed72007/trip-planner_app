// ─── Trip Planner Theme ─────────────────────────────────────────────────────
// Doodle-style minimal dark theme with glassmorphism accents

export const Colors = {
  // Base
  background: '#0F1117',
  surface: '#181A20',
  surfaceLight: '#1F2128',
  surfaceGlass: 'rgba(255, 255, 255, 0.05)',
  surfaceGlassHover: 'rgba(255, 255, 255, 0.08)',

  // Text
  textPrimary: '#F5F5F7',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  textInverse: '#0F1117',

  // Accents - Playful Doodle Palette
  accent: '#7C6EF6',        // Soft purple
  accentLight: '#9D92F8',
  accentDark: '#5B4ED4',
  coral: '#FF6B6B',          // Warm coral
  mint: '#4ECDC4',           // Fresh mint
  amber: '#FFB74D',          // Warm amber
  sky: '#64B5F6',            // Soft sky
  rose: '#F48FB1',           // Gentle rose
  lime: '#AED581',           // Fresh lime
  peach: '#FFAB91',          // Soft peach

  // Functional
  success: '#4ECDC4',
  warning: '#FFB74D',
  error: '#FF6B6B',
  info: '#64B5F6',

  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.08)',
  borderDoodle: 'rgba(255, 255, 255, 0.15)',
  divider: 'rgba(255, 255, 255, 0.06)',

  // Glass
  glassBg: 'rgba(255, 255, 255, 0.04)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHighlight: 'rgba(255, 255, 255, 0.08)',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Tab bar
  tabBar: '#13141A',
  tabInactive: '#636366',
  tabActive: '#7C6EF6',

  // Categories
  categoryFood: '#FF6B6B',
  categoryTransport: '#64B5F6',
  categoryAccommodation: '#FFB74D',
  categoryActivities: '#4ECDC4',
  categoryShopping: '#F48FB1',
  categoryOther: '#8E8E93',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const Glass = {
  intensity: 40,
  tint: 'dark' as const,
  backgroundColor: Colors.glassBg,
  borderColor: Colors.glassBorder,
  borderWidth: 1,
  borderRadius: BorderRadius.lg,
};

export const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Doodle-style utilities
export const Doodle = {
  borderStyle: 'solid' as const,
  borderWidth: 1.5,
  borderColor: Colors.borderDoodle,
  borderRadius: BorderRadius.xl,
  // Slightly offset shadow for hand-drawn feel
  shadowOffset: { width: 2, height: 3 },
};

export const CategoryColors: Record<string, string> = {
  food: Colors.categoryFood,
  transport: Colors.categoryTransport,
  accommodation: Colors.categoryAccommodation,
  activities: Colors.categoryActivities,
  shopping: Colors.categoryShopping,
  other: Colors.categoryOther,
  restaurant: Colors.categoryFood,
  attraction: Colors.categoryActivities,
  museum: Colors.accent,
  park: Colors.lime,
  nightlife: Colors.rose,
  hotel: Colors.categoryAccommodation,
};

export const PreferenceColors: Record<string, string> = {
  adventure: Colors.coral,
  food: Colors.peach,
  culture: Colors.accent,
  nature: Colors.mint,
  nightlife: Colors.rose,
  shopping: Colors.amber,
  relaxation: Colors.sky,
  photography: Colors.lime,
  history: Colors.accentLight,
  art: Colors.rose,
};
