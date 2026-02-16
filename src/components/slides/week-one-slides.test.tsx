import { describe, it, expect } from "vitest";
import { weekOneSlides } from "./week-one-slides";

describe("weekOneSlides", () => {
  it("has exactly 10 slides", () => {
    expect(weekOneSlides).toHaveLength(10);
  });

  it("each slide has an id and content", () => {
    for (const slide of weekOneSlides) {
      expect(slide).toHaveProperty("id");
      expect(typeof slide.id).toBe("string");
      expect(slide.id.length).toBeGreaterThan(0);
      expect(slide).toHaveProperty("content");
      expect(slide.content).toBeTruthy();
    }
  });

  it("has unique slide ids", () => {
    const ids = weekOneSlides.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains the expected slide ids in order", () => {
    const ids = weekOneSlides.map((s) => s.id);
    expect(ids).toEqual([
      "title",
      "stats",
      "days-1-3",
      "days-4-5",
      "days-6-7",
      "security",
      "waf-saga",
      "architecture",
      "takeaways",
      "cta",
    ]);
  });
});
