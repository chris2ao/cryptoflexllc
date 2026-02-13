import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");

describe("GET /api/analytics/ip-intel", () => {
  let mockSql: any;
  const originalFetch = global.fetch;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);

    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should return 401 when not authenticated", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(false);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=8.8.8.8");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 when IP is missing", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid IP address");
  });

  it("should return 400 when IP format is invalid", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=not-an-ip!");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid IP address");
  });

  it("should return 400 for private IPs (127.0.0.1)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=127.0.0.1");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Private IP addresses are not supported");
  });

  it("should return 400 for private IPs (10.x)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=10.0.0.1");

    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it("should return 400 for private IPs (172.16.x)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=172.16.0.1");

    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it("should return 400 for private IPs (192.168.x)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=192.168.1.1");

    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it("should return 400 for IPv6 loopback (::1)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=::1");

    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it("should return cached result when available", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const cachedRow = {
      ip_address: "8.8.8.8",
      isp: "Google LLC",
      org: "Google Public DNS",
      country: "United States",
      city: "Mountain View",
      cached_at: "2026-02-13T00:00:00Z",
    };

    // First SQL call returns cached result
    mockSql.mockResolvedValueOnce([cachedRow]);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=8.8.8.8");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ip_address).toBe("8.8.8.8");
    expect(data.isp).toBe("Google LLC");
    // Should not call external APIs when cache hit
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should fetch from APIs on cache miss and return combined result", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    // Cache miss (empty array)
    mockSql.mockResolvedValueOnce([]);
    // Upsert (no return value needed)
    mockSql.mockResolvedValueOnce([]);

    // Mock fetch for the 3 external API calls
    const mockFetch = vi.mocked(global.fetch);

    // ip-api.com response
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "success",
          isp: "Comcast",
          org: "Comcast Cable",
          as: "AS7922 Comcast Cable Communications",
          proxy: false,
          hosting: false,
          mobile: false,
          country: "United States",
          city: "Philadelphia",
          regionName: "Pennsylvania",
          lat: 39.95,
          lon: -75.16,
        }),
        { status: 200 }
      )
    );

    // RDAP response
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          entities: [
            {
              vcardArray: [
                "vcard",
                [
                  ["fn", {}, "text", "Comcast Cable Communications"],
                  ["adr", {}, "text", ["1701 JFK Blvd", "Philadelphia", "PA"]],
                ],
              ],
            },
          ],
        }),
        { status: 200 }
      )
    );

    // Nominatim response
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          address: {
            road: "Market Street",
            city: "Philadelphia",
            state: "Pennsylvania",
            postcode: "19103",
            country: "United States",
            county: "Philadelphia County",
          },
        }),
        { status: 200 }
      )
    );

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=50.76.123.45");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ip_address).toBe("50.76.123.45");
    expect(data.isp).toBe("Comcast");
    expect(data.org).toBe("Comcast Cable");
    expect(data.as_number).toBe("AS7922");
    expect(data.as_name).toBe("Comcast Cable Communications");
    expect(data.country).toBe("United States");
    expect(data.city).toBe("Philadelphia");
    expect(data.whois_org).toBe("Comcast Cable Communications");
    expect(data.reverse_state).toBe("Pennsylvania");

    // Should have called all 3 APIs
    expect(mockFetch).toHaveBeenCalledTimes(3);
    // Should have called SQL twice (cache check + upsert)
    expect(mockSql).toHaveBeenCalledTimes(2);
  });

  it("should skip Nominatim when ip-api returns no coordinates", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const mockFetch = vi.mocked(global.fetch);

    // ip-api returns lat/lon = 0
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "success",
          isp: "Test ISP",
          org: "Test Org",
          as: "",
          proxy: false,
          hosting: false,
          mobile: false,
          country: "Unknown",
          city: "",
          regionName: "",
          lat: 0,
          lon: 0,
        }),
        { status: 200 }
      )
    );

    // RDAP response
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    );

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=1.2.3.4");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Only 2 API calls (no Nominatim since lat/lon = 0)
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(data.reverse_address).toBe("");
    expect(data.latitude).toBe("");
    expect(data.longitude).toBe("");
  });

  it("should handle ip-api failure gracefully", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const mockFetch = vi.mocked(global.fetch);

    // ip-api returns non-ok status
    mockFetch.mockResolvedValueOnce(
      new Response("Rate limited", { status: 429 })
    );

    // RDAP response
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    );

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=1.2.3.4");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isp).toBe("");
    expect(data.org).toBe("");
  });

  it("should handle ip-api returning fail status", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const mockFetch = vi.mocked(global.fetch);

    // ip-api returns status: "fail"
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ status: "fail", message: "private range" }),
        { status: 200 }
      )
    );

    // RDAP
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    );

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=1.2.3.4");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isp).toBe("");
  });

  it("should handle RDAP failure gracefully", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const mockFetch = vi.mocked(global.fetch);

    // ip-api success
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "success",
          isp: "Test",
          org: "Test",
          as: "",
          lat: 0,
          lon: 0,
        }),
        { status: 200 }
      )
    );

    // RDAP fails
    mockFetch.mockRejectedValueOnce(new Error("RDAP timeout"));

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=1.2.3.4");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.whois_org).toBe("");
    expect(data.whois_address).toBe("");
  });

  it("should return 400 for private IPs (0.x)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=0.0.0.0");

    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("should return 400 for link-local IPs (169.254.x)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=169.254.1.1");

    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("should return 400 for IPv6 link-local (fe80:)", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=fe80::1");

    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("should return 400 for IPv6 long-form loopback", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=0:0:0:0:0:0:0:1");

    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("should return 500 when database query fails", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockRejectedValue(new Error("Database error"));

    const { GET } = await import("./route");
    const request = new NextRequest("http://localhost/api/analytics/ip-intel?ip=8.8.8.8");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Lookup failed");
  });
});
