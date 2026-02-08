import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

const contentDir = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(contentDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "1970-01-01",
      description: data.description ?? "",
      tags: data.tags ?? [],
      content,
    };
  });

  // Sort by date descending (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return undefined;
  }
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "1970-01-01",
    description: data.description ?? "",
    tags: data.tags ?? [],
    content,
  };
}
