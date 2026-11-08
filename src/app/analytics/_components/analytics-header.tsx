import Link from "next/link";
import type { TrafficScope } from "@/lib/analytics-queries/shared";
import { DEFAULT_TABS, type TabId } from "./tabs";
import { LiveClock } from "./live-clock";
import { LogoutButton } from "./logout-button";

type Props = {
  activeSessions: number;
  days: number;
  activeTab: TabId;
  scope: TrafficScope;
};

export function AnalyticsHeader({
  activeSessions,
  days,
  activeTab,
  scope,
}: Props) {
  const label =
    DEFAULT_TABS.find((t) => t.id === activeTab)?.label ?? "Overview";
  return (
    <div className="ax-wrap ax-header">
      <div className="ax-header-inner">
        <div>
          <div className="ax-crumbs" aria-label="Breadcrumb">
            <span>HOME</span>
            <span className="sep">›</span>
            <span>ANALYTICS</span>
            <span className="sep">›</span>
            <b>{label.toUpperCase()}</b>
          </div>
          <h1 className="ax-title">
            Signal, <em>not</em> <span className="accent">slop.</span>
          </h1>
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
              href={`/analytics?tab=${activeTab}&days=${days}&scope=${scope}`}
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
    </div>
  );
}
