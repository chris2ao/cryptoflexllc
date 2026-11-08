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
import Link from "next/link";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { loadLiveSummary } from "@/lib/analytics-queries/live-summary";
import { rangeDays } from "@/lib/analytics-queries/shared";
import { AnalyticsShell } from "./_components/analytics-shell";
import { DEFAULT_TABS } from "./_components/tabs";
import { LiveClock } from "./_components/live-clock";
import { LogoutButton } from "./_components/logout-button";
import { SECTIONS, SKELETONS, type TabId } from "./_sections/registry";
import "./analytics.css";

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
  const days = rangeDays(params.days);

  const { activeSessions, generatedAt, queryTimeMs } = await loadLiveSummary();
  const generatedStr =
    generatedAt.toISOString().slice(0, 19).replace("T", " ") + "Z";
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
        {DEFAULT_TABS.map(({ id }) => {
          const Section = SECTIONS[id as TabId];
          const Skeleton = SKELETONS[id as TabId];
          return (
            <div
              key={id}
              data-panel={id}
              id={`ax-panel-${id}`}
              role="tabpanel"
              aria-labelledby={`ax-tab-${id}`}
              tabIndex={0}
              className="ax-panel"
            >
              <Suspense fallback={<Skeleton />}>
                <Section days={days} />
              </Suspense>
            </div>
          );
        })}
      </AnalyticsShell>
    </section>
  );
}
