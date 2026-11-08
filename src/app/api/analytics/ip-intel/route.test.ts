import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/rate-limit", () => ({
  createRateLimiter: () => ({ checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }) }),
  getClientIp: () => "203.0.113.9",
}));
vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");
vi.mock("@/lib/ip-enrichment/enrich");

const get = (qs: string) =>
  new NextRequest(`http://localhost/api/analytics/ip-intel${qs}`);

describe("GET /api/analytics/ip-intel", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { getDb } = await import("@/lib/analytics");
    vi.mocked(getDb).mockReturnValue(vi.fn() as never);
  });

  async function authed(ok: boolean) {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(ok);
  }

  it("returns 401 without auth", async () => {
    await authed(false);
    const { GET } = await import("./route");
    const res = await GET(get("?ip=8.8.8.8"));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("Unauthorized");
  });

  it("returns 400 when the ip is missing or garbage", async () => {
    await authed(true);
    const { GET } = await import("./route");
    for (const qs of ["", "?ip=not-an-ip!"]) {
      const res = await GET(get(qs));
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("Invalid IP address");
    }
  });

  it.each(["127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.1.1", "0.0.0.0", "169.254.1.1", "::1", "fe80::1", "0:0:0:0:0:0:0:1"])(
    "returns 400 for private address %s without enriching",
    async (ip) => {
      await authed(true);
      const { enrichIp } = await import("@/lib/ip-enrichment/enrich");
      const { GET } = await import("./route");
      const res = await GET(get(`?ip=${ip}`));
      expect(res.status).toBe(400);
      expect(enrichIp).not.toHaveBeenCalled();
    },
  );

  it("returns 200 with { enrichment, cached }", async () => {
    await authed(true);
    const { enrichIp } = await import("@/lib/ip-enrichment/enrich");
    const enrichment = { ip: "8.8.8.8", company: "Google LLC", sources: ["ipapi.is"] };
    vi.mocked(enrichIp).mockResolvedValue({ enrichment, cached: true } as never);
    const { GET } = await import("./route");
    const res = await GET(get("?ip=8.8.8.8"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ enrichment, cached: true });
  });

  it("returns 500 when enrichIp throws", async () => {
    await authed(true);
    const { enrichIp } = await import("@/lib/ip-enrichment/enrich");
    vi.mocked(enrichIp).mockRejectedValue(new Error("boom"));
    const { GET } = await import("./route");
    const res = await GET(get("?ip=8.8.8.8"));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Lookup failed");
  });
});
