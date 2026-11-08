import { describe, it, expect, vi, beforeEach } from "vitest";
import { enrichIp } from "./enrich";
import { upsertIntel, getCachedIntel } from "./cache";
import { resetListCache } from "./providers/tor-exits";
import { EMPTY_ENRICHMENT, type IpEnrichment } from "./types";

const NOW = Date.parse("2026-11-07T12:00:00Z");

describe("upsertIntel / getCachedIntel", () => {
  const base: IpEnrichment = {
    ...EMPTY_ENRICHMENT, ip: "9.9.9.9", company: "Quad9", asn: "AS19281", asName: "Quad9",
    isDatacenter: true, sources: ["ipapi.is", "rdap"], enrichedAt: "2026-11-07T12:00:00.000Z",
  };

  it("writes is_hosting from isDatacenter and legacy columns", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    await upsertIntel(sql as never, base);
    const values = sql.mock.calls[0].slice(1);
    // ip, isp, org, as_number, as_name, is_proxy, is_hosting, is_mobile
    expect(values.slice(0, 8)).toEqual(["9.9.9.9", "Quad9", "Quad9", "AS19281", "Quad9", false, true, false]);
    expect(values).toContain("ipapi.is,rdap");
  });

  it("is_hosting is false when isDatacenter is unknown", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    await upsertIntel(sql as never, { ...base, isDatacenter: null });
    expect(sql.mock.calls[0][7]).toBe(false);
  });

  it("maps a cached row, keeping proxy unknown for anonymous lookups", async () => {
    const sql = vi.fn().mockResolvedValue([
      { ip_address: "9.9.9.9", company: "Quad9", as_number: "AS1", is_proxy: false,
        is_datacenter: null, is_vpn: null, is_abuser: null, is_tor: false, on_drop: false,
        sources: "ipapi.is,rdap", enriched_at: "2026-11-06T00:00:00Z" },
    ]);
    const r = await getCachedIntel(sql as never, "9.9.9.9");
    expect(r?.isProxy).toBeNull();
    expect(r?.sources).toEqual(["ipapi.is", "rdap"]);
  });
});

describe("enrichIp", () => {
  beforeEach(() => resetListCache());

  it("returns the cached row without fetching", async () => {
    const sql = vi.fn().mockResolvedValue([
      { ip_address: "8.8.8.8", company: "Google LLC", enriched_at: "2026-11-06T00:00:00Z", sources: "ipapi.is" },
    ]);
    const f = vi.fn();
    const r = await enrichIp(sql as never, "8.8.8.8", { fetchImpl: f as never, key: undefined, now: NOW });
    expect(r.cached).toBe(true);
    expect(r.enrichment.company).toBe("Google LLC");
    expect(f).not.toHaveBeenCalled();
  });

  it("merges providers, marks Tor and DROP, and upserts", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    const f = vi.fn(async (url: string) => {
      if (url.startsWith("https://api.ipapi.is")) {
        return new Response(JSON.stringify({ company: "Evil Co", asn: "AS666 Evil", country: "NL", lat: 1, lon: 2 }));
      }
      if (url.startsWith("https://rdap.org")) {
        return new Response(JSON.stringify({ entities: [{ vcardArray: ["vcard", [["fn", {}, "text", "Evil Registry"]]] }] }));
      }
      if (url.includes("torbulkexitlist")) return new Response("1.10.16.5\n");
      return new Response("1.10.16.0/20 ; SBL1\n");
    });
    const r = await enrichIp(sql as never, "1.10.16.5", { fetchImpl: f as never, key: undefined, now: NOW });
    expect(r.cached).toBe(false);
    expect(r.enrichment).toMatchObject({
      company: "Evil Co", asn: "AS666", whoisOrg: "Evil Registry", isTor: true, onDrop: true,
      isDatacenter: null, sources: ["ipapi.is", "rdap", "tor-exits", "spamhaus-drop"],
    });
    expect(r.enrichment.enrichedAt).toBe("2026-11-07T12:00:00.000Z");
    const inserts = sql.mock.calls.filter((c) => String(c[0].join("")).includes("INSERT INTO ip_intel"));
    expect(inserts).toHaveLength(1);
  });

  it("total failure returns empty sources and does not upsert", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    const f = vi.fn().mockRejectedValue(new Error("offline"));
    const r = await enrichIp(sql as never, "8.8.4.4", { fetchImpl: f as never, key: undefined, now: NOW });
    expect(r.enrichment.sources).toEqual([]);
    expect(r.cached).toBe(false);
    const inserts = sql.mock.calls.filter((c) => String(c[0].join("")).includes("INSERT INTO ip_intel"));
    expect(inserts).toHaveLength(0);
  });
});
