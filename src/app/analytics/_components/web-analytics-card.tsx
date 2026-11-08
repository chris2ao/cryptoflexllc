import type { WebAnalyticsState } from "@/lib/vercel-api";

type Counts = { pageviews: number; visitors: number };

type Props = {
  state: WebAnalyticsState;
  ours: Counts;
  theirs: Counts | null;
  daily: Array<{ date: string; pageviews: number; visitors: number }>;
  days: number;
};

export function ratioLabel(theirs: number, ours: number): string {
  if (ours <= 0) return "No ratio, ours is zero";
  return `Vercel counts ${(theirs / ours).toFixed(1)}x ours`;
}

export function WebAnalyticsCard({ state, ours, theirs, daily, days }: Props) {
  if (state === "not-enabled") {
    return (
      <div className="ax-empty">
        <p>Web Analytics is not enabled on this project</p>
        <p className="ax-wa-note">
          Enable it with <code>vercel project web-analytics enable cryptoflexllc</code>
        </p>
      </div>
    );
  }
  if (state === "unavailable" || !theirs) {
    return <div className="ax-empty">Vercel API unavailable</div>;
  }
  const windowDays = Math.min(days, 30);
  return (
    <div className="ax-wa">
      <div className="ax-stat-row">
        <div className="ax-stat">
          <span className="v">{ours.pageviews.toLocaleString()}</span>
          <span className="l">Ours · pageviews</span>
        </div>
        <div className="ax-stat">
          <span className="v">{theirs.pageviews.toLocaleString()}</span>
          <span className="l">Vercel · pageviews</span>
        </div>
        <div className="ax-stat">
          <span className="v">{theirs.visitors.toLocaleString()}</span>
          <span className="l">Vercel · visitors</span>
        </div>
      </div>
      <div className="ax-wa-ratio">{ratioLabel(theirs.pageviews, ours.pageviews)}</div>
      <p className="ax-wa-note">
        Last {windowDays} days, {daily.length} days reported. Vercel counts every
        browser while ours counts humans in scope.
      </p>
    </div>
  );
}
