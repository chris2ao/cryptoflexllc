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
} from "@/lib/analytics-types";
import {
  isVercelApiConfigured,
  fetchFirewallConfig,
  fetchAttackStatus,
  fetchFirewallEvents,
} from "@/lib/vercel-api";
import { SectionHeader } from "./_components/section-header";
import { StatCard } from "./_components/stat-card";
import { DataTable } from "./_components/data-table";
import { VisitorMapDynamic } from "./_components/visitor-map-dynamic";
import { VercelFirewallCard } from "./_components/vercel-firewall-card";
import { VercelAnalyticsCard } from "./_components/vercel-analytics-card";
import { VercelSpeedInsightsCard } from "./_components/vercel-speed-insights-card";
import { SubscriberPanel } from "./_components/subscriber-panel";
import { CommentsPanel } from "./_components/comments-panel";
import { GuestbookPanel } from "./_components/guestbook-panel";
import { CampaignPanel } from "./_components/campaign-panel";
import { SearchQueriesPanel } from "./_components/search-queries-panel";
import { ClientErrorsPanel } from "./_components/client-errors-panel";
import { TopConvertingPanel } from "./_components/top-converting-panel";
import { RecentVisitsTable } from "./_components/recent-visits-table";

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

const PageViewsChart = nextDynamic(
  () => import("./_components/page-views-chart").then((m) => m.PageViewsChart),
  { loading: () => <TallChartSkeleton /> }
);

const TopPagesChart = nextDynamic(
  () => import("./_components/top-pages-chart").then((m) => m.TopPagesChart),
  { loading: () => <ChartSkeleton /> }
);

const CountriesChart = nextDynamic(
  () => import("./_components/countries-chart").then((m) => m.CountriesChart),
  { loading: () => <ChartSkeleton /> }
);

const BrowserChart = nextDynamic(
  () => import("./_components/browser-chart").then((m) => m.BrowserChart),
  { loading: () => <ChartSkeleton /> }
);

const DeviceChart = nextDynamic(
  () => import("./_components/device-chart").then((m) => m.DeviceChart),
  { loading: () => <ChartSkeleton /> }
);

const OsChart = nextDynamic(
  () => import("./_components/os-chart").then((m) => m.OsChart),
  { loading: () => <ChartSkeleton /> }
);

