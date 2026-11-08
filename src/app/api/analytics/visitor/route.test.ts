import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");
vi.mock("@/lib/analytics-queries/visitor");

const EMPTY = {
  ip: "8.8.8.8",
  firstSeen: null,
  lastSeen: null,
  hits: 0,
  classes: {},
  pages: [],
  userAgents: [],
  locations: [],
  referrerClasses: {},
  engagement: { scrolls: 0, maxDepth: 0, seconds: 0 },
  errors: 0,
  auth: { success: 0, fail: 0 },
  subscriber: false,
  guestbook: 0,
};

async function call(ip: string, authed: boolean) {
  const { verifyApiAuth } = await import("@/lib/analytics-auth");
  vi.mocked(verifyApiAuth).mockReturnValue(authed);
  const { GET } = await import("./route");
  return GET(new NextRequest(`http://localhost/api/analytics/visitor?ip=${ip}`));
}

describe("GET /api/analytics/visitor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    const res = await call("8.8.8.8", false);
    expect(res.status).toBe(401);
  });

  it("returns 400 for a private address", async () => {
    const res = await call("192.168.1.1", true);
    expect(res.status).toBe(400);
  });

  it("returns 400 for a malformed address", async () => {
    const res = await call("nope", true);
    expect(res.status).toBe(400);
  });

  it("returns the dossier", async () => {
    const { loadVisitorDossier } = await import("@/lib/analytics-queries/visitor");
    vi.mocked(loadVisitorDossier).mockResolvedValue(EMPTY);
    const res = await call("8.8.8.8", true);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ dossier: EMPTY });
  });

  it("returns 500 when the loader throws", async () => {
    const { loadVisitorDossier } = await import("@/lib/analytics-queries/visitor");
    vi.mocked(loadVisitorDossier).mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await call("8.8.8.8", true);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Lookup failed" });
  });
});
