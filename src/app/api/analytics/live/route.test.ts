/**
 * Tests for GET /api/analytics/live
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { getDb } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ getDb: vi.fn() }));
vi.mock("@/lib/analytics-auth", () => ({
  verifyAuthToken: () => true,
  getAnalyticsCookieName: () => "analytics_session",
}));
vi.mock("@/lib/rate-limit", () => ({
  createRateLimiter: () => ({
    checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  }),
  getClientIp: () => "203.0.113.1",
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: "token" }) }),
}));

function makeRequest() {
  return new NextRequest("http://localhost/api/analytics/live");
}

function templateText(call: unknown[]): string {
  return (call[0] as string[]).join("?");
}

describe("GET /api/analytics/live", () => {
  let mockSql: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSql = vi.fn().mockResolvedValue([]);
    vi.mocked(getDb).mockReturnValue(mockSql as never);
  });

  it("reads subscribers by subscribed_at and client errors by recorded_at", async () => {
    await GET(makeRequest());
    const texts = mockSql.mock.calls.map(templateText);

    expect(texts.some((t) => t.includes("subscribed_at"))).toBe(true);
    expect(texts.some((t) => t.includes("created_at"))).toBe(false);
    expect(
      texts.some((t) => t.includes("error_message") && t.includes("recorded_at"))
    ).toBe(true);
    expect(texts.some((t) => t.includes("occurred_at"))).toBe(false);
  });

  it("tags bot hits and hides self hits", async () => {
    const now = Date.now();
    const iso = (offset: number) => new Date(now - offset).toISOString();
    const row = (offset: number, traffic_class: string | null) => ({
      visited_at: iso(offset),
      page_path: "/blog/x",
      country: null,
      device_type: null,
      browser: null,
      traffic_class,
    });
    mockSql.mockResolvedValueOnce([
      row(1000, "bot"),
      row(2000, "human"),
      row(3000, null),
    ]);

    const response = await GET(makeRequest());
    const data = await response.json();

    expect(data.events.map((e: { tag: string }) => e.tag)).toEqual([
      "bot",
      "hit",
      "hit",
    ]);
    expect(templateText(mockSql.mock.calls[0])).toContain(
      "IS DISTINCT FROM 'self'"
    );
  });

  it("returns an empty feed when the database is unavailable", async () => {
    vi.mocked(getDb).mockImplementation(() => {
      throw new Error("no db");
    });

    const response = await GET(makeRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events).toEqual([]);
  });
});
