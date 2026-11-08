import { loadContent } from "@/lib/analytics-queries/content";
import { CampaignPanel } from "../_components/campaign-panel";
import { SearchQueriesPanel } from "../_components/search-queries-panel";
import { AxPanel } from "../_components/ax-panel";
import { AxRankedList } from "../_components/ax-ranked-list";
import { ScrollDepthChart, TimeOnPageChart } from "./lazy-charts";

export async function ContentSection({ days }: { days: number }) {
  const {
    topPages: typedTopPages,
    referrers: typedReferrers,
    scrollDepth: typedScrollDepth,
    timeOnPage: typedTimeOnPage,
    campaignData: typedCampaigns,
    searchQueries: typedSearchQueries,
  } = await loadContent(days);

  const topPageItems = typedTopPages.slice(0, 10).map((p) => ({
    label: p.page_path,
    value: p.views,
    sublabel: `${p.unique_views.toLocaleString()} uniques`,
    href: p.page_path.startsWith("/") ? p.page_path : undefined,
  }));
  const referrerItems = typedReferrers.slice(0, 10).map((r) => ({
    label: r.referrer_domain || "(direct)",
    value: r.views,
    sublabel: `${r.unique_visitors.toLocaleString()} visitors`,
  }));

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">03 · Content</div>
      <div className="ax-section-head">
        <h2>
          What they&apos;re <em>reading.</em>
        </h2>
        <p className="lede">
          Top pages, where traffic came from, how deep readers scrolled, and
          how long they stayed.
        </p>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Top pages" kicker={`TOP ${topPageItems.length}`}>
          <AxRankedList items={topPageItems} />
        </AxPanel>
        <AxPanel title="Referrers" kicker={`TOP ${referrerItems.length}`}>
          <AxRankedList items={referrerItems} />
        </AxPanel>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Scroll depth" kicker="HOW FAR THEY GET">
          <ScrollDepthChart data={typedScrollDepth} />
        </AxPanel>
        <AxPanel title="Time on page" kicker="MEDIAN DWELL">
          <TimeOnPageChart data={typedTimeOnPage} />
        </AxPanel>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Campaigns" kicker="UTM TRAFFIC">
          <CampaignPanel campaigns={typedCampaigns} />
        </AxPanel>
        <AxPanel title="Site search" kicker="QUERIES">
          <SearchQueriesPanel queries={typedSearchQueries} />
        </AxPanel>
      </div>
    </div>
  );
}
