import { supabase } from './supabase';

interface RateLimitEntry {
  ip: string;
  attempts: number;
  first_attempt: number;
  locked_until?: number;
}

// In-memory store (for development/single-server)
// In production, use Redis for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const INITIAL_LOCKOUT = 15 * 60 * 1000; // 15 minutes
const ESCALATION_MULTIPLIER = 2; // Double lockout each violation

/**
 * Check if IP is currently locked out
 */
export function isIPLocked(ip: string): { locked: boolean; remainingSeconds: number } {
  const entry = rateLimitStore.get(ip);

  if (!entry || !entry.locked_until) {
    return { locked: false, remainingSeconds: 0 };
  }

  const now = Date.now();
  const remaining = entry.locked_until - now;

  if (remaining <= 0) {
    // Lockout expired
    rateLimitStore.delete(ip);
    return { locked: false, remainingSeconds: 0 };
  }

  return { locked: true, remainingSeconds: Math.ceil(remaining / 1000) };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string): {
  remaining: number;
  locked: boolean;
  lockoutDuration: number;
} {
  const now = Date.now();
  let entry = rateLimitStore.get(ip);

  if (!entry) {
    // First attempt from this IP
    entry = {
      ip,
      attempts: 1,
      first_attempt: now,
    };
    rateLimitStore.set(ip, entry);

    return {
      remaining: MAX_ATTEMPTS - 1,
      locked: false,
      lockoutDuration: 0,
    };
  }

  // Check if window has expired
  if (now - entry.first_attempt > WINDOW_DURATION) {
    // Reset attempts
    entry.attempts = 1;
    entry.first_attempt = now;
    delete entry.locked_until;

    return {
      remaining: MAX_ATTEMPTS - 1,
      locked: false,
      lockoutDuration: 0,
    };
  }

  // Increment attempts
  entry.attempts += 1;

  if (entry.attempts >= MAX_ATTEMPTS) {
    // Calculate lockout duration (escalating)
    const previousLockouts = entry.attempts - MAX_ATTEMPTS;
    const lockoutDuration = INITIAL_LOCKOUT * Math.pow(ESCALATION_MULTIPLIER, previousLockouts);
    entry.locked_until = now + lockoutDuration;

    logRateLimitEvent(ip, 'LOCKED', { attempts: entry.attempts });

    return {
      remaining: 0,
      locked: true,
      lockoutDuration: Math.ceil(lockoutDuration / 1000),
    };
  }

  return {
    remaining: MAX_ATTEMPTS - entry.attempts,
    locked: false,
    lockoutDuration: 0,
  };
}

/**
 * Reset rate limit for an IP (successful login)
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
  logRateLimitEvent(ip, 'RESET', {});
}

/**
 * Get rate limit status for an IP
 */
export function getRateLimitStatus(ip: string): RateLimitEntry | null {
  return rateLimitStore.get(ip) || null;
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [ip, entry] of rateLimitStore.entries()) {
    // Remove if no activity in last 24 hours
    if (now - entry.first_attempt > 24 * 60 * 60 * 1000) {
      rateLimitStore.delete(ip);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`✅ Cleaned up ${cleanedCount} expired rate limit entries`);
  }
}

/**
 * Log rate limit events for audit trail
 */
async function logRateLimitEvent(
  ip: string,
  event: string,
  details: object
): Promise<void> {
  try {
    await supabase.from('rate_limit_events').insert({
      ip_address: ip,
      event_type: event,
      details,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging rate limit event:', error);
  }
}

/**
 * Get all rate limit violations (for security dashboard)
 */
export async function getRateLimitViolations(limit: number = 100): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('rate_limit_events')
      .select('*')
      .eq('event_type', 'LOCKED')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching rate limit violations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching rate limit violations:', error);
    return [];
  }
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStats(): {
  totalIPs: number;
  lockedIPs: number;
  activeAttempts: number;
} {
  let lockedCount = 0;
  let activeCount = 0;

  const now = Date.now();

  for (const entry of rateLimitStore.values()) {
    if (entry.locked_until && entry.locked_until > now) {
      lockedCount++;
    }
    if (now - entry.first_attempt < WINDOW_DURATION) {
      activeCount++;
    }
  }

  return {
    totalIPs: rateLimitStore.size,
    lockedIPs: lockedCount,
    activeAttempts: activeCount,
  };
}

// Run cleanup every hour
if (typeof window === 'undefined') {
  setInterval(() => {
    cleanupRateLimitStore();
  }, 60 * 60 * 1000);
}
