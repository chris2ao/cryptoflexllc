import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", true && "bar", "baz")).toBe("foo bar baz");
  });

  it("merges Tailwind conflicting classes (twMerge)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-600")).toBe("text-blue-600");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles undefined and null values", () => {
    expect(cn("foo", undefined, "bar", null)).toBe("foo bar");
  });

  it("handles arrays of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("handles objects with boolean values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("combines multiple input types", () => {
    expect(cn("base", ["foo", "bar"], { baz: true, qux: false })).toBe(
      "base foo bar baz"
    );
  });
});
