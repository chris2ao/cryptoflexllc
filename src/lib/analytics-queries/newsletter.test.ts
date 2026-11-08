import { describe, it, expect, vi, beforeEach } from "vitest";

type Call = { text: string; values: unknown[] };
const calls: Call[] = [];
let responder: (text: string) => Promise<unknown[]> = async () => [];
const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  const text = strings.join("?");
  calls.push({ text, values });
  return responder(text);
};
vi.mock("@/lib/analytics", () => ({ getDb: () => sql }));

import { loadDigestRuns, loadNewsletter } from "./newsletter";

beforeEach(() => {
  calls.length = 0;
  responder = async () => [];
});

describe("loadDigestRuns", () => {
  it("maps rows, coercing numbers, with one correlated query", async () => {
    responder = async () => [
      { ran_at: new Date("2026-11-02T13:00:00Z"), recipients: "10", sent: 9, failed: 1, duration_ms: 4000, clicks7d: "3", partial: true },
    ];
    const out = await loadDigestRuns(5);
    expect(out).toEqual([
      { ran_at: "2026-11-02T13:00:00.000Z", recipients: 10, sent: 9, failed: 1, duration_ms: 4000, clicks7d: 3, partial: true },
    ]);
    expect(calls).toHaveLength(1);
    expect(calls[0].text).toContain("digest_runs");
    expect(calls[0].text).toContain("weekly-digest");
    expect(calls[0].text).toContain("traffic_class");
    expect(calls[0].text).toContain("COUNT(DISTINCT pv.ip_address)");
    expect(calls[0].text).toContain("d.ran_at > NOW() - INTERVAL '7 days'");
    expect(calls[0].values).toContain(5);
  });

  it("marks a closed window as not partial", async () => {
    responder = async () => [
      { ran_at: new Date("2026-10-01T13:00:00Z"), recipients: 1, sent: 1, failed: 0, duration_ms: 1, clicks7d: 0, partial: false },
    ];
    expect((await loadDigestRuns(5))[0].partial).toBe(false);
  });

  it("returns [] when the query fails", async () => {
    responder = async () => {
      throw new Error("x");
    };
    expect(await loadDigestRuns()).toEqual([]);
  });
});

describe("loadNewsletter", () => {
  it("includes digestRuns", async () => {
    const data = await loadNewsletter(30);
    expect(data.digestRuns).toEqual([]);
  });
});
