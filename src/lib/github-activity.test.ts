import { describe, it, expect, vi } from "vitest";
import { fetchRecentCommits, countSince, excludeAutomated, AUTOMATED_COMMIT_PREFIXES } from "./github-activity";

const ok = (body: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body });

describe("fetchRecentCommits", () => {
  it("maps commits, truncates the first line, and sends the token", async () => {
    const f = ok([
      { sha: "a1", commit: { message: `${"y".repeat(100)}\nbody`, author: { date: "2026-11-05T00:00:00Z" } } },
    ]);
    const out = await fetchRecentCommits("chris2ao/cryptoflexllc", "2026-11-01T00:00:00Z", "tok", f as unknown as typeof fetch);
    expect(out).toEqual([{ sha: "a1", message: "y".repeat(80), date: "2026-11-05T00:00:00Z" }]);
    const [url, init] = f.mock.calls[0];
    expect(String(url)).toContain("/repos/chris2ao/cryptoflexllc/commits?since=");
    expect(String(url)).toContain("per_page=100");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
    expect(init.signal).toBeDefined();
  });

  it("omits Authorization without a token", async () => {
    const f = ok([]);
    await fetchRecentCommits("o/r", "2026-11-01T00:00:00Z", undefined, f as unknown as typeof fetch);
    expect((f.mock.calls[0][1].headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("returns [] on non-ok, bad shape and thrown errors", async () => {
    const bad = vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
    expect(await fetchRecentCommits("o/r", "x", undefined, bad as unknown as typeof fetch)).toEqual([]);
    expect(await fetchRecentCommits("o/r", "x", undefined, ok({ a: 1 }) as unknown as typeof fetch)).toEqual([]);
    const boom = vi.fn().mockRejectedValue(new Error("net"));
    expect(await fetchRecentCommits("o/r", "x", undefined, boom as unknown as typeof fetch)).toEqual([]);
  });
});

describe("countSince", () => {
  it("counts commits at or after the cutoff", () => {
    const commits = [
      { sha: "1", message: "", date: "2026-11-05T00:00:00Z" },
      { sha: "2", message: "", date: "2026-11-01T00:00:00Z" },
      { sha: "3", message: "", date: "garbage" },
    ];
    expect(countSince(commits, "2026-11-03T00:00:00Z")).toBe(1);
    expect(countSince(commits, "nope")).toBe(0);
  });
});

describe("excludeAutomated", () => {
  it("drops cron metric commits and keeps the rest without mutating", () => {
    const input = [
      { sha: "1", message: "chore: update gmail metrics 2026-11-07", date: "d" },
      { sha: "2", message: "fix: CLAUD-1 something", date: "d" },
    ];
    const out = excludeAutomated(input);
    expect(out.map((c) => c.sha)).toEqual(["2"]);
    expect(input).toHaveLength(2);
    expect(AUTOMATED_COMMIT_PREFIXES).toContain("chore: update gmail metrics");
  });
});
