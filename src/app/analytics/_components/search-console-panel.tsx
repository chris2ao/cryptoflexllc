import { AxRankedList, type RankedItem } from "./ax-ranked-list";
import type { SearchConsoleData } from "@/lib/analytics-queries/content";

const SITE_HOSTS = new Set(["cryptoflexllc.com", "www.cryptoflexllc.com"]);

/** Shorten same-site URLs to their path; leave anything else untouched. */
function pageLabel(url: string): { label: string; href?: string } {
  try {
    const u = new URL(url);
    if (SITE_HOSTS.has(u.hostname)) {
      const path = `${u.pathname}${u.search}` || "/";
      return { label: path, href: path.startsWith("/") && !path.startsWith("//") ? path : undefined };
    }
  } catch {
    if (url.startsWith("/") && !url.startsWith("//")) return { label: url, href: url };
  }
  return { label: url };
}

function sublabel(impressions: number, position: number): string {
  return `${impressions.toLocaleString()} impr · pos ${position.toFixed(1)}`;
}

export function SearchConsolePanel({ data }: { data: SearchConsoleData }) {
  if (!data.configured) {
    return (
      <div className="ax-gsc-setup">
        <p>Search Console is not configured</p>
        <ul>
          <li>
            <code>GSC_CLIENT_EMAIL</code>
          </li>
          <li>
            <code>GSC_PRIVATE_KEY</code>
          </li>
          <li>
            <code>GSC_SITE_URL</code>
          </li>
        </ul>
        <p>Service account with the Search Console API, added as a Full user on the property</p>
      </div>
    );
  }

  const emptyText = "No Search Console rows for this window";
  const queries: RankedItem[] = data.queries.map((r) => ({
    label: r.keys[0] ?? "(unknown)",
    value: r.clicks,
    sublabel: sublabel(r.impressions, r.position),
  }));
  const pages: RankedItem[] = data.pages.map((r) => {
    const { label, href } = pageLabel(r.keys[0] ?? "");
    return { label: label || "(unknown)", value: r.clicks, sublabel: sublabel(r.impressions, r.position), href };
  });
  const clicks = data.daily.reduce((sum, r) => sum + r.clicks, 0);
  const impressions = data.daily.reduce((sum, r) => sum + r.impressions, 0);

  return (
    <div>
      <div className="ax-grid-2">
        <div>
          <p className="ax-gsc-subhead">Top queries by clicks</p>
          <AxRankedList items={queries} emptyText={emptyText} />
        </div>
        <div>
          <p className="ax-gsc-subhead">Top pages by clicks</p>
          <AxRankedList items={pages} emptyText={emptyText} />
        </div>
      </div>
      <p className="ax-gsc-summary">
        {clicks.toLocaleString()} clicks · {impressions.toLocaleString()} impressions
        {data.window ? ` · ${data.window.startDate} to ${data.window.endDate}` : ""}
      </p>
    </div>
  );
}
