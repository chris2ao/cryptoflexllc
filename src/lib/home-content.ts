import type { BlogPost } from "./blog";
import { parsePostDate } from "./post-date";

/**
 * Derived, build-time content for the home page. Everything here is computed
 * from post frontmatter so the page never shows a hand-typed number that can
 * drift out of date.
 */

export type SeriesSummary = {
  name: string;
  href: string;
  postCount: number;
  latest: { title: string; slug: string; date: string; part?: number };
};

export type SeriesInProgress = {
  name: string;
  href: string;
  part?: number;
  title: string;
  slug: string;
};

type SeriesPost = BlogPost & { series: string };

function timeOf(post: Pick<BlogPost, "date">): number {
  const t = parsePostDate(post.date).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** Newest first; a same-day tie goes to the higher part number. */
function byNewest(a: BlogPost, b: BlogPost): number {
  return timeOf(b) - timeOf(a) || (b.seriesOrder ?? 0) - (a.seriesOrder ?? 0);
}

export function seriesHref(name: string): string {
  return `/blog/series/${encodeURIComponent(name)}`;
}

export function summarizeSeries(posts: readonly BlogPost[]): SeriesSummary[] {
  const groups = new Map<string, SeriesPost[]>();
  for (const post of posts) {
    if (!post.series) continue;
    groups.set(post.series, [...(groups.get(post.series) ?? []), post as SeriesPost]);
  }

  const summaries = Array.from(groups.entries()).map(([name, members]) => {
    const [newest] = [...members].sort(byNewest);
    return {
      name,
      href: seriesHref(name),
      postCount: members.length,
      latest: {
        title: newest.title,
        slug: newest.slug,
        date: newest.date,
        ...(newest.seriesOrder !== undefined && { part: newest.seriesOrder }),
      },
    };
  });

  return summaries.sort(
    (a, b) =>
      timeOf(b.latest) - timeOf(a.latest) || a.name.localeCompare(b.name)
  );
}

export function pickReadingPaths(
  summaries: readonly SeriesSummary[],
  { limit = 6, minPosts = 3 }: { limit?: number; minPosts?: number } = {}
): SeriesSummary[] {
  return summaries.filter((s) => s.postCount >= minPosts).slice(0, limit);
}

export function getSeriesInProgress(
  posts: readonly BlogPost[]
): SeriesInProgress | null {
  const [newest] = posts.filter((p) => p.series).sort(byNewest);
  if (!newest?.series) return null;
  return {
    name: newest.series,
    href: seriesHref(newest.series),
    ...(newest.seriesOrder !== undefined && { part: newest.seriesOrder }),
    title: newest.title,
    slug: newest.slug,
  };
}

export function postKicker(
  post: Pick<BlogPost, "series" | "seriesOrder" | "tags">
): string {
  if (post.series && post.seriesOrder !== undefined) {
    return `${post.series} · Part ${post.seriesOrder}`;
  }
  return post.series || post.tags[0] || "Notes";
}
