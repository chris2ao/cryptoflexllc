import { getDb } from "@/lib/analytics";
import type { TrafficScope } from "./shared";
import type {
  CommentRow,
  ConvertingPageRow,
  GuestbookRow,
  SubscriberGrowthRow,
  SubscriberRow,
} from "@/lib/analytics-types";

type SubscriberSummaryRow = { total: number; active: number; inactive: number };

export interface NewsletterData {
  subscriberList: SubscriberRow[];
  subscriberGrowth: SubscriberGrowthRow[];
  convertingPages: ConvertingPageRow[];
  commentList: CommentRow[];
  guestbookList: GuestbookRow[];
  subscriberSummary: SubscriberSummaryRow[];
  digestRuns: DigestRunRow[];
}

export interface DigestRunRow {
  ran_at: string;
  recipients: number;
  sent: number;
  failed: number;
  duration_ms: number;
  clicks7d: number;
}

// One query: the clicks are a correlated count of human (or not yet
// classified) page views tagged utm_campaign = 'weekly-digest' in the seven
// days after each send.
export async function loadDigestRuns(limit = 12): Promise<DigestRunRow[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      d.ran_at,
      d.recipients,
      d.sent,
      d.failed,
      d.duration_ms,
      (
        SELECT COUNT(*)::int
        FROM page_views pv
        WHERE pv.utm_campaign = 'weekly-digest'
          AND (pv.traffic_class = 'human' OR pv.traffic_class IS NULL)
          AND pv.visited_at >= d.ran_at
          AND pv.visited_at < d.ran_at + INTERVAL '7 days'
      ) AS clicks7d
    FROM digest_runs d
    ORDER BY d.ran_at DESC
    LIMIT ${limit}
  `.catch(() => [])) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    ran_at: r.ran_at instanceof Date ? r.ran_at.toISOString() : String(r.ran_at),
    recipients: Number(r.recipients) || 0,
    sent: Number(r.sent) || 0,
    failed: Number(r.failed) || 0,
    duration_ms: Number(r.duration_ms) || 0,
    clicks7d: Number(r.clicks7d) || 0,
  }));
}

// Subscribers, comments and the guestbook are not page_views: the scope
// parameter is accepted for a uniform loader signature and not applied.
export async function loadNewsletter(
  _days: number,
  _scope: TrafficScope = "humans"
): Promise<NewsletterData> {
  const sql = getDb();

  const [
    subscriberSummary,
    subscriberList,
    subscriberGrowth,
    convertingPages,
    commentList,
    guestbookList,
    digestRuns,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE active = TRUE)::int AS active,
        COUNT(*) FILTER (WHERE active = FALSE)::int AS inactive
      FROM subscribers
    `.catch(() => [{ total: 0, active: 0, inactive: 0 }]),
    sql`
      SELECT id, email, subscribed_at, active, ip_address, country, city, region
      FROM subscribers ORDER BY subscribed_at DESC
    `.catch(() => []),
    sql`
      WITH weekly AS (
        SELECT
          DATE_TRUNC('week', subscribed_at)::date::text AS week,
          COUNT(*)::int AS new_subscribers
        FROM subscribers
        GROUP BY DATE_TRUNC('week', subscribed_at)
        ORDER BY week
      )
      SELECT
        week,
        new_subscribers,
        SUM(new_subscribers) OVER (ORDER BY week)::int AS cumulative
      FROM weekly
    `.catch(() => []),
    sql`
      SELECT
        source_page,
        COUNT(*)::int AS subscriber_count
      FROM subscribers
      WHERE source_page IS NOT NULL AND source_page != ''
      GROUP BY source_page
      ORDER BY subscriber_count DESC
      LIMIT 15
    `.catch(() => []),
    sql`
      SELECT id, slug, comment, reaction, email, created_at
      FROM blog_comments
      ORDER BY created_at DESC
    `.catch(() => []),
    sql`
      SELECT id, name, message, ip, approved, created_at
      FROM guestbook
      ORDER BY created_at DESC
    `.catch(() => []),
    loadDigestRuns(),
  ]);

  return {
    subscriberList: subscriberList as unknown as SubscriberRow[],
    subscriberGrowth: subscriberGrowth as unknown as SubscriberGrowthRow[],
    convertingPages: convertingPages as unknown as ConvertingPageRow[],
    commentList: commentList as unknown as CommentRow[],
    guestbookList: guestbookList as unknown as GuestbookRow[],
    subscriberSummary: subscriberSummary as unknown as SubscriberSummaryRow[],
    digestRuns,
  };
}
