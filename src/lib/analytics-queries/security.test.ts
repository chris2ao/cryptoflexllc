import { describe, it, expect, vi, beforeEach } from "vitest";

type Call = { text: string; values: unknown[] };
const calls: Call[] = [];
let responder: (text: string) => unknown[] = () => [];

const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  const text = strings.join("?");
  calls.push({ text, values });
  return Promise.resolve(responder(text));
};

vi.mock("@/lib/analytics", () => ({ getDb: () => sql }));
vi.mock("@/lib/vercel-api", () => ({
  isVercelApiConfigured: () => false,
  fetchFirewallConfig: vi.fn(),
  fetchAttackStatus: vi.fn(),
  fetchFirewallEvents: vi.fn(),
}));

import { loadNetworkTypes, loadKnownBad, loadSecurity } from "./security";

beforeEach(() => {
  calls.length = 0;
  responder = () => [];
});

describe("loadNetworkTypes", () => {
  it("joins ip_intel, scopes to humans, and returns the five types in order", async () => {
    responder = () => [
      { type: "datacenter", visitors: 3, views: 9 },
      { type: "residential", visitors: 10, views: 40 },
    ];
    const out = await loadNetworkTypes(30, "humans");
    expect(calls[0].text).toContain("ip_intel");
    expect(calls[0].text).toContain("traffic_class");
    expect(calls[0].values).toContain("human");
    expect(out.map((r) => r.type)).toEqual([
      "residential",
      "datacenter",
      "proxy",
      "tor",
      "unknown",
    ]);
    expect(out[0]).toEqual({ type: "residential", visitors: 10, views: 40 });
    expect(out[2]).toEqual({ type: "proxy", visitors: 0, views: 0 });
  });

  it("passes a null scope for all traffic", async () => {
    await loadNetworkTypes(7, "all");
    expect(calls[0].values).toContain(null);
  });
});

describe("loadKnownBad", () => {
  it("maps flags to reasons", async () => {
    let n = 0;
    responder = () =>
      n++ === 0
        ? [
            { ip: "1.1.1.1", is_abuser: true, is_tor: true, on_drop: false, hits: 5, last: "2026-11-01T00:00:00Z" },
            { ip: "2.2.2.2", is_abuser: false, is_tor: false, on_drop: true, hits: 2, last: "2026-11-02T00:00:00Z" },
          ]
        : [{ visitors: 2 }];
    const out = await loadKnownBad(30);
    expect(out.visitors).toBe(2);
    expect(out.rows[0].reasons).toEqual(["abuse list", "Tor exit"]);
    expect(out.rows[1].reasons).toEqual(["Spamhaus DROP"]);
    expect(out.rows[0].hits).toBe(5);
  });

  it("returns an empty result when queries yield nothing", async () => {
    expect(await loadKnownBad(30)).toEqual({ visitors: 0, rows: [] });
  });
});

describe("loadSecurity", () => {
  it("selects referrer_host and traffic_class in the recent query and builds KPI windows", async () => {
    responder = (text) =>
      text.includes("AS current") ? [{ current: 4, previous: 2 }] : [];
    const data = await loadSecurity(30, "humans");
    const recent = calls.find((c) => c.text.includes("ORDER BY visited_at DESC LIMIT 50"));
    expect(recent?.text).toContain("referrer_host");
    expect(recent?.text).toContain("traffic_class,");
    expect(data.kpis.bots).toEqual({ current: 4, previous: 2 });
    expect(data.kpis.authFailures.current).toBe(4);
    expect(data.networkTypes).toHaveLength(5);
    expect(data.knownBad.rows).toEqual([]);
  });
});
