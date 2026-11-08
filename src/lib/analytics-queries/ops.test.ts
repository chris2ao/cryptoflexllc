import { describe, it, expect, beforeEach } from "vitest";
import { vi } from "vitest";

type Call = { text: string; values: unknown[] };
const calls: Call[] = [];
let responder: (text: string) => Promise<unknown[]> = async () => [];
const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  const text = strings.join("?");
  calls.push({ text, values });
  return responder(text);
};
vi.mock("@/lib/analytics", () => ({ getDb: () => sql }));

import { loadOps } from "./ops";

beforeEach(() => {
  calls.length = 0;
  responder = async () => [];
});

describe("loadOps", () => {
  it("coerces table numbers and maps the three result sets", async () => {
    responder = async (text) => {
      if (text.includes("pg_stat_user_tables"))
        return [{ name: "page_views", rows: "1200", bytes: "5242880" }];
      if (text.includes("FROM cron_runs"))
        return [{ name: "j", ran_at: new Date("2026-11-01T00:00:00Z"), ok: true, duration_ms: 5, note: "n" }];
      return [{ route: "/api/x", kind: "db-error", count: "3", last: "2026-11-02T00:00:00Z" }];
    };
    const out = await loadOps();
    expect(out.tables).toEqual([{ name: "page_views", rows: 1200, bytes: 5242880 }]);
    expect(out.cronRuns[0]).toMatchObject({ name: "j", ok: true, ran_at: "2026-11-01T00:00:00.000Z" });
    expect(out.serverEvents7d).toEqual([
      { route: "/api/x", kind: "db-error", count: 3, last: "2026-11-02T00:00:00Z" },
    ]);
    expect(calls.find((c) => c.text.includes("server_events"))?.text).toContain("7 days");
  });

  it("falls back to empty lists when every query fails", async () => {
    responder = async () => {
      throw new Error("down");
    };
    expect(await loadOps()).toEqual({ tables: [], cronRuns: [], serverEvents7d: [] });
  });
});
