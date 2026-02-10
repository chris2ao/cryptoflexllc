/**
 * /analytics — Visitor Analytics Dashboard
 * -----------------------------------------------
 * Server-rendered dashboard with visualizations (charts, map) on top
 * and detailed data tables below. Protected by httpOnly cookie auth.
 *
 * DATA FLOW:
 *   Browser → Vercel Edge → Serverless Function → Neon Postgres
 *   The page queries the DB directly (not via the API route) to
 *   avoid an unnecessary HTTP round-trip. Chart components are
 *   client-side (recharts, leaflet) and receive data as props.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/analytics";
import { ANALYTICS_COOKIE_NAME, verifyAuthToken } from "@/lib/analytics-auth";
import type {
  DailyViews,
  MapLocation,
  TopPageRow,
  CountryRow,
  BrowserRow,
  DeviceRow,
  OsRow,
  RecentVisit,
  VercelFirewallConfig,
  VercelAttackStatus,
  VercelFirewallEvents,
} from "@/lib/analytics-types";
import {
  isVercelApiConfigured,
  fetchFirewallConfig,
  fetchAttackStatus,
  fetchFirewallEvents,
} from "@/lib/vercel-api";
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
  const authToken = cookieStore.get(ANALYTICS_COOKIE_NAME)?.value;

  if (!authToken || !verifyAuthToken(authToken)) {
    redirect("/analytics/login");
  }

  // Validate and clamp days parameter (1-365)
  const parsedDays = params.days ? parseInt(params.days, 10) : 30;
  const days = Math.max(1, Math.min(365, isNaN(parsedDays) ? 30 : parsedDays));

  try {
    const sql = getDb();

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
    ] = await Promise.all([
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
        SELECT id, visited_at, page_path, ip_address, browser, os,
               device_type, referrer, country, city, region
        FROM page_views ORDER BY visited_at DESC LIMIT 50
      `,
      // Daily views for area chart
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
      // Map locations
      sql`
        SELECT
          latitude,
          longitude,
          COUNT(*)::int AS views,
          MAX(city) AS city,
          MAX(country) AS country
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND latitude IS NOT NULL
          AND latitude != ''
          AND longitude IS NOT NULL
          AND longitude != ''
        GROUP BY latitude, longitude
        ORDER BY views DESC
        LIMIT 200
      `,
    ]);

    const stats = summary[0] || {
      total_views: 0,
      unique_visitors: 0,
      first_visit: null,
      last_visit: null,
    };

    // ---- Vercel API data (firewall, analytics status, speed insights) ----
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

    // Cast query results to typed arrays
    const typedDailyViews = dailyViews as unknown as DailyViews[];
    const typedMapLocations = mapLocations as unknown as MapLocation[];
    const typedTopPages = topPages as unknown as TopPageRow[];
    const typedCountries = topCountries as unknown as CountryRow[];
    const typedBrowsers = browsers as unknown as BrowserRow[];
    const typedDevices = devices as unknown as DeviceRow[];
    const typedOs = osStats as unknown as OsRow[];
    const typedRecent = recent as unknown as RecentVisit[];

    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header + Time Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Analytics</h1>
              <p className="mt-2 text-muted-foreground">
                Last {days} days of visitor data
              </p>
            </div>
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

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Total Page Views"
              value={stats.total_views?.toLocaleString() || "0"}
            />
            <StatCard
              label="Unique Visitors"
              value={stats.unique_visitors?.toLocaleString() || "0"}
            />
            <StatCard
              label="First Visit"
              value={
                stats.first_visit
                  ? new Date(stats.first_visit).toLocaleDateString()
                  : "—"
              }
            />
            <StatCard
              label="Last Visit"
              value={
                stats.last_visit
                  ? new Date(stats.last_visit).toLocaleDateString()
                  : "—"
              }
            />
          </div>

          {/* VISUALIZATIONS SECTION */}

          {/* Page Views Area Chart (full width) */}
          <div className="mb-8">
            <PageViewsChart data={typedDailyViews} />
          </div>

          {/* Visitor Map (full width) */}
          <div className="mb-8">
            <VisitorMapDynamic data={typedMapLocations} />
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <TopPagesChart data={typedTopPages} />
            <CountriesChart data={typedCountries} />
            <BrowserChart data={typedBrowsers} />
            <DeviceChart data={typedDevices} />
            <OsChart data={typedOs} />
          </div>

          {/* TABLES SECTION */}

          <div className="grid lg:grid-cols-2 gap-8 mb-10">
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
          </div>

          {/* Recent Visits with clickable IPs */}
          <RecentVisitsTable data={typedRecent} />

          {/* ── VERCEL PLATFORM SECTION ── */}
          <div className="mt-14 mb-2">
            <h2 className="text-2xl font-bold">Vercel Platform</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Integration status and data from Vercel&apos;s platform services
            </p>
          </div>

          {/* Vercel Analytics + Speed Insights cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <VercelAnalyticsCard />
            <VercelSpeedInsightsCard />
          </div>

          {/* Vercel Firewall (full-width, data-rich) */}
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
