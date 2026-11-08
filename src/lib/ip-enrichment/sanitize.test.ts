import { describe, it, expect, vi } from "vitest";
import { cleanText, sanitizeEnrichment } from "./sanitize";
import { fetchRdap } from "./providers/rdap";
import { enrichIp } from "./enrich";
import { resetListCache } from "./providers/tor-exits";
import { EMPTY_ENRICHMENT } from "./types";

const NOW = Date.parse("2026-11-07T12:00:00Z");

describe("cleanText", () => {
  it("returns empty for non-strings", () => {
    expect(cleanText(42, 10)).toBe("");
    expect(cleanText(null, 10)).toBe("");
  });
  it("strips controls, bidi and format characters, trims and caps", () => {
    const dirty = "  \u202Eevil\u0000 \u200BCorp\u2066\u0085\uFEFF  ";
    expect(cleanText(dirty, 100)).toBe("evil Corp");
    expect(cleanText("abcdef", 3)).toBe("abc");
  });
});

describe("sanitizeEnrichment", () => {
  const base = { ...EMPTY_ENRICHMENT, ip: "9.9.9.9", enrichedAt: "2026-11-07T00:00:00.000Z" };
  it("strips bidi from asName and caps lengths", () => {
    const out = sanitizeEnrichment({
      ...base,
      asName: "\u202EGOOGLE\u202C" + "x".repeat(500),
      abuserScore: "0.0123 (".padEnd(40, "9"),
      sources: Array.from({ length: 12 }, (_, i) => `s${i}`.padEnd(60, "z")),
    });
    expect(out.asName.startsWith("GOOGLE")).toBe(true);
    expect(out.asName).not.toMatch(/[\u202A-\u202E]/);
    expect(out.asName.length).toBe(200);
    expect(out.abuserScore.length).toBe(20);
    expect(out.sources).toHaveLength(8);
    expect(out.sources[0].length).toBe(40);
  });
  it("does not mutate the input", () => {
    const input = { ...base, city: "\u0007Tampa" };
    sanitizeEnrichment(input);
    expect(input.city).toBe("\u0007Tampa");
  });
});

describe("rdap fn handling", () => {
  it("ignores a non-string fn value", async () => {
    const f = vi.fn(async () =>
      new Response(JSON.stringify({ entities: [{ vcardArray: ["vcard", [["fn", {}, "text", { x: 1 }]]] }] })));
    const r = await fetchRdap("8.8.8.8", f as never);
    expect(r.org).toBe("");
  });
});

describe("enrichIp sanitising", () => {
  it("sanitises what is returned", async () => {
    resetListCache();
    const sql = vi.fn().mockResolvedValue([]);
    const f = vi.fn(async (url: string) => {
      if (url.startsWith("https://api.ipapi.is")) {
        return new Response(JSON.stringify({ company: { name: "Ev\u202Eil", abuser_score: "9".repeat(40) }, asn: "AS1 Ok\u200F" }));
      }
      if (url.startsWith("https://rdap.org")) return new Response("{}");
      return new Response("1.2.3.4\n");
    });
    const r = await enrichIp(sql as never, "1.10.16.5", { fetchImpl: f as never, key: undefined, now: NOW });
    expect(r.enrichment.company).toBe("Evil");
    expect(r.enrichment.abuserScore).toHaveLength(20);
    const insert = sql.mock.calls.find((c) => String(c[0].join("")).includes("INSERT INTO ip_intel"));
    expect(insert?.slice(1)).not.toContain("Ev\u202Eil");
  });
});
