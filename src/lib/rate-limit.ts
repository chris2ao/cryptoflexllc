/**
 * IP-based rate limiting utility
 * Uses database-backed sliding window approach for serverless environments
 *
 * Required table (run once via setup endpoint):
 * CREATE TABLE IF NOT EXISTS rate_limits (
 *   key TEXT NOT NULL,
 *   window_start BIGINT NOT NULL,
 *   count INTEGER NOT NULL DEFAULT 1,
 *   PRIMARY KEY (key, window_start)
 * );
 * CREATE INDEX IF NOT EXISTS idx_rate_limits_expiry ON rate_limits (window_start);
 */

import { NextRequest } from "next/server";
import type { NeonQueryFunction } from "@neondatabase/serverless";

interface RateLimitOptions {
  // Unique namespace for this limiter's keys. Without it, every limiter sharing
  // a window size collided on the same (key, window_start) row, so the
  // documented per-endpoint limits did not actually hold (F-M9).
  name: string;
  windowMs: number;
  maxRequests: number;
}

// IPv6 max is 45 characters; anything longer is malformed or spoofed and would
// bloat the rate_limits key column or overflow the analytics VARCHAR(45)
// ip_address column, turning inserts into 500s (F-M15).
const MAX_IP_LENGTH = 45;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

interface RateLimiter {
  checkRateLimit(ip: string): Promise<RateLimitResult>;
  store: Map<string, number[]>; // Only used for in-memory fallback
}

/**
 * Creates a database-backed rate limiter with sliding window tracking
 * Falls back to in-memory storage if DATABASE_URL is not set
 */
export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const { name, windowMs, maxRequests } = options;
  const store = new Map<string, number[]>();

  /**
   * In-memory cleanup (only used for fallback mode)
   */
  function cleanupMemory(): void {
    const now = Date.now();
    const cutoff = now - windowMs;

    for (const [ip, timestamps] of store.entries()) {
      const validTimestamps = timestamps.filter((t) => t > cutoff);

      if (validTimestamps.length === 0) {
        store.delete(ip);
      } else {
        store.set(ip, validTimestamps);
      }
    }
  }

  /**
   * In-memory rate limit check (fallback for development)
   */
  function checkRateLimitMemory(ip: string): RateLimitResult {
    cleanupMemory();

    const now = Date.now();
    const cutoff = now - windowMs;

    const timestamps = store.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => t > cutoff);

    if (validTimestamps.length >= maxRequests) {
      const oldestTimestamp = Math.min(...validTimestamps);
      const retryAfter = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

      return {
        allowed: false,
        remaining: 0,
        retryAfter,
      };
    }

    validTimestamps.push(now);
    store.set(ip, validTimestamps);

    return {
      allowed: true,
      remaining: maxRequests - validTimestamps.length,
    };
  }

  /**
   * Database-backed rate limit check
   */
  async function checkRateLimitDb(
    ip: string,
    sql: NeonQueryFunction<false, false>
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;

    // Periodic cleanup: delete windows older than 2 windows ago
    const oldWindowCutoff = windowStart - windowMs * 2;
    try {
      await sql`
        DELETE FROM rate_limits
        WHERE window_start < ${oldWindowCutoff}
      `;
    } catch (error) {
      console.error("Rate limit cleanup error:", error);
      // Continue even if cleanup fails
    }

    // Increment or insert the current window count
    try {
      const result = await sql`
        INSERT INTO rate_limits (key, window_start, count)
        VALUES (${ip}, ${windowStart}, 1)
        ON CONFLICT (key, window_start)
        DO UPDATE SET count = rate_limits.count + 1
        RETURNING count
      `;

      const currentCount = result[0]?.count ?? 1;

      if (currentCount > maxRequests) {
        const retryAfter = Math.ceil((windowStart + windowMs - now) / 1000);
        return {
          allowed: false,
          remaining: 0,
          retryAfter,
        };
      }

      return {
        allowed: true,
        remaining: maxRequests - currentCount,
      };
    } catch (error) {
      console.error("Rate limit check error:", error);
      // On DB error, fall back to in-memory rate limiting rather than failing open
      return checkRateLimitMemory(ip);
    }
  }

  /**
   * Checks if the IP is allowed to make a request
   * Uses database if DATABASE_URL is set, otherwise falls back to in-memory
   */
  async function checkRateLimit(ip: string): Promise<RateLimitResult> {
    // Namespace the key so this limiter cannot collide with another that shares
    // a window size (F-M9).
    const key = `${name}:${ip}`;

    // Check if database is available
    const hasDatabase = !!process.env.DATABASE_URL;

    if (!hasDatabase) {
      // Fallback to in-memory for development
      return checkRateLimitMemory(key);
    }

    // Use database-backed rate limiting
    try {
      const { getDb } = await import("@/lib/analytics");
      const sql = getDb();
      return await checkRateLimitDb(key, sql);
    } catch (error) {
      console.error("Database rate limit error, falling back to memory:", error);
      return checkRateLimitMemory(key);
    }
  }

  return { checkRateLimit, store };
}

/**
 * Extracts client IP from request headers
 * Consistent with existing pattern in subscribe/route.ts
 */
/**
 * Best-effort client IP for rate limiting.
 *
 * The left-most X-Forwarded-For entry is client-supplied and trivially spoofed
 * (the platform appends rather than replaces), which previously let an attacker
 * rotate a fake IP to defeat every per-IP limit and poison the auth audit log
 * (F-H3). Prefer Vercel's trusted headers, then fall back to the right-most XFF
 * hop (appended by the platform, not the client claim). The result is trimmed
 * and length-capped so a malformed value cannot poison the rate_limits table or
 * overflow the analytics ip_address column (F-M15).
 *
 * Deploy note: validate the real header chain at the origin (a live header dump)
 * and roll out log-only before relying on this — see the remediation plan.
 */
export function getClientIp(request: NextRequest): string {
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) return normalizeIp(vercelForwarded.split(",")[0]);

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return normalizeIp(realIp);

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",");
    return normalizeIp(parts[parts.length - 1]);
  }

  return "";
}

function normalizeIp(value: string): string {
  return value.trim().slice(0, MAX_IP_LENGTH);
}
