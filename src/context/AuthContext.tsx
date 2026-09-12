/**
 * POPCIX Authentication Context
 * 
 * Interacts directly with official Supabase Auth SDK.
 * Handles Sign Up, Sign In, Google OAuth, Password Reset, and Sign Out.
 * Never stores custom passwords or custom JWTs.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, UserProfile, DEMO_USER_PROFILE } from '../services/supabase';
import { logger } from '../services/safeLogger';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isDemoMode: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleDemoMode: (enable: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(DEMO_USER_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      logger.info('Running in POPCIX Demo Mode (Offline / Mock Auth ready)');
      setProfile(DEMO_USER_PROFILE);
      setIsLoading(false);
      return;
    }

    // 1. Get initial active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        logger.info(`Auth event triggered: ${event}`);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Failed to fetch user profile metadata', { code: error.code });
        setProfile(DEMO_USER_PROFILE);
      } else if (data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback default profile
        setProfile({
          ...DEMO_USER_PROFILE,
          auth_user_id: authUserId,
          email: user?.email || DEMO_USER_PROFILE.email,
        });
      }
    } catch (err) {
      setProfile(DEMO_USER_PROFILE);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isDemoMode) {
      // Offline instant validation for quick testing
      if (!email.includes('@')) {
        return { error: 'Please enter a valid email address.' };
      }
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
      }
      setProfile({
        ...DEMO_USER_PROFILE,
        email,
        name: email.split('@')[0].toUpperCase(),
      });
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: 'An unexpected authentication error occurred.' };
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string): Promise<{ error: string | null }> => {
    if (isDemoMode) {
      if (!email.includes('@')) return { error: 'Please enter a valid email address.' };
      if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
      setProfile({
        ...DEMO_USER_PROFILE,
        email,
        name,
        reward_points: 200, // Welcome bonus
        level: 1,
        streak: 1,
      });
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Create matching public profile
        await supabase.from('profiles').insert({
          auth_user_id: data.user.id,
          name,
          email,
          reward_points: 200,
          xp_points: 150,
          level: 1,
          streak: 1,
        });
      }

      return { error: null };
    } catch (err) {
      return { error: 'Failed to create account.' };
    }
  };

  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    if (isDemoMode) {
      setProfile({
        ...DEMO_USER_PROFILE,
        name: 'Google User',
        email: 'user.google@example.com',
      });
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'Failed to initialize Google OAuth.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (isDemoMode) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'Failed to send password reset email.' };
    }
  };

  const signOut = async () => {
    if (!isDemoMode && isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const toggleDemoMode = (enable: boolean) => {
    setIsDemoMode(enable);
    if (enable) {
      setProfile(DEMO_USER_PROFILE);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isDemoMode,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        signOut,
        updateProfile,
        toggleDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
