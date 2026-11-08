import { describe, it, expect } from "vitest";
import { resolveTopic } from "./tag-alias";

describe("resolveTopic", () => {
  it("resolves a topic to itself, ignoring case", () => {
    expect(resolveTopic("Home Lab")).toBe("Home Lab");
    expect(resolveTopic("home lab")).toBe("Home Lab");
  });

  it("maps an old tag to its topic", () => {
    expect(resolveTopic("Pi-hole")).toBe("Home Lab");
    expect(resolveTopic("next.js")).toBe("Web Development");
  });

  it("returns null for a dropped tag", () => {
    expect(resolveTopic("Tutorial")).toBeNull();
  });

  it("returns null for an unknown tag", () => {
    expect(resolveTopic("definitely-not-a-tag")).toBeNull();
  });
});
