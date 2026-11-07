import Link from "next/link";
import type { NowBuilding } from "@/lib/home-content";
import { isExternalHref } from "@/lib/links";
import { formatPostDateShort } from "@/lib/post-date";

type Props = {
  nowBuilding: NowBuilding | null;
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

export function NowStrip({ nowBuilding }: Props) {
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
