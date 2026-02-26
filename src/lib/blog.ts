import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  author: string;
  readingTime: string;
  description: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  schemaType?: "Article" | "TechArticle" | "HowTo";
  content: string;
}

const contentDir = path.join(process.cwd(), "src/content/blog");
const backlogDir = path.join(process.cwd(), "src/content/backlog");

function parsePost(slug: string, filePath: string): BlogPost {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

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
    series: data.series ?? undefined,
    seriesOrder: data.seriesOrder ?? undefined,
    schemaType: data.schemaType ?? undefined,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(contentDir, filename);
    return parsePost(slug, filePath);
  });

  // Sort by date descending (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return undefined;
  }
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  return parsePost(slug, filePath);
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
