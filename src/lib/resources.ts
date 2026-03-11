export interface Resource {
  slug: string;
  title: string;
  description: string;
  type: "carousel" | "infographic" | "document" | "download";
  tags: string[];
  date: string;
  iframeHeight?: string;
  downloadPath?: string;
}

const resources: Resource[] = [
  {
    slug: "claude-code-persistent-memory",
    title: "Claude Code Persistent Memory",
    description:
      "A reference guide covering the two-tier persistent memory architecture for Claude Code: global rule configuration, vector database MCP server setup, search modes, and troubleshooting.",
    type: "document",
    tags: ["Claude Code", "Memory", "MCP", "Vector Search"],
    date: "2026-03-10",
    downloadPath: "/resources/claude-code-persistent-memory.pdf",
  },
  {
    slug: "architecture-diagram",
    title: "CryptoFlex LLC Architecture Diagram",
    description:
      "A full visual map of the site architecture: Next.js 16 App Router, Neon Postgres, Vercel Edge, 20+ API routes, and all external services with icons.",
    type: "infographic",
    tags: ["Architecture", "Next.js", "Vercel", "Neon", "Infrastructure"],
    date: "2026-02-25",
    iframeHeight: "3200px",
  },
  {
    slug: "week-one-carousel",
    title: "7 Days, 117 Commits: The Full Story",
    description:
      "A 10-slide visual recap of building cryptoflexllc.com from zero to production in one week with Claude Code.",
    type: "carousel",
    tags: ["Next.js", "Security", "AI", "DevOps"],
    date: "2026-02-14",
  },
  {
    slug: "claude-code-intro",
    title: "Getting Started with Claude Code",
    description:
      "A visual guide to installing Claude Code, what it does, and a 5-step roadmap for getting up and running.",
    type: "infographic",
    tags: ["Claude Code", "Getting Started", "AI"],
    date: "2026-02-06",
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
