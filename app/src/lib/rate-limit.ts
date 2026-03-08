/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses sliding-window style: per-IP limits. For production at scale, use Redis/KV.
 *
 * Limits based on OWASP and industry practice:
 * - Auth endpoints: 5–10 per 15 min (brute-force protection)
 * - General APIs: 60–100 per min
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL = 60 * 1000; // cleanup every minute

function getKey(ip: string, prefix: string): string {
  return `${prefix}:${ip}`;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function cleanup() {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (v.resetAt < now) store.delete(k);
  }
}

let cleanupTimer: ReturnType<typeof setInterval> | null = null;
function scheduleCleanup() {
  if (!cleanupTimer) {
    cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit. Returns { allowed, remaining, resetAt }.
 * If not allowed, caller should return 429 with Retry-After.
 */
export function checkRateLimit(
  request: Request,
  prefix: string,
  maxRequests: number,
  windowMs: number = WINDOW_MS
): RateLimitResult {
  scheduleCleanup();
  const ip = getClientIp(request);
  const key = getKey(ip, prefix);
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, remaining: maxRequests - 1, resetAt: entry.resetAt };
  }

  entry.count += 1;
  const allowed = entry.count <= maxRequests;
  return {
    allowed,
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

/** Rate limit configs per endpoint type. */
export const RATE_LIMITS = {
  /** Login: 5 per 15 min (OWASP brute-force protection) */
  login: { max: 5, windowMs: 15 * 60 * 1000 },
  /** Signup: 10 per 15 min */
  signup: { max: 10, windowMs: 15 * 60 * 1000 },
  /** Forgot password: 3 per hour per IP */
  forgotPassword: { max: 3, windowMs: 60 * 60 * 1000 },
  /** Reset password: 5 per 15 min */
  resetPassword: { max: 5, windowMs: 15 * 60 * 1000 },
  /** Google auth: 10 per 15 min */
  googleAuth: { max: 10, windowMs: 15 * 60 * 1000 },
  /** Check email: 20 per 15 min */
  checkEmail: { max: 20, windowMs: 15 * 60 * 1000 },
  /** Geocode: 30 per min (Nominatim-friendly) */
  geocode: { max: 30, windowMs: 60 * 1000 },
  /** Internships/jobs: 60 per min */
  internships: { max: 60, windowMs: 60 * 1000 },
  /** Resume extract: 10 per 15 min (expensive) */
  resumeExtract: { max: 10, windowMs: 15 * 60 * 1000 },
} as const;
