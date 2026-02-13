import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");

describe("GET /api/analytics", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);
  });

  it("should return 401 when not authenticated", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(false);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return analytics data with default 30 days", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    // Mock all 9 parallel SQL queries (Promise.all)
    mockSql
      .mockResolvedValueOnce([{ total_views: 100, unique_visitors: 50 }])
      .mockResolvedValueOnce([{ page_path: "/", views: 50 }])
      .mockResolvedValueOnce([{ country: "US", views: 80 }])
      .mockResolvedValueOnce([{ browser: "Chrome", count: 40 }])
      .mockResolvedValueOnce([{ device_type: "Desktop", count: 70 }])
      .mockResolvedValueOnce([{ os: "Windows", count: 60 }])
      .mockResolvedValueOnce([{ id: 1, page_path: "/" }])
      .mockResolvedValueOnce([{ date: "2026-02-13", views: 10 }])
      .mockResolvedValueOnce([{ latitude: "37.7", longitude: "-122.4" }]);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.days).toBe(30);
    expect(data).toHaveProperty("summary");
    expect(data).toHaveProperty("top_pages");
    expect(data).toHaveProperty("top_countries");
    expect(data).toHaveProperty("browsers");
    expect(data).toHaveProperty("devices");
    expect(data).toHaveProperty("os_stats");
    expect(data).toHaveProperty("recent");
    expect(data).toHaveProperty("daily_views");
    expect(data).toHaveProperty("map_locations");

    expect(mockSql).toHaveBeenCalledTimes(9);
  });

  it("should clamp days parameter to valid range (1-365)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);
    mockSql.mockResolvedValue([]);

    const { GET } = await import("./route");

    // Test upper bound (500 should clamp to 365)
    const request1 = new NextRequest("http://localhost/api/analytics?days=500");
    const response1 = await GET(request1);
    const data1 = await response1.json();
    expect(data1.days).toBe(365);

    // Test lower bound (-5 should clamp to 1)
    const request2 = new NextRequest("http://localhost/api/analytics?days=-5");
    const response2 = await GET(request2);
    const data2 = await response2.json();
    expect(data2.days).toBe(1);
  });

  it("should handle NaN days parameter (defaults to 30)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);
    mockSql.mockResolvedValue([]);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics?days=invalid");

    const response = await GET(request);
    const data = await response.json();

    expect(data.days).toBe(30);
  });

  it("should return 500 when database query fails", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);
    mockSql.mockRejectedValue(new Error("Database connection failed"));

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch analytics");
  });
});
