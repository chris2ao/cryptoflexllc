/**
 * Tests for IP-based rate limiting utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRateLimiter, getClientIp } from "../rate-limit";
import { NextRequest } from "next/server";

describe("createRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("allows requests under limit", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 5 });

    const result1 = limiter.checkRateLimit("192.168.1.1");
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(4);

    const result2 = limiter.checkRateLimit("192.168.1.1");
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(3);
  });

  it("blocks requests over limit", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 3 });

    limiter.checkRateLimit("192.168.1.1");
    limiter.checkRateLimit("192.168.1.1");
    limiter.checkRateLimit("192.168.1.1");

    const blocked = limiter.checkRateLimit("192.168.1.1");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("window expiration resets the count", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 2 });

    limiter.checkRateLimit("192.168.1.1");
    limiter.checkRateLimit("192.168.1.1");

    const blocked = limiter.checkRateLimit("192.168.1.1");
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(61000);

    const allowed = limiter.checkRateLimit("192.168.1.1");
    expect(allowed.allowed).toBe(true);
    expect(allowed.remaining).toBe(1);
  });

  it("returns correct remaining count", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 10 });

    for (let i = 0; i < 7; i++) {
      const result = limiter.checkRateLimit("192.168.1.1");
      expect(result.remaining).toBe(10 - i - 1);
    }
  });

  it("cleanup removes expired entries", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 5 });

    limiter.checkRateLimit("192.168.1.1");
    limiter.checkRateLimit("192.168.1.2");
    limiter.checkRateLimit("192.168.1.3");

    vi.advanceTimersByTime(61000);

    limiter.checkRateLimit("192.168.1.4");

    const state = (limiter as any).store;
    expect(state.has("192.168.1.1")).toBe(false);
    expect(state.has("192.168.1.2")).toBe(false);
    expect(state.has("192.168.1.3")).toBe(false);
    expect(state.has("192.168.1.4")).toBe(true);
  });

  it("handles multiple IPs independently", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 2 });

    limiter.checkRateLimit("192.168.1.1");
    limiter.checkRateLimit("192.168.1.1");

    const blockedIP1 = limiter.checkRateLimit("192.168.1.1");
    expect(blockedIP1.allowed).toBe(false);

    const allowedIP2 = limiter.checkRateLimit("192.168.1.2");
    expect(allowedIP2.allowed).toBe(true);
    expect(allowedIP2.remaining).toBe(1);
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for (first IP)", () => {
    const req = new NextRequest("https://example.com", {
      headers: {
        "x-forwarded-for": "203.0.113.1, 198.51.100.1, 192.0.2.1",
      },
    });

    expect(getClientIp(req)).toBe("203.0.113.1");
  });

  it("extracts IP from x-real-ip when x-forwarded-for is missing", () => {
    const req = new NextRequest("https://example.com", {
      headers: {
        "x-real-ip": "198.51.100.42",
      },
    });

    expect(getClientIp(req)).toBe("198.51.100.42");
  });

  it("returns empty string when no IP headers present", () => {
    const req = new NextRequest("https://example.com");

    expect(getClientIp(req)).toBe("");
  });

  it("trims whitespace from x-forwarded-for", () => {
    const req = new NextRequest("https://example.com", {
      headers: {
        "x-forwarded-for": "  203.0.113.1  , 198.51.100.1",
      },
    });

    expect(getClientIp(req)).toBe("203.0.113.1");
  });
});
