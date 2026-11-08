import { describe, it, expect } from "vitest";
import { rangeDays, resolveScope } from "./shared";

describe("rangeDays", () => {
  it("defaults to 30 for missing or non-numeric input", () => {
    expect(rangeDays(undefined)).toBe(30);
    expect(rangeDays("abc")).toBe(30);
  });

  it("clamps to 1..365", () => {
    expect(rangeDays("0")).toBe(1);
    expect(rangeDays("9999")).toBe(365);
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
