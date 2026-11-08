import { getDb } from "@/lib/analytics";
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
}

export async function loadNewsletter(_days: number): Promise<NewsletterData> {
  const sql = getDb();

  const [
    subscriberSummary,
    subscriberList,
    subscriberGrowth,
    convertingPages,
    commentList,
    guestbookList,
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
  ]);

  return {
    subscriberList: subscriberList as unknown as SubscriberRow[],
    subscriberGrowth: subscriberGrowth as unknown as SubscriberGrowthRow[],
    convertingPages: convertingPages as unknown as ConvertingPageRow[],
    commentList: commentList as unknown as CommentRow[],
    guestbookList: guestbookList as unknown as GuestbookRow[],
    subscriberSummary: subscriberSummary as unknown as SubscriberSummaryRow[],
  };
}
