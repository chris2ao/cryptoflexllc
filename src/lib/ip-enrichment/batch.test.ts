import { describe, it, expect, vi } from "vitest";
import { enrichPendingIps } from "./batch";

describe("enrichPendingIps", () => {
  const ok = (ip: string) => ({ enrichment: { ip, sources: ["ipapi.is"] }, cached: false });

  it("enriches each selected public ip sequentially with spacing and returns the count", async () => {
    const sql = vi.fn().mockResolvedValue([
      { ip_address: "8.8.8.8" }, { ip_address: "10.0.0.1" }, { ip_address: "1.1.1.1" }, { ip_address: "" },
    ]);
    const enrich = vi.fn(async (_s: unknown, ip: string) => ok(ip));
    const sleep = vi.fn().mockResolvedValue(undefined);
    const n = await enrichPendingIps(sql as never, 200, { enrich: enrich as never, sleep, spacingMs: 1400 });
    expect(n).toBe(2);
    expect(enrich.mock.calls.map((c) => c[1])).toEqual(["8.8.8.8", "1.1.1.1"]);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(1400);
    expect(sql.mock.calls[0][sql.mock.calls[0].length - 1]).toBe(200);
  });

  it("does not count failed lookups and never throws", async () => {
    const sql = vi.fn().mockResolvedValue([{ ip_address: "8.8.8.8" }]);
    const enrich = vi.fn().mockResolvedValue({ enrichment: { sources: [] }, cached: false });
    const sleep = vi.fn();
    expect(await enrichPendingIps(sql as never, 5, { enrich, sleep, spacingMs: 0 })).toBe(0);
    const bad = vi.fn().mockRejectedValue(new Error("db"));
    expect(await enrichPendingIps(bad as never, 5, { enrich, sleep, spacingMs: 0 })).toBe(0);
  });
});
