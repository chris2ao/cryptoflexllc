/**
 * IP-based rate limiting utility
 * Uses in-memory sliding window approach with automatic cleanup
 */

import { NextRequest } from "next/server";

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
  checkRateLimit(ip: string): RateLimitResult;
  store: Map<string, number[]>;
}

/**
 * Creates a rate limiter with sliding window tracking
 */
export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const { windowMs, maxRequests } = options;
  const store = new Map<string, number[]>();

  /**
   * Removes expired timestamps from all stored IPs
   */
  function cleanup(): void {
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
   * Checks if the IP is allowed to make a request
   */
  function checkRateLimit(ip: string): RateLimitResult {
    cleanup();

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
