/**
 * /analytics — Visitor Analytics Dashboard
 * -----------------------------------------------
 * Server-rendered dashboard organized by category with tooltips on
 * every panel. Protected by httpOnly cookie auth.
 *
 * SECTIONS:
 *   1. Overview — KPI cards, page views trend, peak hours heatmap
 *   2. Audience & Geography — map, countries, new vs returning
 *   3. Content & Engagement — top pages, referrers, scroll depth, time on page
 *   4. Technology — browsers, devices, OS
 *   5. Server Telemetry — API response times, error rates
 *   6. Performance — Web Vitals (Speed Insights)
 *   7. Security — Vercel Firewall, bot traffic, auth attempts
 *   8. Newsletter & Comments — subscriber management, comment moderation
 *   9. Recent Activity — visit log + data tables
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
import { PageViewsChart } from "./_components/page-views-chart";
import { TopPagesChart } from "./_components/top-pages-chart";
import { CountriesChart } from "./_components/countries-chart";
import { BrowserChart } from "./_components/browser-chart";
import { DeviceChart } from "./_components/device-chart";
import { OsChart } from "./_components/os-chart";
import { VisitorMapDynamic } from "./_components/visitor-map-dynamic";
import { RecentVisitsTable } from "./_components/recent-visits-table";
import { VercelFirewallCard } from "./_components/vercel-firewall-card";
import { VercelAnalyticsCard } from "./_components/vercel-analytics-card";
import { VercelSpeedInsightsCard } from "./_components/vercel-speed-insights-card";
import { SubscriberPanel } from "./_components/subscriber-panel";
import { CommentsPanel } from "./_components/comments-panel";
import { ReferrerChart } from "./_components/referrer-chart";
import { PeakHoursHeatmap } from "./_components/peak-hours-heatmap";
import { ScrollDepthChart } from "./_components/scroll-depth-chart";
import { TimeOnPageChart } from "./_components/time-on-page-chart";
import { ApiResponseChart } from "./_components/api-response-chart";
import { BotTrendChart } from "./_components/bot-trend-chart";
import { AuthAttemptsChart } from "./_components/auth-attempts-chart";
import { NewVsReturningChart } from "./_components/new-vs-returning-chart";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  searchParams: Promise<{ days?: string }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const params = await searchParams;

  // ---- Auth gate (cookie-based) ----
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;

  if (!authToken || !verifyAuthToken(authToken)) {
    redirect("/analytics/login");
  }

  // Validate and clamp days parameter (1-365)
  const parsedDays = params.days ? parseInt(params.days, 10) : 30;
  const days = Math.max(1, Math.min(365, isNaN(parsedDays) ? 30 : parsedDays));

  try {
    const sql = getDb();

    // ---- All database queries in parallel ----
    const [
      summary,
      topPages,
      topCountries,
      browsers,
      devices,
      osStats,
      recent,
      dailyViews,
      mapLocations,
      webVitalsRaw,
      subscriberSummary,
      subscriberList,
      // New queries
      referrers,
      hourlyHeatmap,
      scrollDepth,
      timeOnPage,
      apiMetricsEndpoints,
      apiMetricsDaily,
      botTrend,
      authAttempts,
      newVsReturning,
      bounceData,
      commentList,
    ] = await Promise.all([
      // 0: Summary stats
      sql`
        SELECT
          COUNT(*)::int AS total_views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors,
          MIN(visited_at) AS first_visit,
          MAX(visited_at) AS last_visit
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      `,
      // 1: Top pages
      sql`
        SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path ORDER BY views DESC LIMIT 20
      `,
      // 2: Top countries
      sql`
        SELECT country, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY country ORDER BY views DESC LIMIT 20
      `,
      // 3: Browsers
      sql`
        SELECT browser, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY browser ORDER BY count DESC LIMIT 15
      `,
      // 4: Devices
      sql`
        SELECT device_type, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY device_type ORDER BY count DESC
      `,
      // 5: OS
      sql`
        SELECT os, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY os ORDER BY count DESC LIMIT 15
      `,
      // 6: Recent visits
      sql`
        SELECT id, visited_at, page_path, ip_address, browser, os,
               device_type, referrer, country, city, region
        FROM page_views ORDER BY visited_at DESC LIMIT 50
      `,
      // 7: Daily views for area chart
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
      // 8: Map locations
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
      // 9: Web Vitals
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
      // 10: Subscriber summary
      sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE active = TRUE)::int AS active,
          COUNT(*) FILTER (WHERE active = FALSE)::int AS inactive
        FROM subscribers
      `.catch(() => [{ total: 0, active: 0, inactive: 0 }]),
      // 11: Subscriber list
      sql`
        SELECT id, email, subscribed_at, active, ip_address, country, city, region
        FROM subscribers ORDER BY subscribed_at DESC
      `.catch(() => []),

      // ---- NEW QUERIES ----

      // 12: Referrer breakdown (group by domain)
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
      // 13: Hourly heatmap (day_of_week x hour)
      sql`
        SELECT
          EXTRACT(DOW FROM visited_at)::int AS day_of_week,
          EXTRACT(HOUR FROM visited_at)::int AS hour,
          COUNT(*)::int AS views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY day_of_week, hour
      `.catch(() => []),
      // 14: Scroll depth per page (top 10 pages)
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
      // 15: Time on page (avg per page, top 10)
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
      // 16: API metrics per endpoint
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
      // 17: API metrics daily trend
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
      // 18: Bot vs human trend
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
      // 19: Auth attempts
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
      // 20: New vs returning visitors
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
      // 21: Bounce rate (IPs with only 1 page in the window)
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
      // 22: Blog comments (all, for moderation)
      sql`
        SELECT id, slug, comment, reaction, email, created_at
        FROM blog_comments
        ORDER BY created_at DESC
      `.catch(() => []),
    ]);

    const stats = summary[0] || {
      total_views: 0,
      unique_visitors: 0,
      first_visit: null,
      last_visit: null,
    };

    // Compute bounce rate
    const bounceStats = (bounceData as unknown as { single_page: number; total_visitors: number }[])[0] || { single_page: 0, total_visitors: 0 };
    const bounceRate = bounceStats.total_visitors > 0
      ? Math.round((bounceStats.single_page / bounceStats.total_visitors) * 100)
      : 0;

    // Compute new vs returning totals
    const typedNewVsReturning = newVsReturning as unknown as NewVsReturningRow[];
    const totalNew = typedNewVsReturning.reduce((s, r) => s + r.new_visitors, 0);
    const totalReturning = typedNewVsReturning.reduce((s, r) => s + r.returning_visitors, 0);

    // ---- Vercel API data ----
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

    // ---- Type casts ----
    const typedDailyViews = dailyViews as unknown as DailyViews[];
    const typedMapLocations = mapLocations as unknown as MapLocation[];
    const typedTopPages = topPages as unknown as TopPageRow[];
    const typedCountries = topCountries as unknown as CountryRow[];
    const typedBrowsers = browsers as unknown as BrowserRow[];
    const typedDevices = devices as unknown as DeviceRow[];
    const typedOs = osStats as unknown as OsRow[];
    const typedRecent = recent as unknown as RecentVisit[];
    const typedWebVitals = webVitalsRaw as unknown as WebVitalsSummary[];
    const subStats = (subscriberSummary as unknown as { total: number; active: number; inactive: number }[])[0] || { total: 0, active: 0, inactive: 0 };
    const typedSubscribers = subscriberList as unknown as SubscriberRow[];
    const typedReferrers = referrers as unknown as ReferrerRow[];
    const typedHeatmap = hourlyHeatmap as unknown as HourlyHeatmapRow[];
    const typedScrollDepth = scrollDepth as unknown as ScrollDepthRow[];
    const typedTimeOnPage = timeOnPage as unknown as TimeOnPageRow[];
    const typedApiEndpoints = apiMetricsEndpoints as unknown as ApiMetricRow[];
    const typedApiDaily = apiMetricsDaily as unknown as ApiMetricDailyRow[];
    const typedBotTrend = botTrend as unknown as BotTrendRow[];
    const typedAuthAttempts = authAttempts as unknown as AuthAttemptRow[];
    const typedComments = commentList as unknown as CommentRow[];

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
              SECTION 1: OVERVIEW
              ═══════════════════════════════════════════ */}

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

          {/* ═══════════════════════════════════════════
              SECTION 2: AUDIENCE & GEOGRAPHY
              ═══════════════════════════════════════════ */}
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

          {/* ═══════════════════════════════════════════
              SECTION 3: CONTENT & ENGAGEMENT
              ═══════════════════════════════════════════ */}
          <SectionHeader
            title="Content & Engagement"
            description="How visitors interact with your pages and content"
          />

          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <TopPagesChart data={typedTopPages} />
            <ReferrerChart data={typedReferrers} />
            <ScrollDepthChart data={typedScrollDepth} />
            <TimeOnPageChart data={typedTimeOnPage} />
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 4: TECHNOLOGY
              ═══════════════════════════════════════════ */}
          <SectionHeader
            title="Technology"
            description="Browsers, devices, and operating systems used by visitors"
          />

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <BrowserChart data={typedBrowsers} />
            <DeviceChart data={typedDevices} />
            <OsChart data={typedOs} />
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 5: SERVER TELEMETRY
              ═══════════════════════════════════════════ */}
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

          {/* ═══════════════════════════════════════════
              SECTION 6: PERFORMANCE
              ═══════════════════════════════════════════ */}
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

          {/* ═══════════════════════════════════════════
              SECTION 7: SECURITY
              ═══════════════════════════════════════════ */}
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
                Set <code className="text-xs bg-muted px-1.5 py-0.5 rounded">VERCEL_API_TOKEN</code> and{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">VERCEL_PROJECT_ID</code> environment
                variables to display live firewall configuration, attack status, and event data from the
                Vercel API.
              </p>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              SECTION 8: NEWSLETTER
              ═══════════════════════════════════════════ */}
          <SectionHeader
            title="Newsletter & Comments"
            description="Subscriber management, comment moderation, and engagement"
          />

          <div className="mb-8">
            <SubscriberPanel
              totalCount={subStats.total}
              activeCount={subStats.active}
              inactiveCount={subStats.inactive}
              subscribers={typedSubscribers}
            />
          </div>

          <div className="mb-10">
            <CommentsPanel comments={typedComments} />
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 9: RECENT ACTIVITY
              ═══════════════════════════════════════════ */}
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
        </div>
      </section>
    );
  } catch (error) {
    console.error("Analytics page error:", error);
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold">Analytics Error</h1>
          <p className="mt-4 text-muted-foreground">
            Failed to load analytics data. Please check that the database is
            configured correctly and try again.
          </p>
        </div>
      </section>
    );
  }
}
