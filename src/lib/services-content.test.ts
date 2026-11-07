import { describe, it, expect } from "vitest";
import { OFFERS, STEPS } from "./services-content";
import { getAllPosts, getAllSeries } from "@/lib/blog";

const proofHrefs = OFFERS.flatMap((o) => o.proof.map((p) => p.href));

describe("services content", () => {
  it("has two offers with 3 bullets and 2 or 3 proof links", () => {
    expect(OFFERS).toHaveLength(2);
    for (const o of OFFERS) {
      expect(o.bullets).toHaveLength(3);
      expect(o.proof.length).toBeGreaterThanOrEqual(2);
      expect(o.proof.length).toBeLessThanOrEqual(3);
    }
  });

  it("series proof links name existing series", () => {
    const names = getAllSeries().map((s) => (typeof s === "string" ? s : s.name));
    const series = proofHrefs.filter((h) => h.startsWith("/blog/series/"));
    expect(series.length).toBeGreaterThan(0);
    for (const h of series) {
      expect(names).toContain(decodeURIComponent(h.replace("/blog/series/", "")));
    }
  });

  it("post proof links match existing slugs", () => {
    const slugs = new Set(getAllPosts().map((p) => p.slug));
    for (const h of proofHrefs.filter((x) => !x.startsWith("/blog/series/"))) {
      expect(slugs.has(h.replace("/blog/", ""))).toBe(true);
    }
  });

  it("contains no em dash", () => {
    expect(JSON.stringify({ OFFERS, STEPS })).not.toContain("—");
  });
});
