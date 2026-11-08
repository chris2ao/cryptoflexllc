import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../cleanup-rate-limits/route";

const mockSql = vi.fn();
vi.mock("@/lib/analytics", () => ({ getDb: vi.fn(() => mockSql) }));

function req(withAuth: boolean) {
  return new NextRequest("http://localhost/api/cron/cleanup-rate-limits", {
    headers: withAuth ? { authorization: "Bearer test-secret" } : {},
  });
}

describe("cleanup-rate-limits cron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
    mockSql.mockResolvedValue({ count: 6 });
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("rejects requests without the bearer", async () => {
    const res = await GET(req(false));
    expect(res.status).toBe(401);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("deletes expired rows, reports the count and records a cron run", async () => {
    const res = await GET(req(true));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, deleted: 6 });
    const insert = mockSql.mock.calls.find((c) =>
      (c[0] as TemplateStringsArray).join("?").includes("INSERT INTO cron_runs"),
    );
    expect(insert?.[1]).toBe("cleanup-rate-limits");
    expect(insert?.[2]).toBe(true);
    expect(insert?.[4]).toBe("deleted 6");
  });

  it("returns 500 and records a failed run when the delete throws", async () => {
    mockSql.mockImplementation((strings: TemplateStringsArray) => {
      if (strings.join("?").includes("DELETE FROM rate_limits")) {
        return Promise.reject(new Error("db down"));
      }
      return Promise.resolve([]);
    });
    const res = await GET(req(true));
    expect(res.status).toBe(500);
    const insert = mockSql.mock.calls.find((c) =>
      (c[0] as TemplateStringsArray).join("?").includes("INSERT INTO cron_runs"),
    );
    expect(insert?.[2]).toBe(false);
    expect(insert?.[4]).toBe("db down");
  });
});
