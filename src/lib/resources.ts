export interface Resource {
  slug: string;
  title: string;
  description: string;
  type: "carousel" | "infographic" | "document" | "audio" | "download";
  tags: string[];
  date: string;
  iframeHeight?: string;
  downloadPath?: string;
  downloadLabel?: string;
}

const resources: Resource[] = [
  {
    slug: "hardened-mac-mini-ai-servers",
    title: "Building a Hardened AI Server Stack",
    description:
      "A 10-page reference covering the full engineering approach to running an M4 Mac Mini as a 24/7 OpenClaw server: power management, network stall mechanics, watchdog cron implementation, and the midnight race condition.",
    type: "document",
    tags: ["Mac Mini", "OpenClaw", "AI Agents", "Self-Hosted", "Infrastructure"],
    date: "2026-03-15",
    downloadPath: "/resources/hardened-mac-mini-ai-servers.pdf",
  },
  {
    slug: "headless-mac-mini-infographic",
    title: "Headless Mac Mini: Quick Tips Infographic",
    description:
      "A visual step-by-step guide to the three fixes that keep OpenClaw running 24/7 on a headless Mac Mini: power management, gateway watchdog, and daily log creation.",
    type: "document",
    tags: ["Mac Mini", "OpenClaw", "AI Agents", "Infographic"],
    date: "2026-03-15",
    downloadPath: "/images/blog/headless-mac-mini-infographic.png",
    downloadLabel: "Download Infographic",
  },
  {
    slug: "mcp-security-audio-briefing",
    title: "The Security Risks of Community MCP Servers: Audio Briefing",
    description:
      "A deep-dive audio briefing on how popular MCP servers can leak Google credentials, the risks of community-built AI tool integrations, and how to evaluate them before installing.",
    type: "audio",
    tags: ["Security", "MCP", "Claude Code", "Audio"],
    date: "2026-03-10",
    downloadPath: "/resources/mcp-security-risks-audio-briefing.m4a",
    downloadLabel: "Download Audio Briefing",
  },
  {
    slug: "mcp-security-trap",
    title: "The MCP Security Trap",
    description:
      "A reference document covering the security risks of community MCP servers: credential extraction patterns, blast radius analysis, Google ToS violations, and a checklist for evaluating MCP tools before installation.",
    type: "document",
    tags: ["Security", "MCP", "Claude Code", "Google"],
    date: "2026-03-10",
    downloadPath: "/resources/mcp-security-trap.pdf",
  },
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
