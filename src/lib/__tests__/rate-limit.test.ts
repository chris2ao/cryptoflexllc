/**
 * Tests for IP-based rate limiting utility
 */

import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { createRateLimiter, getClientIp } from "../rate-limit";
import { NextRequest } from "next/server";
import type { NeonQueryFunction } from "@neondatabase/serverless";

describe("createRateLimiter (in-memory fallback)", () => {
  beforeEach(() => {
    // Ensure DATABASE_URL is not set for in-memory tests
    delete process.env.DATABASE_URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("allows requests under limit", async () => {
    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 5 });

    const result1 = await limiter.checkRateLimit("192.168.1.1");
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(4);

    const result2 = await limiter.checkRateLimit("192.168.1.1");
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(3);
  });

  it("blocks requests over limit", async () => {
    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 3 });

    await limiter.checkRateLimit("192.168.1.1");
    await limiter.checkRateLimit("192.168.1.1");
    await limiter.checkRateLimit("192.168.1.1");

    const blocked = await limiter.checkRateLimit("192.168.1.1");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("window expiration resets the count", async () => {
    vi.useFakeTimers();

    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 2 });

    await limiter.checkRateLimit("192.168.1.1");
    await limiter.checkRateLimit("192.168.1.1");

    const blocked = await limiter.checkRateLimit("192.168.1.1");
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(61000);

    const allowed = await limiter.checkRateLimit("192.168.1.1");
    expect(allowed.allowed).toBe(true);
    expect(allowed.remaining).toBe(1);

    vi.useRealTimers();
  });

  it("returns correct remaining count", async () => {
    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 10 });

    for (let i = 0; i < 7; i++) {
      const result = await limiter.checkRateLimit("192.168.1.1");
      expect(result.remaining).toBe(10 - i - 1);
    }
  });

  it("cleanup removes expired entries", async () => {
    vi.useFakeTimers();

    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 5 });

    await limiter.checkRateLimit("192.168.1.1");
    await limiter.checkRateLimit("192.168.1.2");
    await limiter.checkRateLimit("192.168.1.3");

    vi.advanceTimersByTime(61000);

    await limiter.checkRateLimit("192.168.1.4");

    // Keys are namespaced with the limiter name (F-M9).
    const state = limiter.store;
    expect(state.has("test:192.168.1.1")).toBe(false);
    expect(state.has("test:192.168.1.2")).toBe(false);
    expect(state.has("test:192.168.1.3")).toBe(false);
    expect(state.has("test:192.168.1.4")).toBe(true);

    vi.useRealTimers();
  });

  it("handles multiple IPs independently", async () => {
    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 2 });

    await limiter.checkRateLimit("192.168.1.1");
    await limiter.checkRateLimit("192.168.1.1");

    const blockedIP1 = await limiter.checkRateLimit("192.168.1.1");
    expect(blockedIP1.allowed).toBe(false);

    const allowedIP2 = await limiter.checkRateLimit("192.168.1.2");
    expect(allowedIP2.allowed).toBe(true);
    expect(allowedIP2.remaining).toBe(1);
  });

  it("namespaces keys so two limiters do not collide (F-M9)", async () => {
    const a = createRateLimiter({ name: "alpha", windowMs: 60000, maxRequests: 1 });
    const b = createRateLimiter({ name: "beta", windowMs: 60000, maxRequests: 1 });

    const first = await a.checkRateLimit("192.168.1.1");
    expect(first.allowed).toBe(true);

    // Same IP on a different limiter is not affected by the first.
    const other = await b.checkRateLimit("192.168.1.1");
    expect(other.allowed).toBe(true);
  });
});

describe("createRateLimiter (database-backed)", () => {
  let mockSql: Mock<NeonQueryFunction<false, false>>;

  beforeEach(() => {
    // Set DATABASE_URL to enable database mode
    process.env.DATABASE_URL = "postgresql://test:test@localhost/test";

    // Mock the getDb function
    mockSql = vi.fn<NeonQueryFunction<false, false>>();
    vi.doMock("@/lib/analytics", () => ({
      getDb: () => mockSql,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock("@/lib/analytics");
    delete process.env.DATABASE_URL;
  });

  it("allows requests under limit (database)", async () => {
    // Mock DELETE (cleanup) and INSERT responses
    mockSql.mockResolvedValueOnce([]); // DELETE
    mockSql.mockResolvedValueOnce([{ count: 1 }]); // INSERT first request

    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 5 });

    const result = await limiter.checkRateLimit("192.168.1.1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests over limit (database)", async () => {
    // Mock DELETE (cleanup) and INSERT with count exceeding limit
    mockSql.mockResolvedValueOnce([]); // DELETE
    mockSql.mockResolvedValueOnce([{ count: 6 }]); // INSERT with count > maxRequests

    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 5 });

    const result = await limiter.checkRateLimit("192.168.1.1");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("increments count on subsequent requests (database)", async () => {
    // Mock DELETE (cleanup) and INSERT with increasing counts
    mockSql.mockResolvedValueOnce([]); // DELETE
    mockSql.mockResolvedValueOnce([{ count: 2 }]); // Second request

    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 5 });

    const result = await limiter.checkRateLimit("192.168.1.1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(3);
  });

  it("falls back to in-memory rate limiting on database error (database)", async () => {
    // Mock database error on DELETE (cleanup step)
    mockSql.mockRejectedValueOnce(new Error("Database connection failed"));

    const limiter = createRateLimiter({ name: "test", windowMs: 60000, maxRequests: 5 });

    const result = await limiter.checkRateLimit("192.168.1.1");
    // Should fall back to in-memory and allow the first request, recording it
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });
});

describe("getClientIp", () => {
  it("prefers the Vercel-trusted x-vercel-forwarded-for header (F-H3)", () => {
    const req = new NextRequest("https://example.com", {
      headers: {
        // Attacker-spoofable client XFF is present but must be ignored.
        "x-forwarded-for": "1.2.3.4",
        "x-real-ip": "198.51.100.9",
        "x-vercel-forwarded-for": "203.0.113.7",
      },
    });

    expect(getClientIp(req)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip when the Vercel header is absent", () => {
    const req = new NextRequest("https://example.com", {
      headers: {
        "x-forwarded-for": "1.2.3.4",
        "x-real-ip": "198.51.100.42",
      },
    });

    expect(getClientIp(req)).toBe("198.51.100.42");
  });

  it("uses the RIGHT-most x-forwarded-for hop when only XFF is present (not the spoofable left)", () => {
    const req = new NextRequest("https://example.com", {
      headers: {
        // Left-most is the client claim; the platform-appended right-most is trusted.
        "x-forwarded-for": "1.2.3.4, 198.51.100.1, 203.0.113.9",
      },
    });

    expect(getClientIp(req)).toBe("203.0.113.9");
  });

  it("returns empty string when no IP headers present", () => {
    const req = new NextRequest("https://example.com");
    expect(getClientIp(req)).toBe("");
  });

  it("length-caps a malformed oversized IP value (F-M15)", () => {
    const oversized = "a".repeat(200);
    const req = new NextRequest("https://example.com", {
      headers: { "x-real-ip": oversized },
    });

    expect(getClientIp(req).length).toBeLessThanOrEqual(45);
  });
});
