import { loadPerformance } from "@/lib/analytics-queries/performance";
import { VercelAnalyticsCard } from "../_components/vercel-analytics-card";
import { AxPanel } from "../_components/ax-panel";
import { WebVitalsGrid } from "../_components/web-vitals-grid";
import { ApiResponseTable } from "../_components/api-response-table";
import { ApiResponseChart } from "./lazy-charts";

export async function PerformanceSection({ days }: { days: number }) {
  const {
    apiMetricsEndpoints: typedApiEndpoints,
    apiMetricsDaily: typedApiDaily,
    webVitalsRaw: typedWebVitals,
    topPages: typedTopPages,
    topCountries: typedCountries,
    summaryRow,
  } = await loadPerformance(days);

  const stats = summaryRow[0] || { total_views: 0, unique_visitors: 0 };

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

      <div className="ax-grid-2">
        <AxPanel title="Daily API latency" kicker="TREND">
          <ApiResponseChart endpoints={typedApiEndpoints} daily={typedApiDaily} />
        </AxPanel>
        <AxPanel title="Vercel summary" kicker="PROXY SNAPSHOT">
          <VercelAnalyticsCard
            totalViews={stats.total_views || 0}
            uniqueVisitors={stats.unique_visitors || 0}
            topPage={typedTopPages[0]?.page_path || null}
            topCountry={typedCountries[0]?.country || null}
          />
        </AxPanel>
      </div>
    </div>
  );
}
