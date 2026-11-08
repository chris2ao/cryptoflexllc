import { describe, it, expect, vi, beforeEach } from "vitest";

type Call = { text: string; values: unknown[] };
const calls: Call[] = [];
let rows: unknown[] = [];

const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  calls.push({ text: strings.join("?"), values });
  return Promise.resolve(rows);
};

vi.mock("@/lib/analytics", () => ({ getDb: () => sql }));

import { loadNetworkTypes } from "./security-intel";

beforeEach(() => {
  calls.length = 0;
  rows = [];
});

describe("loadNetworkTypes", () => {
  it("returns the five types in order with counts placed correctly", async () => {
    rows = [
      { type: "unknown", visitors: 2, views: 5 },
      { type: "tor", visitors: 1, views: 1 },
      { type: "residential", visitors: 10, views: 40 },
      { type: "bogus", visitors: 4, views: 6 },
    ];
    const out = await loadNetworkTypes(30, "all");
    expect(out.map((r) => r.type)).toEqual(["residential", "datacenter", "proxy", "tor", "unknown"]);
    expect(out[0]).toEqual({ type: "residential", visitors: 10, views: 40 });
    expect(out[1]).toEqual({ type: "datacenter", visitors: 0, views: 0 });
    expect(out[2]).toEqual({ type: "proxy", visitors: 0, views: 0 });
    expect(out[3]).toEqual({ type: "tor", visitors: 1, views: 1 });
    // An unrecognised type collapses into "unknown" (last write wins in the map).
    expect(out[4].type).toBe("unknown");
  });

  it("orders the CASE tor, proxy, datacenter, residential, unknown", async () => {
    await loadNetworkTypes(7);
    const text = calls[0].text;
    const order = ["'tor'", "'proxy'", "'datacenter'", "'residential'", "'unknown'"].map((k) => text.indexOf(k));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(text).toMatch(/WHEN ii\.is_datacenter IS FALSE[\s\S]*THEN 'residential'/);
  });

  it("returns zeroed rows when the query yields nothing", async () => {
    const out = await loadNetworkTypes(7);
    expect(out.every((r) => r.visitors === 0 && r.views === 0)).toBe(true);
  });
});
