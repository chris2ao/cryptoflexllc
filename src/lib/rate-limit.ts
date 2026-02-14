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
  windowMs: number;
  maxRequests: number;
}

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
  const { windowMs, maxRequests } = options;
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
      // On error, fail open (allow the request) to prevent service disruption
      return {
        allowed: true,
        remaining: maxRequests,
      };
    }
  }

  /**
   * Checks if the IP is allowed to make a request
   * Uses database if DATABASE_URL is set, otherwise falls back to in-memory
   */
  async function checkRateLimit(ip: string): Promise<RateLimitResult> {
    // Check if database is available
    const hasDatabase = !!process.env.DATABASE_URL;

    if (!hasDatabase) {
      // Fallback to in-memory for development
      return checkRateLimitMemory(ip);
    }

    // Use database-backed rate limiting
    try {
      const { getDb } = await import("@/lib/analytics");
      const sql = getDb();
      return await checkRateLimitDb(ip, sql);
    } catch (error) {
      console.error("Database rate limit error, falling back to memory:", error);
      return checkRateLimitMemory(ip);
    }
  }

  return { checkRateLimit, store };
}

/**
 * Extracts client IP from request headers
 * Consistent with existing pattern in subscribe/route.ts
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "";
}
