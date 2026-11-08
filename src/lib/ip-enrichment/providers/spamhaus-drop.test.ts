import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseDrop, loadDropCidrs } from "./spamhaus-drop";
import { LIST_TTL_MS, loadTorExitSet, resetListCache } from "./tor-exits";

const NOW = Date.parse("2026-11-07T12:00:00Z");

describe("parseDrop", () => {
  it("parses JSON lines", () => {
    const text =
      '{"cidr":"1.10.16.0/20","sblid":"SBL256894","rir":"apnic"}\n{"cidr":"1.19.0.0/16","sblid":"SBL434604","rir":"apnic"}\n';
    expect(parseDrop(text)).toEqual([[(1 << 24) + (10 << 16) + (16 << 8), 20], [(1 << 24) + (19 << 16), 16]]);
  });
  it("still parses text lines", () => {
    expect(parseDrop("; header\n2.56.8.0/22 ; SBL1\n")).toHaveLength(1);
  });
  it("parses a mixed file and skips malformed or cidr-less JSON", () => {
    const text = '{"cidr":"1.19.0.0/16"}\n{not json\n{"foo":"1.2.3.0/24"}\n{"cidr":42}\n2.56.8.0/22 ; SBL1\n';
    expect(parseDrop(text)).toHaveLength(2);
  });
  it("rejects an out-of-range prefix in JSON", () => {
    expect(parseDrop('{"cidr":"1.2.3.0/33"}')).toHaveLength(0);
  });
});

describe("loadDropCidrs validator", () => {
  beforeEach(() => resetListCache());
  it("rejects a body with no CIDR and returns empty", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    const f = vi.fn().mockResolvedValue(new Response("<html>consent</html>"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await loadDropCidrs(sql as never, f as never, NOW)).toEqual([]);
    warn.mockRestore();
  });
});

describe("fallback warnings", () => {
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    resetListCache();
    warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });
  afterEach(() => warn.mockRestore());

  it("warns when a stale list is served, and serves it past LIST_TTL_MS", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    const good = vi.fn().mockResolvedValue(new Response("7.7.7.7\n"));
    await loadTorExitSet(sql as never, good as never, NOW);
    expect(warn).not.toHaveBeenCalled();

    const bad = vi.fn().mockRejectedValue(new Error("down"));
    const set = await loadTorExitSet(sql as never, bad as never, NOW + LIST_TTL_MS + 1);
    expect(set.has("7.7.7.7")).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain("stale");
  });

  it("warns and returns empty when no fresh or stale list exists", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    const bad = vi.fn().mockRejectedValue(new Error("down"));
    expect((await loadTorExitSet(sql as never, bad as never, NOW)).size).toBe(0);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain("no cached copy");
  });
});
