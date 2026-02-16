import { describe, it, expect } from "vitest";
import { getAllResources, getResourceBySlug } from "./resources";

describe("resources", () => {
  describe("getAllResources", () => {
    it("returns an array of resources", () => {
      const resources = getAllResources();
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
    });

    it("returns resources sorted by date descending", () => {
      const resources = getAllResources();
      for (let i = 1; i < resources.length; i++) {
        expect(
          new Date(resources[i - 1].date).getTime()
        ).toBeGreaterThanOrEqual(new Date(resources[i].date).getTime());
      }
    });

    it("each resource has the expected shape", () => {
      const resources = getAllResources();
      for (const r of resources) {
        expect(r).toHaveProperty("slug");
        expect(r).toHaveProperty("title");
        expect(r).toHaveProperty("description");
        expect(r).toHaveProperty("type");
        expect(r).toHaveProperty("tags");
        expect(r).toHaveProperty("date");
        expect(["carousel", "document", "download"]).toContain(r.type);
        expect(Array.isArray(r.tags)).toBe(true);
      }
    });
  });

  describe("getResourceBySlug", () => {
    it("returns the week-one-carousel resource", () => {
      const resource = getResourceBySlug("week-one-carousel");
      expect(resource).toBeDefined();
      expect(resource!.slug).toBe("week-one-carousel");
      expect(resource!.type).toBe("carousel");
    });

    it("returns undefined for unknown slug", () => {
      expect(getResourceBySlug("nonexistent")).toBeUndefined();
    });

    it("returns undefined for path traversal attempts", () => {
      expect(getResourceBySlug("../secret")).toBeUndefined();
      expect(getResourceBySlug("foo/bar")).toBeUndefined();
      expect(getResourceBySlug("foo\\bar")).toBeUndefined();
    });
  });
});
