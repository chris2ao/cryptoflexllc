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
