/**
 * Integration tests for POST /api/analytics/track
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");

describe("POST /api/analytics/track", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb, parseBrowser, parseOS, parseDeviceType } = await import(
      "@/lib/analytics"
    );
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);
    vi.mocked(parseBrowser).mockImplementation((ua: string) =>
      ua.includes("Chrome") ? "Chrome" : "Unknown"
    );
    vi.mocked(parseOS).mockImplementation((ua: string) =>
      ua.includes("Windows") ? "Windows" : "Unknown"
    );
    vi.mocked(parseDeviceType).mockImplementation(() => "Desktop");
  });

  it("should track a page view with full metadata", async () => {
    mockSql.mockResolvedValueOnce([]); // No existing visit (rate limit check)
    mockSql.mockResolvedValueOnce([]); // Insert succeeds

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/blog/test-post" }),
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.1, 198.51.100.1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        referer: "https://google.com/search",
        "x-vercel-ip-country": "United%20States",
        "x-vercel-ip-city": "San%20Francisco",
        "x-vercel-ip-country-region": "California",
        "x-vercel-ip-latitude": "37.7749",
        "x-vercel-ip-longitude": "-122.4194",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");

    expect(mockSql).toHaveBeenCalledTimes(2);

    // First call: rate limit check
    const rateLimitCall = mockSql.mock.calls[0];
    expect(rateLimitCall[1]).toBe("203.0.113.1");
    expect(rateLimitCall[2]).toBe("/blog/test-post");

    // Second call: insert with all fields
    const insertCall = mockSql.mock.calls[1];
    expect(insertCall[1]).toBe("/blog/test-post");
    expect(insertCall[2]).toBe("203.0.113.1");
    expect(insertCall[3]).toContain("Chrome"); // user_agent
    expect(insertCall[4]).toContain("Chrome"); // browser
    expect(insertCall[5]).toContain("Windows"); // os
    expect(insertCall[6]).toBe("Desktop"); // device_type
    expect(insertCall[7]).toBe("https://google.com/search"); // referrer
    expect(insertCall[8]).toBe("United States"); // country
    expect(insertCall[9]).toBe("San Francisco"); // city
    expect(insertCall[10]).toBe("California"); // region
    expect(insertCall[11]).toBe("37.7749"); // latitude
    expect(insertCall[12]).toBe("-122.4194"); // longitude
  });

  it("should default path to / when not provided", async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });

    await POST(request);

    // Verify path defaults to /
    const insertCall = mockSql.mock.calls[1];
    expect(insertCall[1]).toBe("/");
  });

  it("should return 400 for invalid path (not starting with /)", async () => {
    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "blog/test" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid path");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 for path exceeding 500 characters", async () => {
    const longPath = "/" + "a".repeat(500);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: longPath }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid path");
  });

  it("should return 400 for non-string path", async () => {
    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: 123 }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid path");
  });

  it("should extract first IP from x-forwarded-for", async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/test" }),
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.1, 198.51.100.1, 192.0.2.1",
      },
    });

    await POST(request);

    // Verify first IP from x-forwarded-for is used
    const rateLimitCall = mockSql.mock.calls[0];
    expect(rateLimitCall[1]).toBe("203.0.113.1");
    expect(rateLimitCall[2]).toBe("/test");
  });

  it("should fallback to x-real-ip when x-forwarded-for is missing", async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/test" }),
      headers: {
        "content-type": "application/json",
        "x-real-ip": "198.51.100.1",
      },
    });

    await POST(request);

    // Verify x-real-ip is used as fallback
    const rateLimitCall = mockSql.mock.calls[0];
    expect(rateLimitCall[1]).toBe("198.51.100.1");
    expect(rateLimitCall[2]).toBe("/test");
  });

  it("should default IP to 127.0.0.1 when no IP headers present", async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/test" }),
      headers: { "content-type": "application/json" },
    });

    await POST(request);

    // Verify IP defaults to 127.0.0.1
    const insertCall = mockSql.mock.calls[1];
    expect(insertCall[2]).toBe("127.0.0.1");
  });

  it("should default referrer to (direct) when missing", async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/test" }),
      headers: { "content-type": "application/json" },
    });

    await POST(request);

    // Verify referrer defaults to (direct)
    const insertCall = mockSql.mock.calls[1];
    expect(insertCall[7]).toBe("(direct)");
  });

  it("should decode URL-encoded geo headers", async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/test" }),
      headers: {
        "content-type": "application/json",
        "x-vercel-ip-country": "S%C3%A3o%20Paulo",
        "x-vercel-ip-city": "Rio%20de%20Janeiro",
      },
    });

    await POST(request);

    // Verify geo headers are decoded
    const insertCall = mockSql.mock.calls[1];
    expect(insertCall[8]).toBe("São Paulo");
    expect(insertCall[9]).toBe("Rio de Janeiro");
  });

  it("should return 204 without inserting when rate limit is hit", async () => {
    // Rate limit check finds existing visit
    mockSql.mockResolvedValueOnce([{ exists: 1 }]);

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/test" }),
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.1",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(204);

    // Should only call once for rate limit check, not insert
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("should return 500 when database query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ path: "/test" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to record visit");
  });

  it("should handle malformed JSON body", async () => {
    const request = new NextRequest("http://localhost/api/analytics/track", {
      method: "POST",
      body: "not-valid-json",
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to record visit");
  });
});
