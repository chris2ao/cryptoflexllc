export interface Resource {
  slug: string;
  title: string;
  description: string;
  type: "carousel" | "document" | "download";
  tags: string[];
  date: string;
}

const resources: Resource[] = [
  {
    slug: "week-one-carousel",
    title: "7 Days, 117 Commits: The Full Story",
    description:
      "A 10-slide visual recap of building cryptoflexllc.com from zero to production in one week with Claude Code.",
    type: "carousel",
    tags: ["Next.js", "Security", "AI", "DevOps"],
    date: "2026-02-14",
  },
];

export function getAllResources(): Resource[] {
  return [...resources].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getResourceBySlug(slug: string): Resource | undefined {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    return undefined;
  }
  return resources.find((r) => r.slug === slug);
}
