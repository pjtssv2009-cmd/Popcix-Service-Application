/**
 * POPCIX Supabase Client & Auth Service
 * 
 * Official Supabase Client initialization using @supabase/supabase-js.
 * Supabase Auth is the absolute source of truth for authentication.
 * Never stores custom passwords or custom JWTs.
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { logger } from './safeLogger';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock-popcix.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-local-demo';

export const isSupabaseConfigured = () => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('mock-popcix') &&
    !SUPABASE_ANON_KEY.includes('mock-anon-key')
  );
};

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  phone?: string;
  profile_photo_url?: string;
  preferred_language: string;
  current_plan: 'FREE' | 'BASIC' | 'PLUS' | 'PREMIUM';
  reward_points: number;
  xp_points: number;
  level: number;
  streak: number;
  completed_bookings_count: number;
  created_at: string;
}

// Fallback demo user for offline / initial app discovery
export const DEMO_USER_PROFILE: UserProfile = {
  id: 'demo-user-profile-id',
  auth_user_id: 'demo-auth-user-id',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@popcix.app',
  phone: '+91 98765 43210',
  profile_photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  preferred_language: 'en',
  current_plan: 'PLUS',
  reward_points: 1450,
  xp_points: 820,
  level: 4, // Home Hero Level 4
  streak: 7, // 7-Day Care Streak
  completed_bookings_count: 8,
  created_at: new Date().toISOString(),
};
