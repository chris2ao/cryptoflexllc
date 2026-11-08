import { describe, it, expect } from "vitest";
import { rangeDays, resolveScope, trafficFilter, scopeClass, deltaPercent } from "./shared";

describe("rangeDays", () => {
  it("defaults to 30 for missing or non-numeric input", () => {
    expect(rangeDays(undefined)).toBe(30);
    expect(rangeDays("abc")).toBe(30);
  });

  it("clamps to 1..365", () => {
    expect(rangeDays("0")).toBe(1);
    expect(rangeDays("9999")).toBe(365);
  });

  it("accepts only plain digits", () => {
    expect(rangeDays("30abc")).toBe(30);
    expect(rangeDays("45")).toBe(45);
    expect(rangeDays("")).toBe(30);
    expect(rangeDays("12345")).toBe(30);
    expect(rangeDays("-5")).toBe(30);
  });

  it("passes through valid values", () => {
    expect(rangeDays("7")).toBe(7);
  });
});

describe("resolveScope", () => {
  it("returns all only for the exact string all", () => {
    expect(resolveScope("all")).toBe("all");
  });

  it("falls back to humans for anything else", () => {
    expect(resolveScope(undefined)).toBe("humans");
    expect(resolveScope("ALL")).toBe("humans");
    expect(resolveScope("bots")).toBe("humans");
  });
});

describe("deltaPercent", () => {
  it("reports up, down and no baseline", () => {
    expect(deltaPercent(120, 100)).toEqual({ value: 20, direction: "up" });
    expect(deltaPercent(80, 100)).toEqual({ value: 20, direction: "down" });
    expect(deltaPercent(5, 0)).toBeNull();
  });
});

describe("scope predicate", () => {
  it("trafficFilter and scopeClass follow the scope", () => {
    expect(trafficFilter("humans")).toContain("traffic_class = 'human'");
    expect(trafficFilter("all")).toBe("");
    expect(scopeClass("humans")).toBe("human");
    expect(scopeClass("all")).toBeNull();
  });
});
