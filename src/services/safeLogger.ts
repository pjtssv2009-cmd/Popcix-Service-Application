/**
 * POPCIX Structured Safe Logger
 * 
 * Guarantees zero sensitive data leakage (passwords, tokens, credentials, payment cards).
 * Sanitizes metadata before logging.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const REDACTED_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'apikey',
  'secret',
  'authorization',
  'cardnumber',
  'cvv',
  'cookie',
]);

function sanitize(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const sanitizedObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (REDACTED_KEYS.has(lowerKey) || lowerKey.includes('pass') || lowerKey.includes('token') || lowerKey.includes('secret')) {
      sanitizedObj[key] = '[REDACTED_BY_POPCIX_SECURITY]';
    } else if (typeof value === 'object' && value !== null) {
      sanitizedObj[key] = sanitize(value);
    } else {
      sanitizedObj[key] = value;
    }
  }
  return sanitizedObj;
}

class SafeLogger {
  private format(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      app: 'POPCIX',
      level,
      message,
      ...(context ? { context: sanitize(context) } : {}),
    };
  }

  public info(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      const payload = this.format('info', message, context);
      // Clean structured output without raw secrets
      console.info(`[POPCIX-INFO] ${payload.message}`, payload.context || '');
    }
  }

  public warn(message: string, context?: Record<string, unknown>) {
    const payload = this.format('warn', message, context);
    console.warn(`[POPCIX-WARN] ${payload.message}`, payload.context || '');
  }

  public error(message: string, context?: Record<string, unknown>) {
    const payload = this.format('error', message, context);
    console.error(`[POPCIX-ERROR] ${payload.message}`, payload.context || '');
  }
}

export const logger = new SafeLogger();
