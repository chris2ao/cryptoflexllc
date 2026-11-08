import { describe, it, expect, vi } from "vitest";
import type { SqlTag } from "@/lib/analytics-schema";
import { loadDailyEngagement } from "./overview-engagement";

function tagReturning(rows: unknown[] | Error) {
  return vi.fn((..._a: unknown[]) =>
    rows instanceof Error ? Promise.reject(rows) : Promise.resolve(rows),
  ) as unknown as SqlTag & ReturnType<typeof vi.fn>;
}

const queryText = (tag: ReturnType<typeof tagReturning>) =>
  ((tag as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as string[]).join("?");

describe("loadDailyEngagement", () => {
  it("maps rows with a numeric zero fill", async () => {
    const tag = tagReturning([
      { date: "2026-11-01", readers: "4", read_through_pct: "12.5", reader_minutes: "7" },
      { date: "2026-11-02", readers: null, read_through_pct: null, reader_minutes: null },
    ]);
    expect(await loadDailyEngagement(tag, 30, "human")).toEqual([
      { date: "2026-11-01", readers: 4, read_through_pct: 12.5, reader_minutes: 7 },
      { date: "2026-11-02", readers: 0, read_through_pct: 0, reader_minutes: 0 },
    ]);
  });

  it("returns [] when the query fails", async () => {
    const tag = vi.fn(() => ({ catch: (f: () => unknown) => f() })) as unknown as SqlTag;
    expect(await loadDailyEngagement(tag, 30, null)).toEqual([]);
  });

  it("guards read-through against NULL so quiet days read 0", async () => {
    const tag = tagReturning([]);
    await loadDailyEngagement(tag, 30, "human");
    const q = queryText(tag);
    expect(q).toContain("WHEN COALESCE(blog.views, 0) = 0 THEN 0");
    expect(q).not.toContain("LEAST(100, ROUND(100.0 * done.done");
  });

  it("counts readers over the scroll and engagement union with the view scope", async () => {
    const tag = tagReturning([]);
    await loadDailyEngagement(tag, 30, "human");
    const q = queryText(tag);
    expect(q).toContain("COUNT(DISTINCT u.ip_address)");
    expect(q).toContain("FROM scroll_events");
    expect(q).toContain("UNION ALL");
    expect(q).toContain("FROM page_engagement");
    expect(q).toContain("EXISTS");
    expect(q).toContain("ROUND(mins.seconds / 60.0)");
  });
});
