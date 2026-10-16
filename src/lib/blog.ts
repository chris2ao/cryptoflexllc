import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  author: string;
  readingTime: string;
  description: string;
  tags: string[];
  featured?: boolean;
  series?: string;
  seriesOrder?: number;
  schemaType?: "Article" | "TechArticle" | "HowTo";
  coverImage?: string;
  coverImageAlt?: string;
  content: string;
}

const contentDir = path.join(process.cwd(), "src/content/blog");
const backlogDir = path.join(process.cwd(), "src/content/backlog");

type ParsedFile = Pick<ReturnType<typeof parseFrontmatter>, "data" | "content">;

function readPostFile(filePath: string): ParsedFile {
  const { data, content } = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
  return { data, content };
}

const NO_VALUES = new Set(["false", "no", "off", "0"]);

/**
 * `published: false` in a live post's frontmatter hides it everywhere: lists,
 * feeds, the sitemap, series pages, and its own URL. Other explicit "no"
 * values (quoted, capitalized, no, off, 0) also hide it, so pulling a post in
 * a hurry fails closed. CI still insists on a real boolean and an entry in
 * src/content/hidden-posts.json (src/__tests__/published-frontmatter.test.ts).
 */
function isUnpublished(value: unknown): boolean {
  if (value === false || value === 0) return true;
  return typeof value === "string" && NO_VALUES.has(value.trim().toLowerCase());
}

/** Frontmatter for a draft going live: today's date, and no `published` flag to hide it. */
export function toPublishedFrontmatter(
  data: Record<string, unknown>,
  date: string
): Record<string, unknown> {
  const { published: _published, ...rest } = data;
  return { ...rest, date };
}

function parsePost(slug: string, filePath: string): BlogPost {
  return toBlogPost(slug, readPostFile(filePath));
}

function toBlogPost(slug: string, { data, content }: ParsedFile): BlogPost {
  // gray-matter auto-parses YAML dates into Date objects; normalize to string
  const rawDate = data.date;
  const date =
    rawDate instanceof Date
      ? rawDate.toISOString().split("T")[0]
      : (rawDate ?? "1970-01-01");

  const rawUpdatedAt = data.updatedAt;
  const updatedAt =
    rawUpdatedAt instanceof Date
      ? rawUpdatedAt.toISOString().split("T")[0]
      : rawUpdatedAt ?? undefined;

  return {
    slug,
    title: data.title ?? slug,
    date,
    updatedAt,
    author: data.author ?? "",
    readingTime: data.readingTime ?? "",
    description: data.description ?? "",
    tags: data.tags ?? [],
    featured: data.featured ?? undefined,
    series: data.series ?? undefined,
    seriesOrder: data.seriesOrder ?? undefined,
    schemaType: data.schemaType ?? undefined,
    coverImage: data.coverImage ?? undefined,
    coverImageAlt: data.coverImageAlt ?? undefined,
    content,
  };
}

// Published posts are immutable within a deployment, so dynamic routes
// (e.g. backlog draft previews) can reuse one parse instead of re-reading
// every .mdx file per request. Dev stays uncached so edits show up.
let allPostsCache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (process.env.NODE_ENV === "production" && allPostsCache) {
    return allPostsCache;
  }
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.flatMap((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const parsed = readPostFile(path.join(contentDir, filename));
    return isUnpublished(parsed.data.published) ? [] : [toBlogPost(slug, parsed)];
  });

  // Sort by date descending (newest first)
  const sorted = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (process.env.NODE_ENV === "production") {
    allPostsCache = sorted;
  }
  return sorted;
}

export function getBacklogPosts(): BlogPost[] {
  if (!fs.existsSync(backlogDir)) return [];

  const files = fs.readdirSync(backlogDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(backlogDir, filename);
    return parsePost(slug, filePath);
  });

  // Sort by date descending (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

/**
 * A hidden (`published: false`) post resolves to undefined, so its page 404s.
 * Pass includeUnpublished for checks that must see every file on disk, such
 * as the publish route's slug-collision guard.
 */
export function getPostBySlug(
  slug: string,
  { includeUnpublished = false }: { includeUnpublished?: boolean } = {}
): BlogPost | undefined {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return undefined;
  }
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const parsed = readPostFile(filePath);
  if (!includeUnpublished && isUnpublished(parsed.data.published)) return undefined;
  return toBlogPost(slug, parsed);
}

export function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  limit: number = 3
): BlogPost[] {
  const posts = getAllPosts();
  const currentTagsLower = currentTags.map((t) => t.toLowerCase());

  const scored = posts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      const postTagsLower = post.tags.map((t) => t.toLowerCase());
      const overlap = currentTagsLower.filter((t) =>
        postTagsLower.includes(t)
      ).length;
      return { post, score: overlap };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime());

  return scored.slice(0, limit).map((item) => item.post);
}

export function getSeriesPosts(seriesName: string): BlogPost[] {
  const posts = getAllPosts();
  return posts
    .filter((p) => p.series === seriesName)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}

export function getAllSeries(): { name: string; postCount: number }[] {
  const posts = getAllPosts();
  const seriesMap = new Map<string, number>();
  for (const post of posts) {
    if (post.series) {
      seriesMap.set(post.series, (seriesMap.get(post.series) ?? 0) + 1);
    }
  }
  return Array.from(seriesMap.entries())
    .map(([name, postCount]) => ({ name, postCount }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getBacklogPostBySlug(slug: string): BlogPost | undefined {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return undefined;
  }
  const filePath = path.join(backlogDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  return parsePost(slug, filePath);
}
