import { loadNewsletter } from "@/lib/analytics-queries/newsletter";
import { SubscriberPanel } from "../_components/subscriber-panel";
import { CommentsPanel } from "../_components/comments-panel";
import { GuestbookPanel } from "../_components/guestbook-panel";
import { KpiStrip } from "../_components/kpi-strip";
import { AxPanel } from "../_components/ax-panel";
import { AxRankedList } from "../_components/ax-ranked-list";
import { SubscriberGrowthChart } from "./lazy-charts";

export async function NewsletterSection({ days: _days }: { days: number }) {
  const {
    subscriberList: typedSubscribers,
    subscriberGrowth: typedSubGrowth,
    convertingPages: typedConverting,
    commentList: typedComments,
    guestbookList: typedGuestbook,
    subscriberSummary,
  } = await loadNewsletter(_days);

  const subStats = subscriberSummary[0] || { total: 0, active: 0, inactive: 0 };

  const convertingItems = typedConverting.slice(0, 10).map((c) => ({
    label: c.source_page,
    value: c.subscriber_count,
    href: c.source_page.startsWith("/") ? c.source_page : undefined,
  }));

  const newsletterKpis = [
    { id: "total", label: "Subscribers", value: subStats.total, hint: "▲" },
    { id: "active", label: "Active", value: subStats.active, hint: "—" },
    {
      id: "comments",
      label: "Comments",
      value: typedComments.length,
      hint: "—",
    },
    {
      id: "guestbook",
      label: "Guestbook",
      value: typedGuestbook.length,
      hint: "—",
    },
  ];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">07 · Newsletter</div>
      <div className="ax-section-head">
        <h2>
          Subscribers &amp; <em>community.</em>
        </h2>
        <p className="lede">
          Newsletter growth, converting pages, plus the live moderation queues
          for comments and guestbook entries.
        </p>
      </div>

      <KpiStrip items={newsletterKpis} />

      <div className="ax-grid-2" style={{ marginBottom: 20 }}>
        <AxPanel title="Subscriber growth" kicker="WEEKLY">
          <SubscriberGrowthChart data={typedSubGrowth} />
        </AxPanel>
        <AxPanel title="Top converting pages" kicker={`TOP ${convertingItems.length}`}>
          <AxRankedList items={convertingItems} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel
          title="Subscribers"
          kicker={`${subStats.active} ACTIVE · ${subStats.inactive} INACTIVE`}
        >
          <SubscriberPanel
            totalCount={subStats.total}
            activeCount={subStats.active}
            inactiveCount={subStats.inactive}
            subscribers={typedSubscribers}
          />
        </AxPanel>
      </div>

      <div className="ax-grid-2">
        <AxPanel title="Blog comments" kicker={`${typedComments.length} TOTAL`}>
          <CommentsPanel comments={typedComments} />
        </AxPanel>
        <AxPanel title="Guestbook" kicker={`${typedGuestbook.length} ENTRIES`}>
          <GuestbookPanel entries={typedGuestbook} />
        </AxPanel>
      </div>
    </div>
  );
}
