// ─── Dynamic Theme Engine ───────────────────────────────────────────────────
// Reads `profile.darkMode` from the Zustand user store and returns
// the matching color palette. Every component using this hook will
// re-render automatically when the user toggles dark mode.

import { useUserStore } from '../store/useUserStore';

// ─── Light Mode: Paper & Ink ─────────────────────────────────────────────────
const LightColors = {
  background: '#FDFBF7',    // Warm paper off-white
  surface: '#FFFFFF',        // Pure white for cards
  surfaceLight: '#F4F0EA',   // Slightly darker paper
  border: '#161922',         // Bold, dark ink-like borders
  divider: '#E5E7EB',
  textPrimary: '#161922',    // Dark ink
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  accent: '#7C3AED',         // Vibrant purple
  accentLight: '#A78BFA',
  error: '#EF4444',
  success: '#10B981',
} as const;

// ─── Dark Mode: Night Sky & Neon ─────────────────────────────────────────────
const DarkColors = {
  background: '#0F1117',    // Deep dark background
  surface: '#161922',        // Elevated dark surface
  surfaceLight: '#1F232E',
  border: '#2D3343',         // Subtle dark borders
  divider: '#374151',
  textPrimary: '#F9FAFB',   // Bright off-white
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  accent: '#A78BFA',         // Lighter purple for dark mode contrast
  accentLight: '#C4B5FD',
  error: '#F87171',
  success: '#34D399',
} as const;

// ─── Type Export ─────────────────────────────────────────────────────────────
export type ThemeColors = typeof LightColors | typeof DarkColors;

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useTheme() {
  const darkMode = useUserStore((s) => s.profile.darkMode);
  const colors: ThemeColors = darkMode ? DarkColors : LightColors;
  return { colors, isDark: darkMode };
}
