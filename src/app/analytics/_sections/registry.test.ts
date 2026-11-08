import { describe, it, expect } from "vitest";
import { DEFAULT_TABS } from "../_components/tabs";
import { SECTIONS, SKELETONS } from "./registry";

describe("section registry", () => {
  it("has one section per default tab", () => {
    expect(Object.keys(SECTIONS).sort()).toEqual(
      DEFAULT_TABS.map((t) => t.id).sort()
    );
  });

  it("has one skeleton per default tab", () => {
    expect(Object.keys(SKELETONS).sort()).toEqual(
      DEFAULT_TABS.map((t) => t.id).sort()
    );
  });
});
