import { describe, it, expect, beforeEach } from 'vitest';
import { PopcixRateLimiter } from '../src/server/rate-limiter';

describe('POPCIX Rate Limiter Middleware Tests', () => {
  let limiter: PopcixRateLimiter;

  beforeEach(() => {
    limiter = new PopcixRateLimiter({
      windowMs: 1000, // 1 sec window for fast unit testing
      maxRequests: 3,  // 3 requests allowed
      progressiveDelay: true,
      keyPrefix: 'test_limit',
    });
  });

  it('allows requests below threshold', () => {
    const ip = '192.168.1.100';
    const r1 = limiter.check(ip);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = limiter.check(ip);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = limiter.check(ip);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks requests when threshold is exceeded', () => {
    const ip = '192.168.1.101';
    limiter.check(ip);
    limiter.check(ip);
    limiter.check(ip);

    const r4 = limiter.check(ip);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  it('applies progressive backoff delay on repeated failures', () => {
    const ip = '192.168.1.102';
    limiter.recordFailure(ip);
    limiter.recordFailure(ip);

    const check = limiter.check(ip);
    expect(check.allowed).toBe(true);
    expect(check.progressiveDelayMs).toBeGreaterThan(0);
  });
});
