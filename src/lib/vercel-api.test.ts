import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  fetchFirewallConfig,
  fetchAttackStatus,
  fetchFirewallEvents,
  isVercelApiConfigured,
  parseWebAnalyticsAggregate,
  parseWebAnalyticsCount,
  parseDeployments,
  fetchWebAnalyticsDaily,
  fetchWebAnalyticsCount,
  fetchDeployments,
} from "./vercel-api";

// Mock global fetch
global.fetch = vi.fn();

describe("vercel-api", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.VERCEL_API_TOKEN = "test-token-123";
    process.env.VERCEL_PROJECT_ID = "test-project-id";
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("isVercelApiConfigured", () => {
    it("returns true when both token and project ID are set", () => {
      expect(isVercelApiConfigured()).toBe(true);
    });

    it("returns false when token is missing", () => {
      delete process.env.VERCEL_API_TOKEN;
      expect(isVercelApiConfigured()).toBe(false);
    });

    it("returns false when project ID is missing", () => {
      delete process.env.VERCEL_PROJECT_ID;
      expect(isVercelApiConfigured()).toBe(false);
    });

    it("returns false when both are missing", () => {
      delete process.env.VERCEL_API_TOKEN;
      delete process.env.VERCEL_PROJECT_ID;
      expect(isVercelApiConfigured()).toBe(false);
    });
  });

  describe("fetchFirewallConfig", () => {
    it("fetches firewall config successfully", async () => {
      const mockConfig = {
        ownerId: "owner-123",
        projectKey: "test-project",
        id: "config-id",
        version: 1,
        firewallEnabled: true,
        rules: [],
        ips: [],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig,
      } as Response);

      const result = await fetchFirewallConfig();

      expect(result).toEqual(mockConfig);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.vercel.com/v1/security/firewall/config/active"
        ),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer test-token-123",
            "Content-Type": "application/json",
          },
          next: { revalidate: 300 },
        })
      );
    });

    it("includes projectId in query string", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await fetchFirewallConfig();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("projectId=test-project-id"),
        expect.any(Object)
      );
    });

    it("includes teamId in query string if set", async () => {
      process.env.VERCEL_TEAM_ID = "team-456";

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await fetchFirewallConfig();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("teamId=team-456"),
        expect.any(Object)
      );
    });

    it("throws error if VERCEL_API_TOKEN is not set", async () => {
      delete process.env.VERCEL_API_TOKEN;

      await expect(fetchFirewallConfig()).rejects.toThrow(
        "VERCEL_API_TOKEN is not set"
      );
    });

    it("throws error if VERCEL_PROJECT_ID is not set", async () => {
      delete process.env.VERCEL_PROJECT_ID;

      await expect(fetchFirewallConfig()).rejects.toThrow(
        "VERCEL_PROJECT_ID is not set"
      );
    });

    it("throws error on API error response", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => "Forbidden",
      } as Response);

      await expect(fetchFirewallConfig()).rejects.toThrow(
        "Vercel API error 403: Forbidden"
      );
    });

    it("sets correct revalidation time", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await fetchFirewallConfig();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 300 },
        })
      );
    });
  });

  describe("fetchAttackStatus", () => {
    it("fetches attack status successfully", async () => {
      const mockStatus = {
        anomalies: [
          {
            projectId: "test-project-id",
            ownerId: "owner-123",
            startTime: "2026-02-13T00:00:00Z",
            endTime: "2026-02-13T01:00:00Z",
            atMinute: "2026-02-13T00:30:00Z",
            state: "active",
          },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
      } as Response);

      const result = await fetchAttackStatus();

      expect(result).toEqual(mockStatus);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.vercel.com/v1/security/firewall/attack-status"
        ),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer test-token-123",
            "Content-Type": "application/json",
          },
          next: { revalidate: 60 },
        })
      );
    });

    it("uses default since value of 7 days", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ anomalies: [] }),
      } as Response);

      await fetchAttackStatus();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("since=7"),
        expect.any(Object)
      );
    });

    it("accepts custom since value", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ anomalies: [] }),
      } as Response);

      await fetchAttackStatus(30);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("since=30"),
        expect.any(Object)
      );
    });

    it("throws error on API error response", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error",
      } as Response);

      await expect(fetchAttackStatus()).rejects.toThrow(
        "Vercel API error 500: Internal Server Error"
      );
    });

    it("sets revalidation time to 60 seconds", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ anomalies: [] }),
      } as Response);

      await fetchAttackStatus();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 60 },
        })
      );
    });
  });

  describe("fetchFirewallEvents", () => {
    it("fetches firewall events successfully", async () => {
      const mockEvents = {
        actions: [
          {
            startTime: "2026-02-13T00:00:00Z",
            endTime: "2026-02-13T01:00:00Z",
            isActive: true,
            action_type: "deny",
            host: "cryptoflexllc.com",
            public_ip: "1.2.3.4",
            count: 5,
          },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      } as Response);

      const result = await fetchFirewallEvents();

      expect(result).toEqual(mockEvents);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.vercel.com/v1/security/firewall/events"
        ),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer test-token-123",
            "Content-Type": "application/json",
          },
          next: { revalidate: 60 },
        })
      );
    });

    it("includes timestamps in query string when provided", async () => {
      const startTimestamp = 1707782400000; // 2026-02-13 00:00:00 UTC
      const endTimestamp = 1707786000000; // 2026-02-13 01:00:00 UTC

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: [] }),
      } as Response);

      await fetchFirewallEvents(startTimestamp, endTimestamp);

      const call = vi.mocked(fetch).mock.calls[0][0];
      expect(call).toContain(`startTimestamp=${startTimestamp}`);
      expect(call).toContain(`endTimestamp=${endTimestamp}`);
    });

    it("omits timestamps from query if not provided", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: [] }),
      } as Response);

      await fetchFirewallEvents();

      const call = vi.mocked(fetch).mock.calls[0][0];
      expect(call).not.toContain("startTimestamp");
      expect(call).not.toContain("endTimestamp");
    });

    it("includes only startTimestamp if endTimestamp not provided", async () => {
      const startTimestamp = 1707782400000;

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: [] }),
      } as Response);

      await fetchFirewallEvents(startTimestamp);

      const call = vi.mocked(fetch).mock.calls[0][0];
      expect(call).toContain(`startTimestamp=${startTimestamp}`);
      expect(call).not.toContain("endTimestamp");
    });

    it("throws error on API error response", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      } as Response);

      await expect(fetchFirewallEvents()).rejects.toThrow(
        "Vercel API error 401: Unauthorized"
      );
    });

    it("sets revalidation time to 60 seconds", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: [] }),
      } as Response);

      await fetchFirewallEvents();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 60 },
        })
      );
    });
  });
});

