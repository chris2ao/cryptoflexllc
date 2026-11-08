import { loadPerformance } from "@/lib/analytics-queries/performance";
import type { TrafficScope } from "@/lib/analytics-queries/shared";
import { AxPanel } from "../_components/ax-panel";
import { WebVitalsGrid } from "../_components/web-vitals-grid";
import { ApiResponseTable } from "../_components/api-response-table";
import { WebAnalyticsCard } from "../_components/web-analytics-card";
import { DeploysStrip } from "../_components/deploys-strip";
import { ApiResponseChart } from "./lazy-charts";
import { PerformanceOps } from "./performance-ops";

export async function PerformanceSection({
  days,
  scope = "humans",
}: {
  days: number;
  scope?: TrafficScope;
}) {
  const {
    apiMetricsEndpoints: typedApiEndpoints,
    apiMetricsDaily: typedApiDaily,
    webVitalsRaw: typedWebVitals,
    webAnalytics,
    deployments,
  } = await loadPerformance(days, scope);

  const totalRequests = typedApiEndpoints.reduce(
    (s, r) => s + r.total_count,
    0
  );
  const totalErrors = typedApiEndpoints.reduce(
    (s, r) => s + r.error_count,
    0
  );

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">04 · Performance</div>
      <div className="ax-section-head">
        <h2>
          Under the <em>hood.</em>
        </h2>
        <p className="lede">
          Core Web Vitals from real visitor sessions, and API latency across
          server routes.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Core Web Vitals" kicker="P75 WITH GOOGLE BUDGETS">
          <WebVitalsGrid data={typedWebVitals} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel
          title="API response times"
          kicker={`${totalRequests.toLocaleString()} REQUESTS · ${totalErrors} ERRORS`}
        >
          <ApiResponseTable endpoints={typedApiEndpoints} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Daily API latency" kicker="TREND">
          <ApiResponseChart endpoints={typedApiEndpoints} daily={typedApiDaily} />
        </AxPanel>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Vercel Web Analytics" kicker="CROSS-CHECK">
          <WebAnalyticsCard
            state={webAnalytics.state}
            ours={webAnalytics.ours}
            theirs={webAnalytics.theirs}
            daily={webAnalytics.daily}
            days={days}
          />
        </AxPanel>
        <AxPanel title="Deployments" kicker="LAST 10">
          <DeploysStrip deployments={deployments} />
        </AxPanel>
      </div>

      <PerformanceOps />
    </div>
  );
}
