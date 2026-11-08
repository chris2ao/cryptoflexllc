/**
 * Vercel REST API client for fetching firewall, analytics, and speed insights data.
 *
 * Required environment variables:
 *   VERCEL_API_TOKEN   – Bearer token (create at https://vercel.com/account/tokens)
 *   VERCEL_PROJECT_ID  – Project ID (found in Project Settings → General)
 *   VERCEL_TEAM_ID     – Team ID (optional, for team-owned projects)
 */

import type {
  VercelFirewallConfig,
  VercelAttackStatus,
  VercelFirewallEvents,
} from "./analytics-types";

const VERCEL_API_BASE = "https://api.vercel.com";

function getHeaders(): HeadersInit {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) throw new Error("VERCEL_API_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function buildQuery(extra?: Record<string, string | undefined>): string {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) throw new Error("VERCEL_PROJECT_ID is not set");

  const params = new URLSearchParams({ projectId });
  const teamId = process.env.VERCEL_TEAM_ID;
  if (teamId) params.set("teamId", teamId);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined) params.set(k, v);
    }
  }
  return params.toString();
}

/** Fetch the active firewall configuration (rules, managed rulesets, IPs). */
export async function fetchFirewallConfig(): Promise<VercelFirewallConfig> {
  const qs = buildQuery();
  const res = await fetch(
    `${VERCEL_API_BASE}/v1/security/firewall/config/active?${qs}`,
    { headers: getHeaders(), next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Vercel API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** Fetch active attack / anomaly data for the project. */
export async function fetchAttackStatus(
  sinceDays = 7
): Promise<VercelAttackStatus> {
  const qs = buildQuery({ since: String(sinceDays) });
  const res = await fetch(
    `${VERCEL_API_BASE}/v1/security/firewall/attack-status?${qs}`,
    { headers: getHeaders(), next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error(`Vercel API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** Fetch recent firewall events / actions for the project. */
export async function fetchFirewallEvents(
  startTimestamp?: number,
  endTimestamp?: number
): Promise<VercelFirewallEvents> {
  const extra: Record<string, string | undefined> = {};
  if (startTimestamp) extra.startTimestamp = String(startTimestamp);
  if (endTimestamp) extra.endTimestamp = String(endTimestamp);
  const qs = buildQuery(extra);
  const res = await fetch(
    `${VERCEL_API_BASE}/v1/security/firewall/events?${qs}`,
    { headers: getHeaders(), next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error(`Vercel API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** Check if the Vercel API integration is configured. */
export function isVercelApiConfigured(): boolean {
  return !!(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID);
}

// ---------------------------------------------------------------------------
// Web Analytics and deployments (never throw; failures map to a state or [])
// ---------------------------------------------------------------------------

export type WebAnalyticsState = "ok" | "not-enabled" | "unavailable";

export type WebAnalyticsDay = { date: string; pageviews: number; visitors: number };

export type DeploymentSummary = {
  id: string;
  state: string;
  createdAt: number;
  readyAt: number | null;
  target: string;
  commitMessage: string;
  commitSha: string;
  url: string;
};

const API_TIMEOUT_MS = 8000;

function asNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function parseWebAnalyticsAggregate(json: unknown): WebAnalyticsDay[] {
  const data = asRecord(json).data;
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = asRecord(row);
    return {
      date: String(r.timestamp ?? "").slice(0, 10),
      pageviews: asNumber(r.pageviews),
      visitors: asNumber(r.visitors),
    };
  });
}

export function parseWebAnalyticsCount(json: unknown): {
  pageviews: number;
  visitors: number;
} {
  const data = asRecord(asRecord(json).data);
  return { pageviews: asNumber(data.pageviews), visitors: asNumber(data.visitors) };
}

function firstLine(text: unknown, max = 80): string {
  const line = String(text ?? "").split("\n")[0].trim();
  return line.length > max ? line.slice(0, max) : line;
}

export function parseDeployments(json: unknown): DeploymentSummary[] {
  const list = asRecord(json).deployments;
  if (!Array.isArray(list)) return [];
  return list.map((item) => {
    const d = asRecord(item);
    const meta = asRecord(d.meta);
    const ready = Number(d.ready);
    return {
      id: String(d.uid ?? ""),
      state: String(d.state ?? d.readyState ?? "UNKNOWN"),
      createdAt: asNumber(d.created),
      readyAt: Number.isFinite(ready) && d.ready != null ? ready : null,
      target: String(d.target ?? ""),
      commitMessage: firstLine(meta.githubCommitMessage),
      commitSha: String(meta.githubCommitSha ?? ""),
      url: String(d.url ?? ""),
    };
  });
}

type WebAnalyticsResponse =
  | { state: "ok"; json: unknown }
  | { state: "not-enabled" | "unavailable" };

async function getWebAnalytics(
  path: string,
  extra: Record<string, string | undefined>
): Promise<WebAnalyticsResponse> {
  try {
    const res = await fetch(`${VERCEL_API_BASE}${path}?${buildQuery(extra)}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (res.ok) return { state: "ok", json: await res.json() };
    if (res.status === 404) {
      const body = await res.text().catch(() => "");
      if (body.includes("Web Analytics not found")) return { state: "not-enabled" };
    }
    return { state: "unavailable" };
  } catch {
    return { state: "unavailable" };
  }
}

/** Daily pageviews and visitors from Vercel Web Analytics (30 days max on Hobby). */
export async function fetchWebAnalyticsDaily(
  since: string,
  until: string
): Promise<{ state: WebAnalyticsState; rows: WebAnalyticsDay[] }> {
  const r = await getWebAnalytics("/v1/query/web-analytics/visits/aggregate", {
    since,
    until,
    by: "day",
  });
  if (r.state !== "ok") return { state: r.state, rows: [] };
  return { state: "ok", rows: parseWebAnalyticsAggregate(r.json) };
}

/** Total pageviews and visitors from Vercel Web Analytics for a window. */
export async function fetchWebAnalyticsCount(
  since: string,
  until: string
): Promise<{ state: WebAnalyticsState; pageviews: number; visitors: number }> {
  const r = await getWebAnalytics("/v1/query/web-analytics/visits/count", {
    since,
    until,
  });
  if (r.state !== "ok") return { state: r.state, pageviews: 0, visitors: 0 };
  return { state: "ok", ...parseWebAnalyticsCount(r.json) };
}

/** Most recent deployments for the project; [] on any failure. */
export async function fetchDeployments(limit = 10): Promise<DeploymentSummary[]> {
  try {
    const res = await fetch(
      `${VERCEL_API_BASE}/v6/deployments?${buildQuery({ limit: String(limit) })}`,
      {
        headers: getHeaders(),
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      }
    );
    if (!res.ok) return [];
    return parseDeployments(await res.json());
  } catch {
    return [];
  }
}
