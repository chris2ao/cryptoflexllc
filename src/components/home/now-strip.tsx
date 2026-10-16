import Link from "next/link";
import { seriesHref, type SeriesInProgress } from "@/lib/home-content";
import { isExternalHref } from "@/lib/links";
import { formatPostDateShort } from "@/lib/post-date";

export type NowBuilding = { text: string; href?: string; asOf: string };

/** Hand-maintained. Update text and asOf together, or set to null to hide the cell. */
export const NOW_BUILDING: NowBuilding | null = {
  text: "Rebuilding my OpenClaw agent on Letta",
  href: seriesHref("OpenClaw Deployment"),
  asOf: "2026-10-16",
};

type Props = {
  inProgress: SeriesInProgress | null;
  nowBuilding?: NowBuilding | null;
};

function NowLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <Link href={href}>{children}</Link>;
}

function seriesLabel({ name, part }: SeriesInProgress): string {
  return part !== undefined ? `${name} · Part ${part}` : name;
}

export function NowStrip({ inProgress, nowBuilding = NOW_BUILDING }: Props) {
  return (
    <section className="ed-now" aria-label="Now">
      <div className="ed-wrap">
        {nowBuilding && (
          <div className="ed-now-cell">
            <span className="ed-now-label">Now building</span>
            <span className="ed-now-value">
              {nowBuilding.href ? (
                <NowLink href={nowBuilding.href}>{nowBuilding.text}</NowLink>
              ) : (
                nowBuilding.text
              )}
              <small className="ed-now-asof">as of {formatPostDateShort(nowBuilding.asOf)}</small>
            </span>
          </div>
        )}
        {inProgress && (
          <div className="ed-now-cell">
            <span className="ed-now-label">In progress</span>
            <span className="ed-now-value">
              <NowLink href={inProgress.href}>{seriesLabel(inProgress)}</NowLink>
            </span>
          </div>
        )}
        <div className="ed-now-cell">
          <span className="ed-now-label">Next dispatch</span>
          <span className="ed-now-value">
            Every Monday <small><NowLink href="#subscribe">Subscribe</NowLink></small>
          </span>
        </div>
      </div>
    </section>
  );
}
