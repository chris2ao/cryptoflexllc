import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadTorExitSet } from "./tor-exits";
import { loadDropCidrs } from "./spamhaus-drop";
import { resetListCache } from "./tor-exits";

const NOW = Date.parse("2026-11-07T12:00:00Z");
const text = (t: string) => vi.fn().mockResolvedValue(new Response(t, { status: 200 }));

describe("threat lists", () => {
  beforeEach(() => resetListCache());

  it("parses the Tor list and writes the cache row", async () => {
    const sql = vi.fn().mockResolvedValueOnce([]).mockResolvedValue([]);
    const f = text("1.1.1.1\n2.2.2.2\n\nnot-an-ip\n");
    const set = await loadTorExitSet(sql as never, f as never, NOW);
    expect([...set]).toEqual(["1.1.1.1", "2.2.2.2"]);
    expect(sql).toHaveBeenCalledTimes(2);
  });

  it("a fresh threat_lists row skips the fetch", async () => {
    const sql = vi.fn().mockResolvedValue([
      { entries: "3.3.3.3\n", fetched_at: new Date(NOW - 3600_000).toISOString() },
    ]);
    const f = vi.fn();
    const set = await loadTorExitSet(sql as never, f as never, NOW);
    expect(set.has("3.3.3.3")).toBe(true);
    expect(f).not.toHaveBeenCalled();
  });

  it("the module memo skips both sql and fetch on a second call", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    await loadTorExitSet(sql as never, text("4.4.4.4\n") as never, NOW);
    const f = vi.fn();
    sql.mockClear();
    const set = await loadTorExitSet(sql as never, f as never, NOW + 1000);
    expect(set.has("4.4.4.4")).toBe(true);
    expect(sql).not.toHaveBeenCalled();
    expect(f).not.toHaveBeenCalled();
  });

  it("falls back to stale text when the fetch fails, else empty", async () => {
    const stale = vi.fn().mockResolvedValue([
      { entries: "5.5.5.5\n", fetched_at: new Date(NOW - 48 * 3600_000).toISOString() },
    ]);
    const fail = vi.fn().mockRejectedValue(new Error("down"));
    expect((await loadTorExitSet(stale as never, fail as never, NOW)).has("5.5.5.5")).toBe(true);

    resetListCache();
    const none = vi.fn().mockResolvedValue([]);
    expect((await loadTorExitSet(none as never, fail as never, NOW)).size).toBe(0);
  });

  it("loads DROP cidrs and ignores comments", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    const f = text("; Spamhaus DROP\n1.10.16.0/20 ; SBL256894\n2.56.8.0/22 ; SBL1\n");
    const cidrs = await loadDropCidrs(sql as never, f as never, NOW);
    expect(cidrs).toHaveLength(2);
    expect(cidrs[0][1]).toBe(20);
  });
});
