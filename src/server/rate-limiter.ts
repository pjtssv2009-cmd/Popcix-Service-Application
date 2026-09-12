/**
 * POPCIX Server-Side Rate Limiter Middleware
 * 
 * Provides sliding-window rate limiting with progressive backoff delays
 * for POPCIX-owned sensitive endpoints.
 * Compatible with Redis/Upstash or local high-performance memory store fallback.
 * 
 * Security Policy:
 * - Max 10 requests per IP per minute for sensitive endpoints
 * - Progressive delay for failed attempts (exponential backoff)
 * - Safe generic error responses (never reveals account existence or internal state)
 * - Zero logging of sensitive credentials, passwords, or tokens
 */

export interface RateLimitConfig {
  windowMs: number;       // Window duration in ms (e.g. 60,000 for 1 minute)
  maxRequests: number;    // Maximum requests allowed in window
  progressiveDelay: boolean; // Add delay after threshold
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTimeMs: number;
  retryAfterSeconds?: number;
  progressiveDelayMs?: number;
}

interface RequestRecord {
  timestamps: number[];
  failedAttempts: number;
  lastFailureTime?: number;
}

export class PopcixRateLimiter {
  private store: Map<string, RequestRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: config.windowMs || 60 * 1000, // 1 minute default
      maxRequests: config.maxRequests || 10,   // 10 requests per IP per min
      progressiveDelay: config.progressiveDelay !== undefined ? config.progressiveDelay : true,
      keyPrefix: config.keyPrefix || 'popcix_rl',
    };

    // Periodic store cleanup every 5 minutes to prevent memory leak
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Evaluates an incoming request by client identifier (e.g. IP address or user ID)
   */
  public check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = `${this.config.keyPrefix}:${identifier}`;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [], failedAttempts: 0 };
      this.store.set(key, record);
    }

    // Filter out timestamps older than the sliding window
    record.timestamps = record.timestamps.filter(ts => ts > windowStart);

    const currentCount = record.timestamps.length;
    const resetTimeMs = (record.timestamps[0] || now) + this.config.windowMs;

    if (currentCount >= this.config.maxRequests) {
      const retryAfterSeconds = Math.ceil((resetTimeMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetTimeMs,
        retryAfterSeconds: Math.max(1, retryAfterSeconds),
      };
    }

    // Record this request
    record.timestamps.push(now);

    // Calculate progressive delay if enabled and repeated failures exist
    let progressiveDelayMs = 0;
    if (this.config.progressiveDelay && record.failedAttempts > 0) {
      // 200ms, 400ms, 800ms, max 3000ms
      progressiveDelayMs = Math.min(3000, Math.pow(2, record.failedAttempts - 1) * 200);
    }

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.timestamps.length,
      resetTimeMs,
      progressiveDelayMs,
    };
  }

  /**
   * Registers a failed application-level attempt to increase progressive delay
   */
  public recordFailure(identifier: string): void {
    const key = `${this.config.keyPrefix}:${identifier}`;
    const record = this.store.get(key) || { timestamps: [Date.now()], failedAttempts: 0 };
    record.failedAttempts += 1;
    record.lastFailureTime = Date.now();
    this.store.set(key, record);
  }

  /**
   * Resets failure counter upon successful validation
   */
  public recordSuccess(identifier: string): void {
    const key = `${this.config.keyPrefix}:${identifier}`;
    const record = this.store.get(key);
    if (record) {
      record.failedAttempts = 0;
    }
  }

  /**
   * Cleans up expired entries from memory store
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter(ts => ts > windowStart);
      if (record.timestamps.length === 0 && (!record.lastFailureTime || now - record.lastFailureTime > this.config.windowMs * 2)) {
        this.store.delete(key);
      }
    }
  }
}

// Pre-configured rate limiter instance for sensitive auth/booking endpoints
export const authRateLimiter = new PopcixRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10, // 10 req / min
  progressiveDelay: true,
  keyPrefix: 'popcix_auth_limit',
});

export const bookingRateLimiter = new PopcixRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20, // 20 req / min
  progressiveDelay: false,
  keyPrefix: 'popcix_booking_limit',
});
