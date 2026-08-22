/**
 * Integration tests for GET /api/gmail/unsubscribe/panel
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");
vi.mock("@/lib/rate-limit");

function makeRequest() {
  return new NextRequest("http://localhost/api/gmail/unsubscribe/panel", {
    headers: { cookie: "analytics_session=test" },
  });
}

describe("GET /api/gmail/unsubscribe/panel", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn().mockResolvedValue([]);
    vi.mocked(getDb).mockReturnValue(mockSql);

    const { createRateLimiter, getClientIp } = await import("@/lib/rate-limit");
    vi.mocked(createRateLimiter).mockReturnValue({
      checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 9 }),
      store: new Map(),
    });
    vi.mocked(getClientIp).mockReturnValue("127.0.0.1");

    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);
  });

  it("returns 401 without the cookie", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(false);

    const { GET } = await import("./route");
    const response = await GET(makeRequest());
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 429 when the rate limiter denies", async () => {
    const { createRateLimiter } = await import("@/lib/rate-limit");
    vi.mocked(createRateLimiter).mockReturnValue({
      checkRateLimit: vi
        .fn()
        .mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 8 }),
      store: new Map(),
    });

    const { GET } = await import("./route");
    const response = await GET(makeRequest());

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("8");
  });

  it("returns 503 when the unsubscribe tables are not set up", async () => {
    mockSql.mockRejectedValueOnce({ code: "42P01" });

    const { GET } = await import("./route");
    const response = await GET(makeRequest());
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe("Unsubscribe tables not set up");
  });

  it("returns PanelData on success", async () => {
    mockSql
      .mockResolvedValueOnce([]) // candidates
      .mockResolvedValueOnce([]) // decisions
      .mockResolvedValueOnce([]); // attempts

    const { GET } = await import("./route");
    const response = await GET(makeRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.rows).toEqual([]);
    expect(data.summary).toMatchObject({ pending: 0, approved: 0, allowed: 0, target: 0.8 });
    expect(typeof data.generated_at).toBe("string");
  });

  it("sets Cache-Control: no-store on success", async () => {
    mockSql
      .mockResolvedValueOnce([]) // candidates
      .mockResolvedValueOnce([]) // decisions
      .mockResolvedValueOnce([]); // attempts

    const { GET } = await import("./route");
    const response = await GET(makeRequest());

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("returns 500 when the loader throws an unexpected error", async () => {
    mockSql.mockRejectedValueOnce(new Error("connection reset"));

    const { GET } = await import("./route");
    const response = await GET(makeRequest());
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal error");
  });
});
