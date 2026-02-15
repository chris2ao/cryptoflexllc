import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  readingTime: string;
  description: string;
  tags: string[];
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

  return {
    slug,
    title: data.title ?? slug,
    date,
    author: data.author ?? "",
    readingTime: data.readingTime ?? "",
    description: data.description ?? "",
    tags: data.tags ?? [],
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

export function getBacklogPostBySlug(slug: string): BlogPost | undefined {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return undefined;
  }
  const filePath = path.join(backlogDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  return parsePost(slug, filePath);
}
