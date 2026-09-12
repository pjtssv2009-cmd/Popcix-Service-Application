/**
 * POPCIX Design System - Color Tokens
 * Light mode only.
 * Primary: Black #000000
 * Background: #F8F8F5
 * Surface: #FFFFFF
 * Primary text: #111111
 * Secondary text: #6B6B6B
 * Vibrant energetic accents for rewards, gamification, and categories.
 */

export const colors = {
  primary: '#000000',
  primaryHover: '#1A1A1A',
  primaryActive: '#2D2D2D',
  
  background: '#F8F8F5',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F1ED',
  surfaceElevated: '#FFFFFF',
  
  text: {
    primary: '#111111',
    secondary: '#6B6B6B',
    muted: '#9E9E9E',
    inverse: '#FFFFFF',
  },
  
  border: {
    subtle: '#EAEAE4',
    default: '#DFDFD6',
    focus: '#000000',
  },

  // Vibrant Energetic Accents
  accent: {
    violet: '#7C3AED', // Gamification, XP, Special levels
    coral: '#FF5757',  // Urgent, High-priority, Instant booking
    amber: '#FFAA00',  // Streaks, Fire, Coins, Points
    emerald: '#10B981',// Success, Verified, Cleanliness, Completed
    sky: '#0284C7',    // AC, Plumbing, Water, Information
    yellow: '#FBBF24', // Stars, Reviews, Bright Highlights
    pink: '#EC4899',   // Beauty, Spa, Premium HomeCare
    indigo: '#6366F1', // Car cleaning, Tech
  },

  status: {
    success: '#10B981',
    warning: '#FFAA00',
    error: '#FF5757',
    info: '#0284C7',
  }
} as const;

export type ColorToken = typeof colors;
