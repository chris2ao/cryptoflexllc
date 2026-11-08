import { describe, it, expect } from "vitest";
import { DEFAULT_TABS, type TabId } from "../_components/tabs";
import { SECTIONS, SKELETONS, type TabId as RegistryTabId } from "./registry";

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

describe("TabId re-export", () => {
  it("is the same type from the registry and tabs.ts", () => {
    const id: TabId = "agents";
    const same: RegistryTabId = id;
    expect(same).toBe("agents");
  });
});
