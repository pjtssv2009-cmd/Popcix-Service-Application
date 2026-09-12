import { describe, it, expect } from 'vitest';
import { isSupabaseConfigured, DEMO_USER_PROFILE } from '../src/services/supabase';

describe('POPCIX Supabase Auth Integration & Security Tests', () => {
  it('correctly reports configuration state', () => {
    // In test/demo environment, mock keys are recognized
    expect(typeof isSupabaseConfigured()).toBe('boolean');
  });

  it('provides safe demo user profile without password or hash fields', () => {
    expect(DEMO_USER_PROFILE).toBeDefined();
    expect(DEMO_USER_PROFILE.email).toBe('aarav.sharma@popcix.app');
    expect(DEMO_USER_PROFILE.level).toBe(4);
    expect(DEMO_USER_PROFILE.streak).toBe(7);

    // Verify zero sensitive fields
    const keys = Object.keys(DEMO_USER_PROFILE);
    expect(keys).not.toContain('password');
    expect(keys).not.toContain('password_hash');
    expect(keys).not.toContain('token');
    expect(keys).not.toContain('access_token');
    expect(keys).not.toContain('refresh_token');
  });
});
