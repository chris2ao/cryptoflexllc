import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { BlogPost } from "./blog";
import {
  seriesHref,
  summarizeSeries,
  pickReadingPaths,
  getSeriesInProgress,
  postKicker,
} from "./home-content";

function post(overrides: Partial<BlogPost> & { slug: string }): BlogPost {
  return {
    title: overrides.slug,
    date: "2026-01-01",
    author: "Chris Johnson",
    readingTime: "5 min read",
    description: "",
    tags: [],
    content: "",
    ...overrides,
  };
}

const fixtures: BlogPost[] = [
  post({ slug: "sec-12", title: "Sec 12", date: "2026-10-16", series: "Security Engineering", seriesOrder: 12 }),
  post({ slug: "game-7", title: "Game 7", date: "2026-10-10", series: "Game Dev", seriesOrder: 7 }),
  post({ slug: "loose", title: "Loose", date: "2026-10-09", tags: ["Next.js"] }),
  post({ slug: "sec-11", title: "Sec 11", date: "2026-10-15", series: "Security Engineering", seriesOrder: 11 }),
  post({ slug: "sec-1", title: "Sec 1", date: "2026-02-09", series: "Security Engineering", seriesOrder: 1 }),
  post({ slug: "game-1", title: "Game 1", date: "2026-02-21", series: "Game Dev", seriesOrder: 1 }),
  post({ slug: "game-2", title: "Game 2", date: "2026-02-22", series: "Game Dev", seriesOrder: 2 }),
  post({ slug: "tips-1", title: "Tips 1", date: "2026-09-29", series: "Quick Tips", seriesOrder: 1 }),
];

describe("seriesHref", () => {
  it("encodes the series name into the series route", () => {
    expect(seriesHref("Home Network Mission Control")).toBe(
      "/blog/series/Home%20Network%20Mission%20Control"
    );
  });

  it("encodes characters that would break the path", () => {
    expect(seriesHref("A/B & C")).toBe("/blog/series/A%2FB%20%26%20C");
  });
});

describe("summarizeSeries", () => {
  it("returns one summary per series, newest series first", () => {
    const result = summarizeSeries(fixtures);
    expect(result.map((s) => s.name)).toEqual([
      "Security Engineering",
      "Game Dev",
      "Quick Tips",
    ]);
  });

  it("counts posts and links to the series page", () => {
    const sec = summarizeSeries(fixtures).find((s) => s.name === "Security Engineering");
    expect(sec?.postCount).toBe(3);
    expect(sec?.href).toBe("/blog/series/Security%20Engineering");
  });

  it("reports the newest post as latest, with its part number", () => {
    const sec = summarizeSeries(fixtures)[0];
    expect(sec.latest).toEqual({ title: "Sec 12", slug: "sec-12", date: "2026-10-16", part: 12 });
  });

  it("breaks a same-day tie by the higher part number", () => {
    const sameDay = [
      post({ slug: "a", date: "2026-06-14", series: "Workflow", seriesOrder: 18 }),
      post({ slug: "b", date: "2026-06-14", series: "Workflow", seriesOrder: 19 }),
    ];
    expect(summarizeSeries(sameDay)[0].latest.slug).toBe("b");
  });

  describe("in a negative-offset timezone", () => {
    const originalTz = process.env.TZ;
    beforeAll(() => {
      process.env.TZ = "America/New_York";
    });
    afterAll(() => {
      process.env.TZ = originalTz;
    });

    it("orders a bare date after a late-evening datetime on the day before", () => {
      // Naive parsing reads "2026-04-18" as UTC midnight, which is the evening
      // of the 17th in New York, and would wrongly sort it before 23:30.
      const mixed = [
        post({ slug: "evening", date: "2026-04-17T23:30:00", series: "S", seriesOrder: 1 }),
        post({ slug: "next-day", date: "2026-04-18", series: "S", seriesOrder: 2 }),
      ];
      expect(summarizeSeries(mixed)[0].latest.slug).toBe("next-day");
      expect(getSeriesInProgress(mixed)?.slug).toBe("next-day");
    });
  });

  it("returns an empty list when no post has a series", () => {
    expect(summarizeSeries([post({ slug: "x" })])).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [...fixtures];
    summarizeSeries(input);
    expect(input).toEqual(fixtures);
  });
});

describe("pickReadingPaths", () => {
  const summaries = summarizeSeries(fixtures);

  it("drops series below the minimum post count", () => {
    expect(pickReadingPaths(summaries).map((s) => s.name)).toEqual([
      "Security Engineering",
      "Game Dev",
    ]);
  });

  it("respects a custom limit and minimum", () => {
    expect(pickReadingPaths(summaries, { limit: 1, minPosts: 1 }).map((s) => s.name)).toEqual([
      "Security Engineering",
    ]);
  });
});

describe("getSeriesInProgress", () => {
  it("returns the series of the newest post that has one", () => {
    expect(getSeriesInProgress(fixtures)).toEqual({
      name: "Security Engineering",
      href: "/blog/series/Security%20Engineering",
      part: 12,
      title: "Sec 12",
      slug: "sec-12",
    });
  });

  it("skips newer posts that are not in a series", () => {
    const posts = [
      post({ slug: "loose", date: "2026-10-20" }),
      post({ slug: "g", date: "2026-10-01", series: "Game Dev", seriesOrder: 3 }),
    ];
    expect(getSeriesInProgress(posts)?.slug).toBe("g");
  });

  it("returns null when nothing is in a series", () => {
    expect(getSeriesInProgress([post({ slug: "x" })])).toBeNull();
  });
});

describe("postKicker", () => {
  it("prefers series and part", () => {
    expect(postKicker({ series: "Ledgerly", seriesOrder: 3, tags: ["AI"] })).toBe("Ledgerly · Part 3");
  });

  it("falls back to the series name without a part", () => {
    expect(postKicker({ series: "Ledgerly", tags: ["AI"] })).toBe("Ledgerly");
  });

  it("falls back to the first tag", () => {
    expect(postKicker({ tags: ["Next.js", "PWA"] })).toBe("Next.js");
  });

  it("falls back to Notes", () => {
    expect(postKicker({ tags: [] })).toBe("Notes");
  });

  it("ignores an empty series string", () => {
    expect(postKicker({ series: "", tags: ["Next.js"] })).toBe("Next.js");
    expect(postKicker({ series: "", tags: [] })).toBe("Notes");
  });
});