describe("web analytics and deployments", () => {
  const originalEnv = process.env;
  const respond = (status: number, body: unknown) =>
    ({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
      text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
    }) as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.VERCEL_API_TOKEN = "test-token-123";
    process.env.VERCEL_PROJECT_ID = "test-project-id";
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it("parses the aggregate fixture and slices the date", () => {
    expect(
      parseWebAnalyticsAggregate({
        version: 1,
        data: [{ timestamp: "2024-10-01T00:00:00.000Z", pageviews: 220, visitors: 180 }],
      })
    ).toEqual([{ date: "2024-10-01", pageviews: 220, visitors: 180 }]);
    expect(parseWebAnalyticsAggregate(null)).toEqual([]);
  });

  it("parses the count fixture", () => {
    expect(parseWebAnalyticsCount({ data: { pageviews: 9, visitors: 4 } })).toEqual({
      pageviews: 9,
      visitors: 4,
    });
    expect(parseWebAnalyticsCount({})).toEqual({ pageviews: 0, visitors: 0 });
  });

  it("parses deployments, truncating to the first line of 80 characters", () => {
    const long = "x".repeat(120);
    const out = parseDeployments({
      deployments: [
        {
          uid: "d1",
          url: "a.vercel.app",
          state: "READY",
          created: 1000,
          ready: 2000,
          target: "production",
          meta: { githubCommitMessage: `${long}\nbody`, githubCommitSha: "abc123" },
        },
        { uid: "d2", state: "ERROR", created: 3000, target: null, meta: {} },
      ],
    });
    expect(out[0].commitMessage).toHaveLength(80);
    expect(out[0]).toMatchObject({ id: "d1", readyAt: 2000, target: "production", commitSha: "abc123" });
    expect(out[1]).toMatchObject({ id: "d2", readyAt: null, target: "", commitMessage: "" });
    expect(parseDeployments(undefined)).toEqual([]);
  });

  it("maps 404 Web Analytics not found to not-enabled", async () => {
    vi.mocked(fetch).mockResolvedValue(respond(404, "Web Analytics not found"));
    expect(await fetchWebAnalyticsCount("2026-10-01", "2026-10-30")).toEqual({
      state: "not-enabled",
      pageviews: 0,
      visitors: 0,
    });
    expect(await fetchWebAnalyticsDaily("2026-10-01", "2026-10-30")).toEqual({
      state: "not-enabled",
      rows: [],
    });
  });

  it("maps other failures and thrown errors to unavailable", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(respond(500, "boom"));
    expect((await fetchWebAnalyticsCount("a", "b")).state).toBe("unavailable");
    vi.mocked(fetch).mockResolvedValueOnce(respond(404, "other"));
    expect((await fetchWebAnalyticsDaily("a", "b")).state).toBe("unavailable");
    vi.mocked(fetch).mockRejectedValueOnce(new Error("net"));
    expect((await fetchWebAnalyticsDaily("a", "b")).state).toBe("unavailable");
  });

  it("returns ok rows and sends the by=day query with a timeout signal", async () => {
    vi.mocked(fetch).mockResolvedValue(
      respond(200, { data: [{ timestamp: "2026-10-02T00:00:00.000Z", pageviews: 3, visitors: 2 }] })
    );
    const r = await fetchWebAnalyticsDaily("2026-10-01", "2026-10-30");
    expect(r).toEqual({ state: "ok", rows: [{ date: "2026-10-02", pageviews: 3, visitors: 2 }] });
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain("by=day");
    expect(String(url)).toContain("/v1/query/web-analytics/visits/aggregate");
    expect((init as RequestInit).signal).toBeDefined();
  });

  it("fetchDeployments returns [] on failure and never throws", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(respond(403, "no"));
    expect(await fetchDeployments()).toEqual([]);
    vi.mocked(fetch).mockRejectedValueOnce(new Error("net"));
    expect(await fetchDeployments(5)).toEqual([]);
  });
});
