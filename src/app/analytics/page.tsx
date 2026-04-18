/**
 * /analytics -- Visitor Analytics Dashboard
 * -----------------------------------------------
 * Server-rendered dashboard organized by category with tooltips on
 * every panel. Protected by httpOnly cookie auth.
 *
 * SECTIONS:
 *   1. Overview -- KPI cards, page views trend, peak hours heatmap
 *   2. Audience & Geography -- map, countries, new vs returning
 *   3. Content & Engagement -- top pages, referrers, scroll depth, time on page
 *   4. Technology -- browsers, devices, OS
 *   5. Server Telemetry -- API response times, error rates
 *   6. Performance -- Web Vitals (Speed Insights)
 *   7. Security -- Vercel Firewall, bot traffic, auth attempts
 *   8. Newsletter & Comments -- subscriber management, comment moderation
 *   9. Recent Activity -- visit log + data tables
 *
 * PERFORMANCE:
 *   - Queries are split across 3 async server components (above-fold, mid-fold, below-fold)
 *   - Each section is wrapped in <Suspense> so sections stream independently
 *   - All 15 Recharts components are lazy-loaded via dynamic() to eliminate the
 *     300KB+ eager Recharts bundle from the initial JS payload
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { getDb } from "@/lib/analytics";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import gmailMetricsRaw from "@/data/gmail-metrics.json";
import sessionArchiveRaw from "@/data/session-archive.json";
import type {
  DailyViews,
  MapLocation,
  TopPageRow,
  CountryRow,
  BrowserRow,
  DeviceRow,
  OsRow,
  RecentVisit,
  SubscriberRow,
  CommentRow,
  GuestbookRow,
  VercelFirewallConfig,
  VercelAttackStatus,
  VercelFirewallEvents,
  WebVitalsSummary,
  ReferrerRow,
  HourlyHeatmapRow,
  ScrollDepthRow,
  TimeOnPageRow,
  ApiMetricRow,
  ApiMetricDailyRow,
  BotTrendRow,
  AuthAttemptRow,
  NewVsReturningRow,
  ClientErrorTrendRow,
  ClientErrorRow,
  CampaignRow,
  SubscriberGrowthRow,
  ConvertingPageRow,
  SearchQueryRow,
  GmailRun,
  SessionEntry,
} from "@/lib/analytics-types";
import {
  isVercelApiConfigured,
  fetchFirewallConfig,
  fetchAttackStatus,
  fetchFirewallEvents,
} from "@/lib/vercel-api";
import { DataTable } from "./_components/data-table";
import { VisitorMapDynamic } from "./_components/visitor-map-dynamic";
import { VercelFirewallCard } from "./_components/vercel-firewall-card";
import { VercelAnalyticsCard } from "./_components/vercel-analytics-card";
import { SubscriberPanel } from "./_components/subscriber-panel";
import { CommentsPanel } from "./_components/comments-panel";
import { GuestbookPanel } from "./_components/guestbook-panel";
import { CampaignPanel } from "./_components/campaign-panel";
import { SearchQueriesPanel } from "./_components/search-queries-panel";
import { ClientErrorsPanel } from "./_components/client-errors-panel";
import { RecentVisitsTable } from "./_components/recent-visits-table";
import { GmailRunsPanel } from "./_components/gmail-runs-panel";
import { SessionArchivePanel } from "./_components/session-archive-panel";
import { AnalyticsShell, DEFAULT_TABS } from "./_components/analytics-shell";
import { LiveClock } from "./_components/live-clock";
import { LogoutButton } from "./_components/logout-button";
import { KpiStrip } from "./_components/kpi-strip";
import { LiveFeed } from "./_components/live-feed";
import { TrendChartPanel, type TrendSeries } from "./_components/trend-chart-panel";
import { AxPanel } from "./_components/ax-panel";
import { AxRankedList } from "./_components/ax-ranked-list";
import { AxDonut } from "./_components/ax-donut";
import { WebVitalsGrid } from "./_components/web-vitals-grid";
import { ApiResponseTable } from "./_components/api-response-table";

// ---------------------------------------------------------------------------
// Lazy-loaded Recharts chart components (eliminates 300KB+ eager bundle)
// ---------------------------------------------------------------------------

function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full animate-pulse bg-muted/20 rounded-lg" />
  );
}

function TallChartSkeleton() {
  return (
    <div className="h-[400px] w-full animate-pulse bg-muted/20 rounded-lg" />
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse bg-muted/20 rounded" />
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

// Charts replaced by editorial primitives (AxRankedList, AxDonut, TrendChartPanel).
// The underlying components are retained in _components/ for other usages.

const PeakHoursHeatmap = nextDynamic(
  () => import("./_components/peak-hours-heatmap").then((m) => m.PeakHoursHeatmap),
  { loading: () => <ChartSkeleton /> }
);

const ScrollDepthChart = nextDynamic(
  () => import("./_components/scroll-depth-chart").then((m) => m.ScrollDepthChart),
  { loading: () => <ChartSkeleton /> }
);

const TimeOnPageChart = nextDynamic(
  () => import("./_components/time-on-page-chart").then((m) => m.TimeOnPageChart),
  { loading: () => <ChartSkeleton /> }
);

const ApiResponseChart = nextDynamic(
  () => import("./_components/api-response-chart").then((m) => m.ApiResponseChart),
  { loading: () => <TallChartSkeleton /> }
);

const BotTrendChart = nextDynamic(
  () => import("./_components/bot-trend-chart").then((m) => m.BotTrendChart),
  { loading: () => <ChartSkeleton /> }
);

const AuthAttemptsChart = nextDynamic(
  () => import("./_components/auth-attempts-chart").then((m) => m.AuthAttemptsChart),
  { loading: () => <ChartSkeleton /> }
);

const NewVsReturningChart = nextDynamic(
  () => import("./_components/new-vs-returning-chart").then((m) => m.NewVsReturningChart),
  { loading: () => <ChartSkeleton /> }
);

const SubscriberGrowthChart = nextDynamic(
  () => import("./_components/subscriber-growth-chart").then((m) => m.SubscriberGrowthChart),
  { loading: () => <ChartSkeleton /> }
);

const GmailMetricsChart = nextDynamic(
  () => import("./_components/gmail-metrics-chart").then((m) => m.GmailMetricsChart),
  { loading: () => <TallChartSkeleton /> }
);

// ---------------------------------------------------------------------------
// Skeleton fallbacks for Suspense boundaries
// ---------------------------------------------------------------------------

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse bg-muted/20 rounded-lg" />
        ))}
      </div>
      <TallChartSkeleton />
      <ChartSkeleton />
    </div>
  );
}

function AudienceSkeleton() {
  return <SectionSkeleton />;
}

function ContentSkeleton() {
  return <SectionSkeleton />;
}

function TechSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse bg-muted/20 rounded" />
      <div className="grid lg:grid-cols-3 gap-8">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

function TelemetrySkeleton() {
  return <SectionSkeleton />;
}

function SecuritySkeleton() {
  return <SectionSkeleton />;
}

function NewsletterSkeleton() {
  return <SectionSkeleton />;
}

function ActivitySkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse bg-muted/20 rounded" />
      <div className="h-64 animate-pulse bg-muted/20 rounded-lg" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section server components: each owns its own data fetching
// ---------------------------------------------------------------------------

async function OverviewSection({ days }: { days: number }) {
  const sql = getDb();

  const [summary, dailyViews, hourlyHeatmap, bounceData, newVsReturning] =
    await Promise.all([
      sql`
        SELECT
          COUNT(*)::int AS total_views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors,
          MIN(visited_at) AS first_visit,
          MAX(visited_at) AS last_visit
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      `,
      sql`
        SELECT
          DATE(visited_at)::text AS date,
          COUNT(*)::int AS views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY DATE(visited_at)
        ORDER BY date
      `,
      sql`
        SELECT
          EXTRACT(DOW FROM visited_at)::int AS day_of_week,
          EXTRACT(HOUR FROM visited_at)::int AS hour,
          COUNT(*)::int AS views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY day_of_week, hour
      `.catch(() => []),
      sql`
        WITH visitor_pages AS (
          SELECT ip_address, COUNT(DISTINCT page_path)::int AS page_count
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          GROUP BY ip_address
        )
        SELECT
          COUNT(*) FILTER (WHERE page_count = 1)::int AS single_page,
          COUNT(*)::int AS total_visitors
        FROM visitor_pages
      `.catch(() => [{ single_page: 0, total_visitors: 0 }]),
      sql`
        WITH daily_visitors AS (
          SELECT
            DATE(visited_at) AS visit_date,
            ip_address,
            MIN(visited_at) OVER (PARTITION BY ip_address) AS first_ever
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        )
        SELECT
          visit_date::text AS date,
          COUNT(DISTINCT CASE WHEN DATE(first_ever) = visit_date THEN ip_address END)::int AS new_visitors,
          COUNT(DISTINCT CASE WHEN DATE(first_ever) < visit_date THEN ip_address END)::int AS returning_visitors
        FROM daily_visitors
        GROUP BY visit_date
        ORDER BY visit_date
      `.catch(() => []),
    ]);

  const stats = summary[0] || {
    total_views: 0,
    unique_visitors: 0,
    first_visit: null,
    last_visit: null,
  };

  const bounceStats = (
    bounceData as unknown as { single_page: number; total_visitors: number }[]
  )[0] || { single_page: 0, total_visitors: 0 };
  const bounceRate =
    bounceStats.total_visitors > 0
      ? Math.round((bounceStats.single_page / bounceStats.total_visitors) * 100)
      : 0;

  const typedNewVsReturning = newVsReturning as unknown as NewVsReturningRow[];
  const totalNew = typedNewVsReturning.reduce((s, r) => s + r.new_visitors, 0);
  const totalReturning = typedNewVsReturning.reduce(
    (s, r) => s + r.returning_visitors,
    0
  );

  const typedDailyViews = dailyViews as unknown as DailyViews[];
  const typedHeatmap = hourlyHeatmap as unknown as HourlyHeatmapRow[];

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

async function AudienceSection({ days }: { days: number }) {
  const sql = getDb();

  const [mapLocations, topCountries, newVsReturning] = await Promise.all([
    sql`
      SELECT
        latitude, longitude,
        COUNT(*)::int AS views,
        MAX(city) AS city, MAX(country) AS country
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND latitude IS NOT NULL AND latitude != ''
        AND longitude IS NOT NULL AND longitude != ''
      GROUP BY latitude, longitude
      ORDER BY views DESC LIMIT 200
    `,
    sql`
      SELECT country, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_visitors
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY country ORDER BY views DESC LIMIT 20
    `,
    sql`
      WITH daily_visitors AS (
        SELECT
          DATE(visited_at) AS visit_date,
          ip_address,
          MIN(visited_at) OVER (PARTITION BY ip_address) AS first_ever
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      )
      SELECT
        visit_date::text AS date,
        COUNT(DISTINCT CASE WHEN DATE(first_ever) = visit_date THEN ip_address END)::int AS new_visitors,
        COUNT(DISTINCT CASE WHEN DATE(first_ever) < visit_date THEN ip_address END)::int AS returning_visitors
      FROM daily_visitors
      GROUP BY visit_date
      ORDER BY visit_date
    `.catch(() => []),
  ]);

  const typedMapLocations = mapLocations as unknown as MapLocation[];
  const typedCountries = topCountries as unknown as CountryRow[];
  const typedNewVsReturning = newVsReturning as unknown as NewVsReturningRow[];

  const countryItems = typedCountries.slice(0, 10).map((c) => ({
    label: c.country || "Unknown",
    value: c.views,
    sublabel: `${c.unique_visitors.toLocaleString()} visitors`,
  }));

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">02 · Audience</div>
      <div className="ax-section-head">
        <h2>
          Who&apos;s <em>coming through.</em>
        </h2>
        <p className="lede">
          Geographic distribution, new vs returning, and the long tail of
          where visitors originate.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Visitor map" kicker={`${typedMapLocations.length} CITIES`}>
          <VisitorMapDynamic data={typedMapLocations} />
        </AxPanel>
      </div>

      <div className="ax-grid-12" style={{ marginBottom: 20 }}>
        <AxPanel title="Top countries" kicker={`TOP ${countryItems.length}`}>
          <AxRankedList items={countryItems} />
        </AxPanel>
        <AxPanel title="New vs returning" kicker="DAILY">
          <NewVsReturningChart data={typedNewVsReturning} />
        </AxPanel>
      </div>
    </div>
  );
}

async function ContentSection({ days }: { days: number }) {
  const sql = getDb();

  const [topPages, referrers, scrollDepth, timeOnPage, campaignData, searchQueries] =
    await Promise.all([
      sql`
        SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path ORDER BY views DESC LIMIT 20
      `,
      sql`
        SELECT
          CASE
            WHEN referrer = '(direct)' OR referrer = '' THEN '(direct)'
            ELSE SPLIT_PART(SPLIT_PART(referrer, '://', 2), '/', 1)
          END AS referrer_domain,
          COUNT(*)::int AS views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY referrer_domain
        ORDER BY views DESC LIMIT 15
      `.catch(() => []),
      sql`
        SELECT
          page_path,
          COUNT(*) FILTER (WHERE depth = 25)::int AS depth_25,
          COUNT(*) FILTER (WHERE depth = 50)::int AS depth_50,
          COUNT(*) FILTER (WHERE depth = 75)::int AS depth_75,
          COUNT(*) FILTER (WHERE depth = 100)::int AS depth_100
        FROM scroll_events
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path
        ORDER BY (COUNT(*) FILTER (WHERE depth = 100)) DESC
        LIMIT 10
      `.catch(() => []),
      sql`
        SELECT
          page_path,
          ROUND(AVG(time_seconds))::int AS avg_seconds,
          COUNT(*)::int AS sample_count
        FROM page_engagement
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path
        ORDER BY avg_seconds DESC
        LIMIT 10
      `.catch(() => []),
      sql`
        SELECT
          utm_source,
          utm_medium,
          utm_campaign,
          COUNT(*)::int AS visit_count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND utm_source IS NOT NULL
        GROUP BY utm_source, utm_medium, utm_campaign
        ORDER BY visit_count DESC
        LIMIT 20
      `.catch(() => []),
      sql`
        SELECT
          query,
          COUNT(*)::int AS search_count
        FROM search_queries
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY query
        ORDER BY search_count DESC
        LIMIT 20
      `.catch(() => []),
    ]);

  const typedTopPages = topPages as unknown as TopPageRow[];
  const typedReferrers = referrers as unknown as ReferrerRow[];
  const typedScrollDepth = scrollDepth as unknown as ScrollDepthRow[];
  const typedTimeOnPage = timeOnPage as unknown as TimeOnPageRow[];
  const typedCampaigns = campaignData as unknown as CampaignRow[];
  const typedSearchQueries = searchQueries as unknown as SearchQueryRow[];

  const topPageItems = typedTopPages.slice(0, 10).map((p) => ({
    label: p.page_path,
    value: p.views,
    sublabel: `${p.unique_views.toLocaleString()} uniques`,
    href: p.page_path.startsWith("/") ? p.page_path : undefined,
  }));
  const referrerItems = typedReferrers.slice(0, 10).map((r) => ({
    label: r.referrer_domain || "(direct)",
    value: r.views,
    sublabel: `${r.unique_visitors.toLocaleString()} visitors`,
  }));

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">03 · Content</div>
      <div className="ax-section-head">
        <h2>
          What they&apos;re <em>reading.</em>
        </h2>
        <p className="lede">
          Top pages, where traffic came from, how deep readers scrolled, and
          how long they stayed.
        </p>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Top pages" kicker={`TOP ${topPageItems.length}`}>
          <AxRankedList items={topPageItems} />
        </AxPanel>
        <AxPanel title="Referrers" kicker={`TOP ${referrerItems.length}`}>
          <AxRankedList items={referrerItems} />
        </AxPanel>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Scroll depth" kicker="HOW FAR THEY GET">
          <ScrollDepthChart data={typedScrollDepth} />
        </AxPanel>
        <AxPanel title="Time on page" kicker="MEDIAN DWELL">
          <TimeOnPageChart data={typedTimeOnPage} />
        </AxPanel>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Campaigns" kicker="UTM TRAFFIC">
          <CampaignPanel campaigns={typedCampaigns} />
        </AxPanel>
        <AxPanel title="Site search" kicker="QUERIES">
          <SearchQueriesPanel queries={typedSearchQueries} />
        </AxPanel>
      </div>
    </div>
  );
}

async function TechnologySection({ days }: { days: number }) {
  const sql = getDb();

  const [browsers, devices, osStats] = await Promise.all([
    sql`
      SELECT browser, COUNT(*)::int AS count
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY browser ORDER BY count DESC LIMIT 15
    `,
    sql`
      SELECT device_type, COUNT(*)::int AS count
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY device_type ORDER BY count DESC
    `,
    sql`
      SELECT os, COUNT(*)::int AS count
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY os ORDER BY count DESC LIMIT 15
    `,
  ]);

  const typedBrowsers = browsers as unknown as BrowserRow[];
  const typedDevices = devices as unknown as DeviceRow[];
  const typedOs = osStats as unknown as OsRow[];

  const browserItems = typedBrowsers.slice(0, 6).map((b) => ({
    label: b.browser || "Unknown",
    value: b.count,
  }));
  const deviceItems = typedDevices.map((d) => ({
    label: d.device_type || "Unknown",
    value: d.count,
  }));
  const osItems = typedOs.slice(0, 6).map((o) => ({
    label: o.os || "Unknown",
    value: o.count,
  }));

  const totalBrowsers = browserItems.reduce((s, i) => s + i.value, 0);
  const totalDevices = deviceItems.reduce((s, i) => s + i.value, 0);
  const totalOs = osItems.reduce((s, i) => s + i.value, 0);

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">04 · Technology</div>
      <div className="ax-section-head">
        <h2>
          How they <em>connect.</em>
        </h2>
        <p className="lede">
          Browser, device, and OS breakdown of visitors.
        </p>
      </div>

      <div className="ax-grid-3">
        <AxPanel title="Browsers" kicker={`${totalBrowsers.toLocaleString()} HITS`}>
          <AxDonut
            items={browserItems}
            centerLabel={String(browserItems.length)}
            centerCaption="Browsers"
            ariaLabel="Browser breakdown"
          />
        </AxPanel>
        <AxPanel title="Devices" kicker={`${totalDevices.toLocaleString()} HITS`}>
          <AxDonut
            items={deviceItems}
            centerLabel={String(deviceItems.length)}
            centerCaption="Devices"
            ariaLabel="Device type breakdown"
          />
        </AxPanel>
        <AxPanel title="Operating systems" kicker={`${totalOs.toLocaleString()} HITS`}>
          <AxDonut
            items={osItems}
            centerLabel={String(osItems.length)}
            centerCaption="OS"
            ariaLabel="Operating system breakdown"
          />
        </AxPanel>
      </div>
    </div>
  );
}

async function TelemetrySection({ days }: { days: number }) {
  const sql = getDb();

  const [apiMetricsEndpoints, apiMetricsDaily, webVitalsRaw, topPages, topCountries] =
    await Promise.all([
      sql`
        SELECT
          endpoint,
          method,
          ROUND(AVG(duration_ms)::numeric, 1) AS avg_ms,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_ms) AS p50,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY duration_ms) AS p75,
          PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
          COUNT(*) FILTER (WHERE status_code >= 400)::int AS error_count,
          COUNT(*)::int AS total_count
        FROM api_metrics
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY endpoint, method
        ORDER BY total_count DESC
      `.catch(() => []),
      sql`
        SELECT
          DATE(recorded_at)::text AS date,
          ROUND(AVG(duration_ms)::numeric, 1) AS avg_ms,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_ms) AS p50,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY duration_ms) AS p75,
          PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
          COUNT(*) FILTER (WHERE status_code >= 400)::int AS error_count,
          COUNT(*)::int AS total_count
        FROM api_metrics
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY DATE(recorded_at)
        ORDER BY date
      `.catch(() => []),
      sql`
        SELECT
          metric_name,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY metric_value) AS p50,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) AS p75,
          PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) AS p95,
          AVG(metric_value) AS avg,
          COUNT(*)::int AS total_samples,
          COUNT(*) FILTER (WHERE rating = 'good')::int AS good_count,
          COUNT(*) FILTER (WHERE rating = 'needs-improvement')::int AS needs_improvement_count,
          COUNT(*) FILTER (WHERE rating = 'poor')::int AS poor_count
        FROM web_vitals
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY metric_name
      `.catch(() => []),
      sql`
        SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path ORDER BY views DESC LIMIT 1
      `,
      sql`
        SELECT country, COUNT(*)::int AS views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY country ORDER BY views DESC LIMIT 1
      `,
    ]);

  const typedApiEndpoints = apiMetricsEndpoints as unknown as ApiMetricRow[];
  const typedApiDaily = apiMetricsDaily as unknown as ApiMetricDailyRow[];
  const typedWebVitals = webVitalsRaw as unknown as WebVitalsSummary[];
  const typedTopPages = topPages as unknown as TopPageRow[];
  const typedCountries = topCountries as unknown as CountryRow[];

  // Need total_views for VercelAnalyticsCard -- fetch inline
  const sql2 = getDb();
  const summaryRow = await sql2`
    SELECT
      COUNT(*)::int AS total_views,
      COUNT(DISTINCT ip_address)::int AS unique_visitors
    FROM page_views
    WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
  `;
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
      <div className="ax-section-label">05 · Performance</div>
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

async function SecuritySection({ days }: { days: number }) {
  const sql = getDb();

  const [botTrend, authAttempts, clientErrorTrend, clientErrorRecent, clientErrorCount] =
    await Promise.all([
      sql`
        SELECT
          DATE(visited_at)::text AS date,
          COUNT(*) FILTER (WHERE device_type = 'Bot')::int AS bot_count,
          COUNT(*) FILTER (WHERE device_type != 'Bot')::int AS human_count,
          CASE
            WHEN COUNT(*) > 0
            THEN ROUND(COUNT(*) FILTER (WHERE device_type = 'Bot')::numeric / COUNT(*) * 100, 1)
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
    ]);

  const typedBotTrend = botTrend as unknown as BotTrendRow[];
  const typedAuthAttempts = authAttempts as unknown as AuthAttemptRow[];
  const typedErrorTrend = clientErrorTrend as unknown as ClientErrorTrendRow[];
  const typedErrorRecent = clientErrorRecent as unknown as ClientErrorRow[];
  const errorTotal = (
    (clientErrorCount as unknown as { total: number }[])[0] || { total: 0 }
  ).total;

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

  const totalBot = typedBotTrend.reduce((s, r) => s + (r.bot_count ?? 0), 0);
  const totalAuthFail = typedAuthAttempts.reduce(
    (s, r) => s + (r.fail_count ?? 0),
    0
  );
  const firewallDenied = vercelAttackStatus?.anomalies?.length ?? 0;

  const secKpis = [
    {
      id: "firewall",
      label: "Firewall Denied",
      value: firewallDenied,
      hint: "▼",
    },
    { id: "bot", label: "Bot Traffic", value: totalBot, hint: "▲" },
    {
      id: "auth",
      label: "Auth Failures",
      value: totalAuthFail,
      hint: "▼",
    },
    {
      id: "client-err",
      label: "Client Errors",
      value: errorTotal,
      hint: "▼",
    },
  ];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">06 · Security</div>
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

      <div>
        <AxPanel title="Client errors" kicker={`${errorTotal} IN RANGE`}>
          <ClientErrorsPanel
            trend={typedErrorTrend}
            recent={typedErrorRecent}
            totalCount={errorTotal}
          />
        </AxPanel>
      </div>
    </div>
  );
}

async function NewsletterSection({ days: _days }: { days: number }) {
  const sql = getDb();

  const [
    subscriberSummary,
    subscriberList,
    subscriberGrowth,
    convertingPages,
    commentList,
    guestbookList,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE active = TRUE)::int AS active,
        COUNT(*) FILTER (WHERE active = FALSE)::int AS inactive
      FROM subscribers
    `.catch(() => [{ total: 0, active: 0, inactive: 0 }]),
    sql`
      SELECT id, email, subscribed_at, active, ip_address, country, city, region
      FROM subscribers ORDER BY subscribed_at DESC
    `.catch(() => []),
    sql`
      WITH weekly AS (
        SELECT
          DATE_TRUNC('week', subscribed_at)::date::text AS week,
          COUNT(*)::int AS new_subscribers
        FROM subscribers
        GROUP BY DATE_TRUNC('week', subscribed_at)
        ORDER BY week
      )
      SELECT
        week,
        new_subscribers,
        SUM(new_subscribers) OVER (ORDER BY week)::int AS cumulative
      FROM weekly
    `.catch(() => []),
    sql`
      SELECT
        source_page,
        COUNT(*)::int AS subscriber_count
      FROM subscribers
      WHERE source_page IS NOT NULL AND source_page != ''
      GROUP BY source_page
      ORDER BY subscriber_count DESC
      LIMIT 15
    `.catch(() => []),
    sql`
      SELECT id, slug, comment, reaction, email, created_at
      FROM blog_comments
      ORDER BY created_at DESC
    `.catch(() => []),
    sql`
      SELECT id, name, message, ip, approved, created_at
      FROM guestbook
      ORDER BY created_at DESC
    `.catch(() => []),
  ]);

  const subStats = (
    subscriberSummary as unknown as { total: number; active: number; inactive: number }[]
  )[0] || { total: 0, active: 0, inactive: 0 };
  const typedSubscribers = subscriberList as unknown as SubscriberRow[];
  const typedSubGrowth = subscriberGrowth as unknown as SubscriberGrowthRow[];
  const typedConverting = convertingPages as unknown as ConvertingPageRow[];
  const typedComments = commentList as unknown as CommentRow[];
  const typedGuestbook = guestbookList as unknown as GuestbookRow[];

  const convertingItems = typedConverting.slice(0, 10).map((c) => ({
    label: c.source_page,
    value: c.subscriber_count,
    href: c.source_page.startsWith("/") ? c.source_page : undefined,
  }));

  const newsletterKpis = [
    { id: "total", label: "Subscribers", value: subStats.total, hint: "▲" },
    { id: "active", label: "Active", value: subStats.active, hint: "—" },
    {
      id: "comments",
      label: "Comments",
      value: typedComments.length,
      hint: "—",
    },
    {
      id: "guestbook",
      label: "Guestbook",
      value: typedGuestbook.length,
      hint: "—",
    },
  ];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">07 · Newsletter</div>
      <div className="ax-section-head">
        <h2>
          Subscribers &amp; <em>community.</em>
        </h2>
        <p className="lede">
          Newsletter growth, converting pages, plus the live moderation queues
          for comments and guestbook entries.
        </p>
      </div>

      <KpiStrip items={newsletterKpis} />

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Subscriber growth" kicker="WEEKLY">
          <SubscriberGrowthChart data={typedSubGrowth} />
        </AxPanel>
        <AxPanel title="Top converting pages" kicker={`TOP ${convertingItems.length}`}>
          <AxRankedList items={convertingItems} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel
          title="Subscribers"
          kicker={`${subStats.active} ACTIVE · ${subStats.inactive} INACTIVE`}
        >
          <SubscriberPanel
            totalCount={subStats.total}
            activeCount={subStats.active}
            inactiveCount={subStats.inactive}
            subscribers={typedSubscribers}
          />
        </AxPanel>
      </div>

      <div className="ax-grid-2">
        <AxPanel title="Blog comments" kicker={`${typedComments.length} TOTAL`}>
          <CommentsPanel comments={typedComments} />
        </AxPanel>
        <AxPanel title="Guestbook" kicker={`${typedGuestbook.length} ENTRIES`}>
          <GuestbookPanel entries={typedGuestbook} />
        </AxPanel>
      </div>
    </div>
  );
}

function ClaudeAutomationSection() {
  const gmailRuns = gmailMetricsRaw as unknown as GmailRun[];
  const sessions = sessionArchiveRaw as unknown as SessionEntry[];

  const totalRuns = gmailRuns.length;
  const totalProcessed = gmailRuns.reduce((s, r) => s + r.emails_processed, 0);
  const totalTrashed = gmailRuns.reduce(
    (s, r) => s + r.promotions_trashed + r.newsletters_trashed,
    0
  );
  const totalDuration = gmailRuns.reduce((s, r) => s + r.duration_seconds, 0);
  const avgDuration = totalRuns > 0 ? Math.round(totalDuration / totalRuns) : 0;
  const totalErrors = gmailRuns.reduce((s, r) => s + r.errors.length, 0);

  // Build chart data: newest first, trim to last 30, then reverse for chronological display
  function formatChartLabel(ts: string): string {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const chartData = gmailRuns
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 30)
    .reverse()
    .map((r) => ({
      label: formatChartLabel(r.timestamp),
      processed: r.emails_processed,
      trashed: r.promotions_trashed + r.newsletters_trashed,
      kept: r.primary_kept,
    }));

  const automationKpis = [
    { id: "runs", label: "Gmail Runs", value: totalRuns, hint: "▲" },
    { id: "processed", label: "Processed", value: totalProcessed, hint: "▲" },
    { id: "trashed", label: "Trashed", value: totalTrashed, hint: "▲" },
    { id: "errors", label: "Errors", value: totalErrors, hint: "▼" },
  ];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">09 · Automation</div>
      <div className="ax-section-head">
        <h2>
          Agents at <em>work.</em>
        </h2>
        <p className="lede">
          Gmail assistant runs, session archive, and other automation
          telemetry from the local Claude Code install. Avg duration {avgDuration}s.
        </p>
      </div>

      <KpiStrip items={automationKpis} />

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Emails processed per run" kicker="LAST 30 RUNS">
          <GmailMetricsChart data={chartData} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Gmail runs" kicker={`${Math.min(25, totalRuns)} MOST RECENT`}>
          <GmailRunsPanel runs={gmailRuns.slice(0, 25)} />
        </AxPanel>
      </div>

      <div>
        <AxPanel title="Session archive" kicker="LOCAL CLAUDE CODE SESSIONS">
          <SessionArchivePanel sessions={sessions.slice(0, 25)} />
        </AxPanel>
      </div>
    </div>
  );
}

async function ActivitySection({ days }: { days: number }) {
  const sql = getDb();

  const [recent, topPages, topCountries, browsers, devices, osStats, referrers] =
    await Promise.all([
      sql`
        SELECT id, visited_at, page_path, ip_address, browser, os,
               device_type, referrer, country, city, region
        FROM page_views ORDER BY visited_at DESC LIMIT 50
      `,
      sql`
        SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path ORDER BY views DESC LIMIT 20
      `,
      sql`
        SELECT country, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY country ORDER BY views DESC LIMIT 20
      `,
      sql`
        SELECT browser, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY browser ORDER BY count DESC LIMIT 15
      `,
      sql`
        SELECT device_type, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY device_type ORDER BY count DESC
      `,
      sql`
        SELECT os, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY os ORDER BY count DESC LIMIT 15
      `,
      sql`
        SELECT
          CASE
            WHEN referrer = '(direct)' OR referrer = '' THEN '(direct)'
            ELSE SPLIT_PART(SPLIT_PART(referrer, '://', 2), '/', 1)
          END AS referrer_domain,
          COUNT(*)::int AS views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY referrer_domain
        ORDER BY views DESC LIMIT 15
      `.catch(() => []),
    ]);

  const typedRecent = recent as unknown as RecentVisit[];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">08 · Activity</div>
      <div className="ax-section-head">
        <h2>
          Recent <em>visits.</em>
        </h2>
        <p className="lede">
          Live visit log with filter chips, plus top pages / countries /
          browsers / devices / OS / referrers.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RecentVisitsTable data={typedRecent} />
      </div>

      <div className="ax-grid-2">
        <AxPanel title="Top pages" kicker="BY VIEWS">
          <DataTable
            title=""
            headers={["Page", "Views", "Unique"]}
            rows={topPages.map((r: Record<string, unknown>) => [
              String(r.page_path),
              String(r.views),
              String(r.unique_views),
            ])}
          />
        </AxPanel>
        <AxPanel title="Countries" kicker="BY VIEWS">
          <DataTable
            title=""
            headers={["Country", "Views", "Unique"]}
            rows={topCountries.map((r: Record<string, unknown>) => [
              String(r.country),
              String(r.views),
              String(r.unique_visitors),
            ])}
          />
        </AxPanel>
        <AxPanel title="Browsers" kicker="BY COUNT">
          <DataTable
            title=""
            headers={["Browser", "Count"]}
            rows={browsers.map((r: Record<string, unknown>) => [
              String(r.browser),
              String(r.count),
            ])}
          />
        </AxPanel>
        <AxPanel title="Devices" kicker="BY COUNT">
          <DataTable
            title=""
            headers={["Device Type", "Count"]}
            rows={devices.map((r: Record<string, unknown>) => [
              String(r.device_type),
              String(r.count),
            ])}
          />
        </AxPanel>
        <AxPanel title="Operating systems" kicker="BY COUNT">
          <DataTable
            title=""
            headers={["OS", "Count"]}
            rows={osStats.map((r: Record<string, unknown>) => [
              String(r.os),
              String(r.count),
            ])}
          />
        </AxPanel>
        <AxPanel title="Referrers" kicker="BY VIEWS">
          <DataTable
            title=""
            headers={["Domain", "Views", "Unique"]}
            rows={referrers.map((r: Record<string, unknown>) => [
              String(r.referrer_domain),
              String(r.views),
              String(r.unique_visitors),
            ])}
          />
        </AxPanel>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page root: auth gate, header, time filter, then streamed sections
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  searchParams: Promise<{ days?: string }>;
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params = await searchParams;

  // Auth gate (cookie-based)
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;

  if (!authToken || !verifyAuthToken(authToken)) {
    redirect("/analytics/login");
  }

  // Validate and clamp days parameter (1-365)
  const parsedDays = params.days ? parseInt(params.days, 10) : 30;
  const days = Math.max(1, Math.min(365, isNaN(parsedDays) ? 30 : parsedDays));

  // Best-effort count of distinct visitors in the last 5 minutes for the live pill.
  let activeSessions = 0;
  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT COUNT(DISTINCT ip_address)::int AS active
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '5 minutes'
    `) as Array<{ active: number }>;
    activeSessions = rows[0]?.active ?? 0;
  } catch {
    activeSessions = 0;
  }

  const renderStart = Date.now();
  const generatedAt = new Date();
  const generatedStr =
    generatedAt.toISOString().slice(0, 19).replace("T", " ") + "Z";
  const queryTimeMs = Date.now() - renderStart;
  const issueNum = String(
    Math.floor(
      (generatedAt.getTime() - new Date("2024-01-01").getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    )
  ).padStart(3, "0");

  return (
    <section className="ax-page">
      <div className="ax-wrap ax-header">
        <div className="ax-header-inner">
          <div>
            <div className="ax-crumbs" aria-label="Breadcrumb">
              <span>HOME</span>
              <span className="sep">›</span>
              <span>ANALYTICS</span>
              <span className="sep">›</span>
              <b>OVERVIEW</b>
            </div>
            <h1 className="ax-title">
              Signal, <em>not</em> <span className="accent">slop.</span>
            </h1>
            <p className="ax-sub">
              Real telemetry from a real site. Clickable KPIs retarget the
              trend chart, tabs keep navigation instant, and the live feed
              tails the last few minutes of traffic.
            </p>
          </div>
          <div className="ax-controls">
            <span className="live-pill">
              <span className="dot" aria-hidden="true" />
              <span>
                {activeSessions.toLocaleString()}{" "}
                {activeSessions === 1 ? "session" : "sessions"} ·{" "}
                <LiveClock />
              </span>
            </span>
            <div className="ax-btn-group">
              <Link
                href={`/analytics?days=${days}`}
                className="btn-editorial btn-editorial--sm"
                prefetch={false}
              >
                Refresh
              </Link>
              <Link
                href="/backlog"
                className="btn-editorial btn-editorial--sm"
                prefetch={false}
              >
                Backlog
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
        <div className="ax-meta-row">
          <span>
            ISSUE <b>#{issueNum}</b>
          </span>
          <span>
            RANGE <b>LAST {days}D</b>
          </span>
          <span>
            GENERATED <b>{generatedStr}</b>
          </span>
          <span>
            QUERY <b>{queryTimeMs}MS</b>
          </span>
          <span>
            CACHE <b>NO-STORE</b>
          </span>
          <span className="ac">
            SOURCE <b>NEON / POSTGRES</b>
          </span>
        </div>
      </div>

      <AnalyticsShell currentDays={days} tabs={DEFAULT_TABS}>
        <div data-panel="overview" id="ax-panel-overview" role="tabpanel" aria-labelledby="ax-tab-overview" tabIndex={0} className="ax-panel">
          <Suspense fallback={<OverviewSkeleton />}>
            <OverviewSection days={days} />
          </Suspense>
        </div>

        <div data-panel="audience" id="ax-panel-audience" role="tabpanel" aria-labelledby="ax-tab-audience" tabIndex={0} className="ax-panel">
          <Suspense fallback={<AudienceSkeleton />}>
            <AudienceSection days={days} />
          </Suspense>
        </div>

        <div data-panel="content" id="ax-panel-content" role="tabpanel" aria-labelledby="ax-tab-content" tabIndex={0} className="ax-panel">
          <Suspense fallback={<ContentSkeleton />}>
            <ContentSection days={days} />
          </Suspense>
        </div>

        <div data-panel="technology" id="ax-panel-technology" role="tabpanel" aria-labelledby="ax-tab-technology" tabIndex={0} className="ax-panel">
          <Suspense fallback={<TechSkeleton />}>
            <TechnologySection days={days} />
          </Suspense>
        </div>

        <div data-panel="performance" id="ax-panel-performance" role="tabpanel" aria-labelledby="ax-tab-performance" tabIndex={0} className="ax-panel">
          <Suspense fallback={<TelemetrySkeleton />}>
            <TelemetrySection days={days} />
          </Suspense>
        </div>

        <div data-panel="security" id="ax-panel-security" role="tabpanel" aria-labelledby="ax-tab-security" tabIndex={0} className="ax-panel">
          <Suspense fallback={<SecuritySkeleton />}>
            <SecuritySection days={days} />
          </Suspense>
        </div>

        <div data-panel="newsletter" id="ax-panel-newsletter" role="tabpanel" aria-labelledby="ax-tab-newsletter" tabIndex={0} className="ax-panel">
          <Suspense fallback={<NewsletterSkeleton />}>
            <NewsletterSection days={days} />
          </Suspense>
        </div>

        <div data-panel="activity" id="ax-panel-activity" role="tabpanel" aria-labelledby="ax-tab-activity" tabIndex={0} className="ax-panel">
          <Suspense fallback={<ActivitySkeleton />}>
            <ActivitySection days={days} />
          </Suspense>
        </div>

        <div data-panel="automation" id="ax-panel-automation" role="tabpanel" aria-labelledby="ax-tab-automation" tabIndex={0} className="ax-panel">
          <Suspense fallback={<SectionSkeleton />}>
            <ClaudeAutomationSection />
          </Suspense>
        </div>
      </AnalyticsShell>
    </section>
  );
}
