import { describe, it, expect } from "vitest";
import {
  MIN_SOCIAL_PROOF,
  SUBSCRIBE_COPY,
  showSubscriberCount,
} from "./subscribe-copy";

describe("showSubscriberCount", () => {
  it("hides null and small counts", () => {
    expect(showSubscriberCount(null)).toBe(false);
    expect(showSubscriberCount(0)).toBe(false);
    expect(showSubscriberCount(30)).toBe(false);
    expect(showSubscriberCount(MIN_SOCIAL_PROOF - 1)).toBe(false);
  });

  it("shows counts at or above the threshold", () => {
    expect(showSubscriberCount(MIN_SOCIAL_PROOF)).toBe(true);
    expect(showSubscriberCount(250)).toBe(true);
  });
});

describe("SUBSCRIBE_COPY", () => {
  it("contains no em dash", () => {
    expect(JSON.stringify(SUBSCRIBE_COPY)).not.toContain("—");
  });
});