const ReferrerChart = nextDynamic(
  () => import("./_components/referrer-chart").then((m) => m.ReferrerChart),
  { loading: () => <ChartSkeleton /> }
);

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

  return (
    <>
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Page Views"
          value={stats.total_views?.toLocaleString() || "0"}
          tooltip="Total page loads recorded in the selected time period"
        />
        <StatCard
          label="Unique Visitors"
          value={stats.unique_visitors?.toLocaleString() || "0"}
          tooltip="Distinct IP addresses that visited the site"
        />
        <StatCard
          label="Bounce Rate"
          value={`${bounceRate}%`}
          tooltip="Percentage of visitors who viewed only a single page"
        />
        <StatCard
          label="New vs Returning"
          value={`${totalNew} / ${totalReturning}`}
          tooltip="Count of first-time visitors vs those with prior visits"
        />
      </div>

      {/* Page Views Over Time (full width) */}
      <div className="mb-8">
        <PageViewsChart data={typedDailyViews} />
      </div>

      {/* Peak Hours Heatmap (full width) */}
      <div className="mb-10">
        <PeakHoursHeatmap data={typedHeatmap} />
      </div>
    </>
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

  return (
    <>
      <SectionHeader
        title="Audience & Geography"
        description="Where your visitors come from and how they discover your site"
      />

      {/* Visitor Map (full width) */}
      <div className="mb-8">
        <VisitorMapDynamic data={typedMapLocations} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <CountriesChart data={typedCountries} />
        <NewVsReturningChart data={typedNewVsReturning} />
      </div>
    </>
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

  return (
    <>
      <SectionHeader
        title="Content & Engagement"
        description="How visitors interact with your pages and content"
      />

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <TopPagesChart data={typedTopPages} />
        <ReferrerChart data={typedReferrers} />
        <ScrollDepthChart data={typedScrollDepth} />
        <TimeOnPageChart data={typedTimeOnPage} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <CampaignPanel campaigns={typedCampaigns} />
        <SearchQueriesPanel queries={typedSearchQueries} />
      </div>
    </>
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

  return (
    <>
      <SectionHeader
        title="Technology"
        description="Browsers, devices, and operating systems used by visitors"
      />

      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <BrowserChart data={typedBrowsers} />
        <DeviceChart data={typedDevices} />
        <OsChart data={typedOs} />
      </div>
    </>
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

  return (
    <>
      <SectionHeader
        title="Server Telemetry"
        description="API response times, error rates, and server-side performance"
      />

      <div className="mb-10">
        <ApiResponseChart
          endpoints={typedApiEndpoints}
          daily={typedApiDaily}
        />
      </div>

      <SectionHeader
        title="Performance"
        description="Core Web Vitals and speed metrics from real visitor sessions"
      />

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <VercelAnalyticsCard
          totalViews={stats.total_views || 0}
          uniqueVisitors={stats.unique_visitors || 0}
          topPage={typedTopPages[0]?.page_path || null}
          topCountry={typedCountries[0]?.country || null}
        />
        <VercelSpeedInsightsCard data={typedWebVitals} />
      </div>
    </>
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

  return (
    <>
      <SectionHeader
        title="Security"
        description="Firewall events, bot traffic, and authentication monitoring"
      />

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <BotTrendChart data={typedBotTrend} />
        <AuthAttemptsChart data={typedAuthAttempts} />
      </div>

      {isVercelApiConfigured() ? (
        <div className="mb-10">
          <VercelFirewallCard
            config={vercelFirewallConfig}
            attackStatus={vercelAttackStatus}
            events={vercelFirewallEvents}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-6 mb-10">
          <h2 className="text-lg font-semibold mb-2">Vercel Firewall</h2>
          <p className="text-sm text-muted-foreground">
            Set{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              VERCEL_API_TOKEN
            </code>{" "}
            and{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              VERCEL_PROJECT_ID
            </code>{" "}
            environment variables to display live firewall configuration, attack
            status, and event data from the Vercel API.
          </p>
        </div>
      )}

      <div className="mb-10">
        <ClientErrorsPanel
          trend={typedErrorTrend}
          recent={typedErrorRecent}
          totalCount={errorTotal}
        />
      </div>
    </>
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

  return (
    <>
      <SectionHeader
        title="Newsletter, Comments & Guestbook"
        description="Subscriber management, comment moderation, guestbook approvals"
      />

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <SubscriberGrowthChart data={typedSubGrowth} />
        <TopConvertingPanel data={typedConverting} />
      </div>

      <div className="mb-8">
        <SubscriberPanel
          totalCount={subStats.total}
          activeCount={subStats.active}
          inactiveCount={subStats.inactive}
          subscribers={typedSubscribers}
        />
      </div>

      <div className="mb-8">
        <CommentsPanel comments={typedComments} />
      </div>

      <div className="mb-10">
        <GuestbookPanel entries={typedGuestbook} />
      </div>
    </>
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
    <>
      <SectionHeader
        title="Recent Activity"
        description="Real-time visit log and detailed data tables"
      />

      <RecentVisitsTable data={typedRecent} />

      <div className="grid lg:grid-cols-2 gap-8 mt-8 mb-10">
        <DataTable
          title="Top Pages"
          headers={["Page", "Views", "Unique"]}
          rows={topPages.map((r: Record<string, unknown>) => [
            String(r.page_path),
            String(r.views),
            String(r.unique_views),
          ])}
        />
        <DataTable
          title="Countries"
          headers={["Country", "Views", "Unique"]}
          rows={topCountries.map((r: Record<string, unknown>) => [
            String(r.country),
            String(r.views),
            String(r.unique_visitors),
          ])}
        />
        <DataTable
          title="Browsers"
          headers={["Browser", "Count"]}
          rows={browsers.map((r: Record<string, unknown>) => [
            String(r.browser),
            String(r.count),
          ])}
        />
        <DataTable
          title="Devices"
          headers={["Device Type", "Count"]}
          rows={devices.map((r: Record<string, unknown>) => [
            String(r.device_type),
            String(r.count),
          ])}
        />
        <DataTable
          title="Operating Systems"
          headers={["OS", "Count"]}
          rows={osStats.map((r: Record<string, unknown>) => [
            String(r.os),
            String(r.count),
          ])}
        />
        <DataTable
          title="Referrers"
          headers={["Domain", "Views", "Unique"]}
          rows={referrers.map((r: Record<string, unknown>) => [
            String(r.referrer_domain),
            String(r.views),
            String(r.unique_visitors),
          ])}
        />
      </div>
    </>
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

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ═══════════════════════════════════════════
            HEADER + TIME FILTER
            ═══════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Analytics</h1>
            <p className="mt-2 text-muted-foreground">
              Last {days} days of visitor data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/backlog"
              className="px-3 py-1.5 text-sm rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              Backlog
            </Link>
            <div className="flex gap-2">
              {[7, 14, 30, 90].map((d) => (
                <a
                  key={d}
                  href={`/analytics?days=${d}`}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    days === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}d
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SECTION 1: OVERVIEW (above fold, streams first)
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<OverviewSkeleton />}>
          <OverviewSection days={days} />
        </Suspense>

        {/* ═══════════════════════════════════════════
            SECTION 2: AUDIENCE & GEOGRAPHY
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<AudienceSkeleton />}>
          <AudienceSection days={days} />
        </Suspense>

        {/* ═══════════════════════════════════════════
            SECTION 3: CONTENT & ENGAGEMENT
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection days={days} />
        </Suspense>

        {/* ═══════════════════════════════════════════
            SECTION 4: TECHNOLOGY
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<TechSkeleton />}>
          <TechnologySection days={days} />
        </Suspense>

        {/* ═══════════════════════════════════════════
            SECTIONS 5+6: TELEMETRY + PERFORMANCE
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<TelemetrySkeleton />}>
          <TelemetrySection days={days} />
        </Suspense>

        {/* ═══════════════════════════════════════════
            SECTION 7: SECURITY
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<SecuritySkeleton />}>
          <SecuritySection days={days} />
        </Suspense>

        {/* ═══════════════════════════════════════════
            SECTION 8: NEWSLETTER & COMMENTS
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<NewsletterSkeleton />}>
          <NewsletterSection days={days} />
        </Suspense>

        {/* ═══════════════════════════════════════════
            SECTION 9: RECENT ACTIVITY
            ═══════════════════════════════════════════ */}
        <Suspense fallback={<ActivitySkeleton />}>
          <ActivitySection days={days} />
        </Suspense>
      </div>
    </section>
  );
}
