import { describe, it, expect, vi } from "vitest";
import { loadVisitorDossier } from "./visitor";

type Fake = ReturnType<typeof import("@/lib/analytics").getDb>;

/** Tagged-template stub answering by the table named in the SQL text. */
function fakeSql(handlers: Record<string, unknown>, fail = false): Fake {
  const fn = (strings: TemplateStringsArray) => {
    if (fail) return Promise.reject(new Error("down"));
    const text = strings.join("?");
    const key = Object.keys(handlers).find((k) => text.includes(k));
    return Promise.resolve(key ? handlers[key] : []);
  };
  return vi.fn(fn) as unknown as Fake;
}

describe("loadVisitorDossier", () => {
  it("maps rows into the dossier and cleans strings", async () => {
    const sql = fakeSql({
      "MIN(visited_at)": [{ first_seen: "2026-11-01T00:00:00Z", last_seen: "2026-11-02T00:00:00Z", hits: 7 }],
      "traffic_class AS k": [{ k: "human", n: 5 }, { k: "bot", n: 2 }],
      "referrer_class AS k": [{ k: "search", n: 3 }],
      "GROUP BY page_path": [{ page_path: "/blog/x", views: 4, last: "2026-11-02T00:00:00Z" }],
      "DISTINCT user_agent": [{ v: "Mozilla\u202e/5.0" }],
      "DISTINCT city": [
        { city: "Tampa", region: "Florida", country: "United States" },
        { city: "Unknown", region: "Unknown", country: "Unknown" },
      ],
      scroll_events: [{ n: 3, max_depth: 90 }],
      page_engagement: [{ secs: 125 }],
      client_errors: [{ n: 2 }],
      auth_attempts: [{ ok: 1, bad: 4 }],
      subscribers: [{ found: 1 }],
      guestbook: [{ n: 1 }],
    });
    const d = await loadVisitorDossier(sql, "8.8.8.8");
    expect(d.hits).toBe(7);
    expect(d.firstSeen).toBe("2026-11-01T00:00:00.000Z");
    expect(d.classes).toEqual({ human: 5, bot: 2 });
    expect(d.referrerClasses).toEqual({ search: 3 });
    expect(d.pages[0]).toMatchObject({ page_path: "/blog/x", views: 4 });
    expect(d.userAgents).toEqual(["Mozilla /5.0"]);
    expect(d.locations).toEqual(["Tampa, Florida, United States"]);
    expect(d.engagement).toEqual({ scrolls: 3, maxDepth: 90, seconds: 125 });
    expect(d.errors).toBe(2);
    expect(d.auth).toEqual({ success: 1, fail: 4 });
    expect(d.subscriber).toBe(true);
    expect(d.guestbook).toBe(1);
  });

  it("returns an empty dossier when every query fails", async () => {
    const d = await loadVisitorDossier(fakeSql({}, true), "8.8.8.8");
    expect(d).toEqual({
      ip: "8.8.8.8",
      firstSeen: null,
      lastSeen: null,
      hits: 0,
      classes: {},
      pages: [],
      userAgents: [],
      locations: [],
      referrerClasses: {},
      engagement: { scrolls: 0, maxDepth: 0, seconds: 0 },
      errors: 0,
      auth: { success: 0, fail: 0 },
      subscriber: false,
      guestbook: 0,
    });
  });
});
