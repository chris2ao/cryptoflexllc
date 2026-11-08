import { describe, it, expect } from "vitest";
import { resolveTab } from "./tabs";

describe("resolveTab", () => {
  it("falls back to overview", () => {
    expect(resolveTab("nope")).toBe("overview");
    expect(resolveTab(undefined)).toBe("overview");
  });
  it("accepts an exact id", () => {
    expect(resolveTab("agents")).toBe("agents");
  });
});
