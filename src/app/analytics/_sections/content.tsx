import { loadContent, loadReferrerClasses } from "@/lib/analytics-queries/content";
import { loadPostPerformance } from "@/lib/analytics-queries/posts";
import type { TrafficScope } from "@/lib/analytics-queries/shared";
import { CampaignPanel } from "../_components/campaign-panel";
import { SearchQueriesPanel } from "../_components/search-queries-panel";
import { AxPanel } from "../_components/ax-panel";
import { PostPerformanceTable } from "../_components/post-performance-table";
import { ReferrerClasses } from "../_components/referrer-classes";
import { ScrollDepthChart, TimeOnPageChart } from "./lazy-charts";

export async function ContentSection({
  days,
  scope = "humans",
}: {
  days: number;
  scope?: TrafficScope;
}) {
  const [content, posts, referrers] = await Promise.all([
    loadContent(days),
    loadPostPerformance(days, scope),
    loadReferrerClasses(days, scope),
  ]);
  const {
    scrollDepth: typedScrollDepth,
    timeOnPage: typedTimeOnPage,
    campaignData: typedCampaigns,
    searchQueries: typedSearchQueries,
  } = content;

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">03 · Content</div>
      <div className="ax-section-head">
        <h2>
          What they&apos;re <em>reading.</em>
        </h2>
        <p className="lede">
          Which posts get read, where traffic came from, how deep readers
          scrolled, and how long they stayed.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Post performance" kicker={`${posts.length} POSTS`}>
          <PostPerformanceTable rows={posts} />
        </AxPanel>
      </div>

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Referrers" kicker="BY CLASS">
          <ReferrerClasses classes={referrers.classes} hosts={referrers.hosts} />
        </AxPanel>
        <AxPanel title="Campaigns" kicker="UTM TRAFFIC">
          <CampaignPanel campaigns={typedCampaigns} />
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

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Site search" kicker="QUERIES">
          <SearchQueriesPanel queries={typedSearchQueries} />
        </AxPanel>
      </div>
    </div>
  );
}
