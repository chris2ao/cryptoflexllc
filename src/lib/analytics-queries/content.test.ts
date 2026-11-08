import { describe, it, expect, vi, beforeEach } from "vitest";

const tag = vi.fn();
vi.mock("@/lib/analytics", () => ({ getDb: () => tag }));

import { loadReferrerClasses } from "./content";

describe("loadReferrerClasses", () => {
  beforeEach(() => {
    tag.mockReset();
  });

  it("returns empty lists on failure", async () => {
    tag.mockImplementation(() => Promise.reject(new Error("x")));
    expect(await loadReferrerClasses(30, "humans")).toEqual({ classes: [], hosts: [] });
  });

  it("maps rows", async () => {
    tag
      .mockResolvedValueOnce([{ cls: "search", views: 9, visitors: 5 }])
      .mockResolvedValueOnce([{ host: "google.com", cls: "search", views: 9 }]);
    const out = await loadReferrerClasses(30, "humans");
    expect(out.classes).toEqual([{ cls: "search", views: 9, visitors: 5 }]);
    expect(out.hosts[0].host).toBe("google.com");
  });
});
