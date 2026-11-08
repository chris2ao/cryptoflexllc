/**
 * /analytics -- Visitor Analytics Dashboard
 * -----------------------------------------------
 * Server-rendered dashboard. The active tab, date range and traffic scope
 * live in the URL (?tab=&days=&scope=) and exactly one section is rendered
 * per load, wrapped in <Suspense> so it streams behind a skeleton.
 * Protected by httpOnly cookie auth.
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { loadLiveSummary } from "@/lib/analytics-queries/live-summary";
import { rangeDays, resolveScope } from "@/lib/analytics-queries/shared";
import { AnalyticsShell } from "./_components/analytics-shell";
import { VisitorPanelHost } from "./_components/visitor-panel";
import { AnalyticsHeader } from "./_components/analytics-header";
import { resolveTab } from "./_components/tabs";
import { SECTIONS, SKELETONS } from "./_sections/registry";
import "./analytics.css";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  searchParams: Promise<{ tab?: string; days?: string; scope?: string }>;
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

  const tab = resolveTab(params.tab);
  const days = rangeDays(params.days);
  const scope = resolveScope(params.scope);

  const { activeSessions, pending, generatedAt, queryTimeMs } =
    await loadLiveSummary(days);
  const generatedStr =
    generatedAt.toISOString().slice(0, 19).replace("T", " ") + "Z";

  const Section = SECTIONS[tab];
  const Skeleton = SKELETONS[tab];

  const meta = (
    <>
      <span>
        RANGE <b>LAST {days}D</b>
      </span>
      <span>
        GENERATED <b>{generatedStr}</b>
      </span>
      <span>
        QUERY <b>{queryTimeMs}MS</b>
      </span>
      {pending > 0 ? (
        <span title="Page views awaiting classification">
          PENDING <b>{pending.toLocaleString()}</b>
        </span>
      ) : null}
      <span>
        SOURCE <b>NEON / POSTGRES</b>
      </span>
    </>
  );

  return (
    <section className="ax-page">
      <AnalyticsHeader
        activeSessions={activeSessions}
        days={days}
        activeTab={tab}
        scope={scope}
      />
      <AnalyticsShell
        activeTab={tab}
        currentDays={days}
        scope={scope}
        meta={meta}
      >
        <div
          data-panel={tab}
          id={`ax-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`ax-tab-${tab}`}
          tabIndex={0}
          className="ax-panel on"
        >
          <Suspense fallback={<Skeleton />}>
            <Section days={days} scope={scope} />
          </Suspense>
        </div>
      </AnalyticsShell>
      <VisitorPanelHost />
    </section>
  );
}
