/**
 * /analytics — Visitor Analytics Dashboard
 * -----------------------------------------------
 * A server-rendered dashboard that displays visitor stats pulled
 * from the Neon Postgres database. Protected by ANALYTICS_SECRET.
 *
 * TECHNICAL NOTES (for blog post):
 * --------------------------------
 * WHY A SERVER COMPONENT?
 *   This page is a React Server Component (no "use client" directive).
 *   It fetches data directly from the database at request time — no
 *   client-side JavaScript needed for the initial render. This means:
 *   - Faster page load (no loading spinners)
 *   - The ANALYTICS_SECRET never reaches the browser
 *   - The database queries run on Vercel's serverless infrastructure
 *
 * HOW SEARCH PARAMS WORK IN APP ROUTER:
 *   In Next.js App Router, server components receive searchParams
 *   as a prop. We use this for the ?secret= parameter and the
 *   ?days= time filter.
 *
 * DATA FLOW:
 *   Browser → Vercel Edge → Serverless Function → Neon Postgres
 *   The page queries the DB directly (not via the API route) to
 *   avoid an unnecessary HTTP round-trip.
 */

import type { Metadata } from "next";
import { getDb } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

// Force dynamic rendering (no static generation) since we need
// to check the secret and query live data
export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  searchParams: Promise<{ secret?: string; days?: string }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const params = await searchParams;
  const secret = params.secret;
  const expectedSecret = process.env.ANALYTICS_SECRET;

  // ---- Auth gate ----
  if (!expectedSecret || secret !== expectedSecret) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="mt-4 text-muted-foreground">
            This page requires authentication. Append{" "}
            <code className="rounded bg-muted px-2 py-1 text-sm">
              ?secret=YOUR_ANALYTICS_SECRET
            </code>{" "}
            to the URL.
          </p>
        </div>
      </section>
    );
  }

  const days = params.days ? parseInt(params.days, 10) : 30;

  try {
    const sql = getDb();

    const [summary, topPages, topCountries, browsers, devices, osStats, recent] =
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
      ]);

    const stats = summary[0] || {
      total_views: 0,
      unique_visitors: 0,
      first_visit: null,
      last_visit: null,
    };

    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
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
                  href={`/analytics?secret=${secret}&days=${d}`}
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

          {/* Summary Cards */}
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

          {/* Tables Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Top Pages */}
            <DataTable
              title="Top Pages"
              headers={["Page", "Views", "Unique"]}
              rows={topPages.map((r: Record<string, unknown>) => [
                String(r.page_path),
                String(r.views),
                String(r.unique_views),
              ])}
            />

            {/* Top Countries */}
            <DataTable
              title="Countries"
              headers={["Country", "Views", "Unique"]}
              rows={topCountries.map((r: Record<string, unknown>) => [
                String(r.country),
                String(r.views),
                String(r.unique_visitors),
              ])}
            />

            {/* Browsers */}
            <DataTable
              title="Browsers"
              headers={["Browser", "Count"]}
              rows={browsers.map((r: Record<string, unknown>) => [
                String(r.browser),
                String(r.count),
              ])}
            />

            {/* Devices */}
            <DataTable
              title="Devices"
              headers={["Device Type", "Count"]}
              rows={devices.map((r: Record<string, unknown>) => [
                String(r.device_type),
                String(r.count),
              ])}
            />

            {/* OS */}
            <DataTable
              title="Operating Systems"
              headers={["OS", "Count"]}
              rows={osStats.map((r: Record<string, unknown>) => [
                String(r.os),
                String(r.count),
              ])}
            />
          </div>

          {/* Recent Visits Log */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Visits</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Page</th>
                    <th className="px-4 py-3 font-medium">IP</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Browser</th>
                    <th className="px-4 py-3 font-medium">OS</th>
                    <th className="px-4 py-3 font-medium">Device</th>
                    <th className="px-4 py-3 font-medium">Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No visits recorded yet. Check back after your site gets
                        some traffic!
                      </td>
                    </tr>
                  ) : (
                    recent.map((row: Record<string, unknown>) => (
                      <tr
                        key={String(row.id)}
                        className="border-t border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                          {new Date(String(row.visited_at)).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {String(row.page_path)}
                        </td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {String(row.ip_address)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {[row.city, row.region, row.country]
                            .filter((v) => v && v !== "Unknown")
                            .join(", ") || "Unknown"}
                        </td>
                        <td className="px-4 py-2">{String(row.browser)}</td>
                        <td className="px-4 py-2">{String(row.os)}</td>
                        <td className="px-4 py-2">{String(row.device_type)}</td>
                        <td className="px-4 py-2 text-xs text-muted-foreground max-w-[200px] truncate">
                          {String(row.referrer)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold">Analytics Error</h1>
          <p className="mt-4 text-muted-foreground">
            Failed to load analytics data. Make sure your database is set up by
            visiting{" "}
            <code className="rounded bg-muted px-2 py-1 text-sm">
              /api/analytics/setup?secret=YOUR_SECRET
            </code>
          </p>
          <pre className="mt-4 rounded-lg bg-muted p-4 text-sm overflow-x-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </section>
    );
  }
}

// ---- Helper Components ----

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-bold">{value}</p>
    </div>
  );
}

function DataTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  No data yet
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-2 ${
                        j === 0 ? "font-mono text-xs" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
