import { loadOverview } from "@/lib/analytics-queries/overview";
import { deltaPercent, type TrafficScope } from "@/lib/analytics-queries/shared";
import { KpiStrip, type KpiItem } from "../_components/kpi-strip";
import { LiveFeed } from "../_components/live-feed";
import { TrendChartPanel, type TrendSeries } from "../_components/trend-chart-panel";
import { AxPanel } from "../_components/ax-panel";
import { ShippingPanel } from "../_components/shipping-panel";
import { BotTrendChart, PeakHoursHeatmap } from "./lazy-charts";

export async function OverviewSection({
  days,
  scope = "humans",
}: {
  days: number;
  scope?: TrafficScope;
}) {
  const {
    newVsReturning: typedNewVsReturning,
    dailyViews: typedDailyViews,
    hourlyHeatmap: typedHeatmap,
    kpis,
    trend,
    publishDates,
    shipping,
  } = await loadOverview(days, scope);
  const botShare = trend.reduce((s, r) => s + r.bots, 0);
  const totalShare = trend.reduce((s, r) => s + r.humans + r.bots, 0);
  const botPct = totalShare > 0 ? Math.round((botShare / totalShare) * 100) : 0;

  // Sparkline data from daily views
  const viewsSpark = typedDailyViews.map((r) => r.views);
  const uniquesSpark = typedDailyViews.map((r) => r.unique_visitors);

  const kpiItems: KpiItem[] = [
    {
      id: "views",
      label: "Views",
      value: kpis.views.current,
      delta: deltaPercent(kpis.views.current, kpis.views.previous),
      spark: viewsSpark,
    },
    {
      id: "readers",
      label: "Readers",
      value: kpis.readers.current,
      delta: deltaPercent(kpis.readers.current, kpis.readers.previous),
      spark: uniquesSpark,
    },
    {
      id: "read-through",
      label: "Read-through",
      value: kpis.readThrough.current,
      format: "percent",
      unit: "%",
      delta: deltaPercent(kpis.readThrough.current, kpis.readThrough.previous),
    },
    {
      id: "reader-minutes",
      label: "Reader minutes",
      value: kpis.readerMinutes.current,
      delta: deltaPercent(
        kpis.readerMinutes.current,
        kpis.readerMinutes.previous
      ),
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

      <div style={{ marginBottom: 20 }}>
        <AxPanel
          title="Humans and bots"
          kicker={`${botPct}% BOTS · ${publishDates.length} POSTS PUBLISHED`}
        >
          <BotTrendChart data={[]} series={trend} markers={publishDates} />
        </AxPanel>
      </div>

      <div className="ax-grid-12" style={{ marginBottom: 20 }}>
        <AxPanel title="Peak hours" kicker="TRAFFIC BY DAY × HOUR">
          <PeakHoursHeatmap data={typedHeatmap} />
        </AxPanel>
        <LiveFeed />
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Shipping" kicker="COMMITS AND DEPLOYS">
          <ShippingPanel shipping={shipping} />
        </AxPanel>
      </div>
    </div>
  );
}
