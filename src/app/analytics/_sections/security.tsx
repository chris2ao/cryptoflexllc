import { deltaPercent, type TrafficScope } from "@/lib/analytics-queries/shared";
import { loadSecurity } from "@/lib/analytics-queries/security";
import { isVercelApiConfigured } from "@/lib/vercel-api";
import { VercelFirewallCard } from "../_components/vercel-firewall-card";
import { ClientErrorsPanel } from "../_components/client-errors-panel";
import { RecentVisitsTable } from "../_components/recent-visits-table";
import { KpiStrip } from "../_components/kpi-strip";
import { AxPanel } from "../_components/ax-panel";
import { NetworkTypesPanel } from "../_components/network-types-panel";
import { KnownBadPanel } from "../_components/known-bad-panel";
import { BotTrendChart, AuthAttemptsChart } from "./lazy-charts";

export async function SecuritySection({ days, scope = "humans" }: { days: number; scope?: TrafficScope }) {
  const {
    kpis,
    networkTypes,
    knownBad,
    botTrend: typedBotTrend,
    authAttempts: typedAuthAttempts,
    clientErrorTrend: typedErrorTrend,
    clientErrorRecent: typedErrorRecent,
    clientErrorCount,
    firewall,
    recent: typedRecent,
  } = await loadSecurity(days, scope);

  const errorTotal = (clientErrorCount[0] || { total: 0 }).total;

  const { vercelFirewallConfig, vercelAttackStatus, vercelFirewallEvents } =
    firewall;

  const secKpis = [
    {
      id: "bots",
      label: "Bots",
      value: kpis.bots.current,
      delta: deltaPercent(kpis.bots.current, kpis.bots.previous),
    },
    {
      id: "known-bad",
      label: "Known bad",
      value: kpis.knownBad.current,
      delta: deltaPercent(kpis.knownBad.current, kpis.knownBad.previous),
    },
    {
      id: "auth",
      label: "Auth failures",
      value: kpis.authFailures.current,
      delta: deltaPercent(kpis.authFailures.current, kpis.authFailures.previous),
    },
    {
      id: "client-err",
      label: "Client errors",
      value: kpis.clientErrors.current,
      delta: deltaPercent(kpis.clientErrors.current, kpis.clientErrors.previous),
    },
  ];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">05 · Security</div>
      <div className="ax-section-head">
        <h2>
          Firewall, <em>bots, auth.</em>
        </h2>
        <p className="lede">
          Edge denials, bot vs human traffic, authentication attempts, and
          client-side errors.
        </p>
      </div>

      <KpiStrip items={secKpis} />

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Bot vs human" kicker="TRAFFIC MIX">
          <BotTrendChart data={typedBotTrend} />
        </AxPanel>
        <AxPanel title="Auth attempts" kicker="SUCCESS / FAIL">
          <AuthAttemptsChart data={typedAuthAttempts} />
        </AxPanel>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Network types" kicker="VISITORS">
          <NetworkTypesPanel data={networkTypes} />
        </AxPanel>
        <AxPanel title="Known bad" kicker={`${knownBad.visitors} IN RANGE`}>
          <KnownBadPanel rows={knownBad.rows} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Firewall" kicker={isVercelApiConfigured() ? "VERCEL EDGE" : "NOT CONFIGURED"}>
          {isVercelApiConfigured() ? (
            <VercelFirewallCard
              config={vercelFirewallConfig}
              attackStatus={vercelAttackStatus}
              events={vercelFirewallEvents}
            />
          ) : (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>
              Set <code>VERCEL_API_TOKEN</code> and <code>VERCEL_PROJECT_ID</code> to
              display live firewall data.
            </p>
          )}
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Client errors" kicker={`${errorTotal} IN RANGE`}>
          <ClientErrorsPanel
            trend={typedErrorTrend}
            recent={typedErrorRecent}
            totalCount={errorTotal}
          />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RecentVisitsTable data={typedRecent} />
      </div>
    </div>
  );
}
