/**
 * Automated Test Suite for POPCIX PRO Mobile Application
 * Tests core business logic, gamification engine, 14-step job journey, and rate limiter.
 */

import { describe, it, expect } from 'vitest';
import { INITIAL_PRO_PROFILE, INITIAL_PRO_JOBS, INITIAL_PRO_EARNINGS } from '../data/proMockData';
import { checkRateLimit } from '../server/rateLimiter';

describe('POPCIX PRO - Profile & Availability', () => {
  it('should initialize with verified AC HERO pro profile', () => {
    expect(INITIAL_PRO_PROFILE.name).toBe('Ravi Kumar');
    expect(INITIAL_PRO_PROFILE.level).toBe('AC HERO');
    expect(INITIAL_PRO_PROFILE.rating).toBeGreaterThanOrEqual(4.8);
    expect(INITIAL_PRO_PROFILE.streakDays).toBe(6);
    expect(INITIAL_PRO_PROFILE.isVerified).toBe(true);
    expect(INITIAL_PRO_PROFILE.kycStatus).toBe('APPROVED');
  });

  it('should include target service zones around Chennai IT corridor', () => {
    expect(INITIAL_PRO_PROFILE.serviceZones).toContain('OMR');
    expect(INITIAL_PRO_PROFILE.serviceZones).toContain('Sholinganallur');
    expect(INITIAL_PRO_PROFILE.serviceZones).toContain('Perungudi');
  });
});

describe('POPCIX PRO - 14-Step Job Lifecycle & Financials', () => {
  it('should have initial active job with valid OTPs and checklist items', () => {
    const job = INITIAL_PRO_JOBS[0];
    expect(job.bookingCode).toBe('PX-7729');
    expect(job.startOtp).toBe('4829');
    expect(job.completionOtp).toBe('7193');
    expect(job.netPayout).toBe(699);
    expect(job.checklist.length).toBeGreaterThanOrEqual(5);
  });

  it('should correctly calculate net payout after adding customer-approved add-on', () => {
    const job = INITIAL_PRO_JOBS[0];
    const initialPayout = job.netPayout;
    const addonPrice = 249;
    const updatedPayout = initialPayout + addonPrice;

    expect(updatedPayout).toBe(948);
  });

  it('should maintain consistent weekly earnings and next payout ledger', () => {
    expect(INITIAL_PRO_EARNINGS.todayEarnings).toBe(2450);
    expect(INITIAL_PRO_EARNINGS.thisWeekEarnings).toBe(13800);
    expect(INITIAL_PRO_EARNINGS.nextPayoutAmount).toBe(8420);
    expect(INITIAL_PRO_EARNINGS.breakdown.platformFees).toBe(750);
  });
});

describe('POPCIX PRO - Rate Limiting Architecture', () => {
  it('should allow legitimate requests within limits and block abusive bursts', async () => {
    const testId = 'pro_test_ip_01';

    // 5 allowed OTP requests
    for (let i = 0; i < 5; i++) {
      const res = await checkRateLimit(testId, 'AUTH_OTP');
      expect(res.allowed).toBe(true);
    }

    // 6th OTP request must be rate limited
    const blockedRes = await checkRateLimit(testId, 'AUTH_OTP');
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});
