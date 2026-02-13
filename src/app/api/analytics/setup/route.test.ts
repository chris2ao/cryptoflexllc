import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");

describe("GET /api/analytics/setup", () => {
  let mockSql: any;
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should return 403 when ANALYTICS_SETUP_ENABLED is not set", async () => {
    delete process.env.ANALYTICS_SETUP_ENABLED;

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/setup");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain("Setup endpoint is disabled");
  });

  it("should return 403 when ANALYTICS_SETUP_ENABLED is not 'true'", async () => {
    process.env.ANALYTICS_SETUP_ENABLED = "false";

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/setup");

    const response = await GET(request);

    expect(response.status).toBe(403);
  });

  it("should return 401 when not authenticated", async () => {
    process.env.ANALYTICS_SETUP_ENABLED = "true";

    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(false);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/setup");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should create tables and return success", async () => {
    process.env.ANALYTICS_SETUP_ENABLED = "true";

    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValue([]);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/setup");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Tables created successfully");
    expect(mockSql).toHaveBeenCalled();
  });

  it("should return 500 when database operation fails", async () => {
    process.env.ANALYTICS_SETUP_ENABLED = "true";

    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockRejectedValue(new Error("Table creation failed"));

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/setup");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("Setup failed");
  });
});
