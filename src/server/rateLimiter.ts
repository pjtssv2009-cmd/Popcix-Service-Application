/**
 * POPCIX PRO & Backend API - Rate Limiting Architecture
 * Protects Authentication, OTP endpoints, Password resets, Referrals, and Job Actions.
 * Integrates with Upstash Redis or local in-memory fallback for rate limiting.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // e.g. 60_000 for 1 minute
}

// In-memory cache fallback for development and local testing
const inMemoryStore = new Map<string, { count: number; expiresAt: number }>();

export const RATE_LIMIT_RULES: Record<string, RateLimitConfig> = {
  AUTH_OTP: { maxRequests: 5, windowMs: 60 * 1000 },          // 5 OTPs per minute
  AUTH_PASSWORD_RESET: { maxRequests: 3, windowMs: 300 * 1000 }, // 3 resets per 5 min
  REFERRAL_CLAIM: { maxRequests: 5, windowMs: 60 * 1000 },     // 5 claims per minute
  JOB_DISPATCH_ACTION: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 actions per minute
  SUPPORT_TICKET_CREATE: { maxRequests: 5, windowMs: 300 * 1000 } // 5 tickets per 5 min
};

export async function checkRateLimit(
  identifier: string, // IP or User UUID
  actionType: keyof typeof RATE_LIMIT_RULES
): Promise<{ allowed: boolean; remaining: number; resetInMs: number }> {
  const rule = RATE_LIMIT_RULES[actionType] || { maxRequests: 60, windowMs: 60 * 1000 };
  const key = `ratelimit:${actionType}:${identifier}`;
  const now = Date.now();

  const record = inMemoryStore.get(key);

  if (!record || now > record.expiresAt) {
    inMemoryStore.set(key, {
      count: 1,
      expiresAt: now + rule.windowMs
    });
    return {
      allowed: true,
      remaining: rule.maxRequests - 1,
      resetInMs: rule.windowMs
    };
  }

  if (record.count >= rule.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.expiresAt - now)
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: rule.maxRequests - record.count,
    resetInMs: Math.max(0, record.expiresAt - now)
  };
}
