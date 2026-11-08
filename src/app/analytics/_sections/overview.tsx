import { loadOverview } from "@/lib/analytics-queries/overview";
import { KpiStrip } from "../_components/kpi-strip";
import { LiveFeed } from "../_components/live-feed";
import { TrendChartPanel, type TrendSeries } from "../_components/trend-chart-panel";
import { AxPanel } from "../_components/ax-panel";
import { PeakHoursHeatmap } from "./lazy-charts";

export async function OverviewSection({ days }: { days: number }) {
  const {
    newVsReturning: typedNewVsReturning,
    dailyViews: typedDailyViews,
    hourlyHeatmap: typedHeatmap,
    summary,
    bounceData,
  } = await loadOverview(days);

  const stats = summary[0] || {
    total_views: 0,
    unique_visitors: 0,
    first_visit: null,
    last_visit: null,
  };

  const bounceStats = bounceData[0] || { single_page: 0, total_visitors: 0 };
  const bounceRate =
    bounceStats.total_visitors > 0
      ? Math.round((bounceStats.single_page / bounceStats.total_visitors) * 100)
      : 0;

  const totalNew = typedNewVsReturning.reduce((s, r) => s + r.new_visitors, 0);
  const totalReturning = typedNewVsReturning.reduce(
    (s, r) => s + r.returning_visitors,
    0
  );

  // Sparkline data from daily views (last N points each)
  const viewsSpark = typedDailyViews.map((r) => r.views);
  const uniquesSpark = typedDailyViews.map((r) => r.unique_visitors);

  // Computed KPIs
  const kpiItems = [
    {
      id: "views",
      label: "Total Views",
      value: stats.total_views ?? 0,
      spark: viewsSpark,
      hint: "▲",
    },
    {
      id: "uniques",
      label: "Unique Visitors",
      value: stats.unique_visitors ?? 0,
      spark: uniquesSpark,
      hint: "▲",
    },
    {
      id: "bounce",
      label: "Bounce Rate",
      value: bounceRate,
      format: "percent" as const,
      unit: "%",
      hint: bounceRate > 60 ? "▼" : "—",
    },
    {
      id: "new",
      label: "New / Returning",
      value: totalNew,
      hint: `${totalReturning} returning`,
    },
  ];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">01 · Overview</div>
      <div className="ax-section-head">
        <h2>
          The <em>big picture.</em>
        </h2>
        <p className="lede">
          Top-of-funnel metrics, trend over the selected range, and a tail
          of recent events.
        </p>
      </div>

      <KpiStrip items={kpiItems} />

      <div style={{ marginBottom: 20 }}>
        <TrendChartPanel
          series={{
            views: typedDailyViews.map((r) => {
              const nvr = typedNewVsReturning.find((n) => n.date === r.date);
              return {
                date: r.date,
                total: r.views,
                new: nvr?.new_visitors ?? 0,
                returning: nvr?.returning_visitors ?? 0,
              };
            }),
            uniques: typedDailyViews.map((r) => ({
              date: r.date,
              value: r.unique_visitors,
            })),
            new: typedNewVsReturning.map((r) => ({
              date: r.date,
              value: r.new_visitors,
            })),
            bounce: [],
          } satisfies TrendSeries}
          days={days}
        />
      </div>

      <div className="ax-grid-12" style={{ marginBottom: 20 }}>
        <AxPanel title="Peak hours" kicker="TRAFFIC BY DAY × HOUR">
          <PeakHoursHeatmap data={typedHeatmap} />
        </AxPanel>
        <LiveFeed />
      </div>
    </div>
  );
}
