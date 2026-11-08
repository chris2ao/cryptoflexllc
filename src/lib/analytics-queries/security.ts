import { getDb } from "@/lib/analytics";
import { scopeClass, type TrafficScope } from "./shared";
import type {
  AuthAttemptRow,
  BotTrendRow,
  ClientErrorRow,
  ClientErrorTrendRow,
  RecentVisit,
  VercelAttackStatus,
  VercelFirewallConfig,
  VercelFirewallEvents,
} from "@/lib/analytics-types";
import {
  isVercelApiConfigured,
  fetchFirewallConfig,
  fetchAttackStatus,
  fetchFirewallEvents,
} from "@/lib/vercel-api";

export interface VercelFirewallBundle {
  vercelFirewallConfig: VercelFirewallConfig | null;
  vercelAttackStatus: VercelAttackStatus | null;
  vercelFirewallEvents: VercelFirewallEvents | null;
}

async function loadVercelFirewall(
  days: number
): Promise<VercelFirewallBundle> {
  let vercelFirewallConfig: VercelFirewallConfig | null = null;
  let vercelAttackStatus: VercelAttackStatus | null = null;
  let vercelFirewallEvents: VercelFirewallEvents | null = null;

  if (isVercelApiConfigured()) {
    const now = Date.now();
    const sinceTs = now - days * 24 * 60 * 60 * 1000;

    const [fwConfig, atkStatus, fwEvents] = await Promise.allSettled([
      fetchFirewallConfig(),
      fetchAttackStatus(days),
      fetchFirewallEvents(sinceTs, now),
    ]);

    if (fwConfig.status === "fulfilled") vercelFirewallConfig = fwConfig.value;
    else console.error("Vercel firewall config error:", fwConfig.reason);

    if (atkStatus.status === "fulfilled") vercelAttackStatus = atkStatus.value;
    else console.error("Vercel attack status error:", atkStatus.reason);

    if (fwEvents.status === "fulfilled") vercelFirewallEvents = fwEvents.value;
    else console.error("Vercel firewall events error:", fwEvents.reason);
  }

  return { vercelFirewallConfig, vercelAttackStatus, vercelFirewallEvents };
}

export interface SecurityData {
  botTrend: BotTrendRow[];
  authAttempts: AuthAttemptRow[];
  clientErrorTrend: ClientErrorTrendRow[];
  clientErrorRecent: ClientErrorRow[];
  clientErrorCount: { total: number }[];
  firewall: VercelFirewallBundle;
  recent: RecentVisit[];
}

export async function loadSecurity(
  days: number,
  scope: TrafficScope = "humans"
): Promise<SecurityData> {
  const sql = getDb();
  const sc = scopeClass(scope);

  const [botTrend, authAttempts, clientErrorTrend, clientErrorRecent, clientErrorCount, recent] =
    await Promise.all([
      // Bot trend spans every class on purpose: scoping it to humans would hide the bots.
      sql`
        SELECT
          DATE(visited_at)::text AS date,
          COUNT(*) FILTER (WHERE device_type = 'Bot' OR traffic_class = 'bot')::int AS bot_count,
          COUNT(*) FILTER (WHERE device_type != 'Bot' AND traffic_class IS DISTINCT FROM 'bot')::int AS human_count,
          CASE
            WHEN COUNT(*) > 0
            THEN ROUND(COUNT(*) FILTER (WHERE device_type = 'Bot' OR traffic_class = 'bot')::numeric / COUNT(*) * 100, 1)
            ELSE 0
          END AS bot_pct
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY DATE(visited_at)
        ORDER BY date
      `.catch(() => []),
      sql`
        SELECT
          DATE(attempted_at)::text AS date,
          COUNT(*) FILTER (WHERE success = TRUE)::int AS success_count,
          COUNT(*) FILTER (WHERE success = FALSE)::int AS fail_count
        FROM auth_attempts
        WHERE attempted_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY DATE(attempted_at)
        ORDER BY date
      `.catch(() => []),
      sql`
        SELECT
          DATE(recorded_at)::text AS date,
          COUNT(*)::int AS error_count,
          COUNT(DISTINCT error_message)::int AS unique_errors
        FROM client_errors
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY DATE(recorded_at)
        ORDER BY date
      `.catch(() => []),
      sql`
        SELECT id, recorded_at, page_path, error_message, error_type, error_stack, source, ip_address, browser, os
        FROM client_errors
        ORDER BY recorded_at DESC LIMIT 20
      `.catch(() => []),
      sql`
        SELECT COUNT(*)::int AS total
        FROM client_errors
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
      `.catch(() => [{ total: 0 }]),
      sql`
        SELECT id, visited_at, page_path, ip_address, browser, os,
               device_type, referrer, country, city, region
        FROM page_views
        WHERE (${sc}::text IS NULL OR traffic_class = ${sc})
        ORDER BY visited_at DESC LIMIT 50
      `.catch(() => []),
    ]);

  const firewall = await loadVercelFirewall(days);

  return {
    botTrend: botTrend as unknown as BotTrendRow[],
    authAttempts: authAttempts as unknown as AuthAttemptRow[],
    clientErrorTrend: clientErrorTrend as unknown as ClientErrorTrendRow[],
    clientErrorRecent: clientErrorRecent as unknown as ClientErrorRow[],
    clientErrorCount: clientErrorCount as unknown as { total: number }[],
    firewall: firewall as unknown as VercelFirewallBundle,
    recent: recent as unknown as RecentVisit[],
  };
}
