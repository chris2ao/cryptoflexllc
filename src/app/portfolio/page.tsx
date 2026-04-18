import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { ThirdConflictPromo } from "@/components/third-conflict-promo";
import { CannCannPromo } from "@/components/cann-cann-promo";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Projects and engineering work by Chris Johnson: a production Next.js site, retro game rebuilds, AI agent orchestration, and developer tooling.",
  alternates: {
    canonical: `${BASE_URL}/portfolio`,
  },
  openGraph: {
    title: "Portfolio: Chris Johnson",
    description:
      "Engineering projects spanning full-stack web development, game development, AI agent systems, and developer tooling.",
    url: `${BASE_URL}/portfolio`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Portfolio&author=Chris+Johnson`,
        width: 1200,
        height: 630,
        alt: "Chris Johnson Portfolio",
      },
    ],
  },
};

const projects = [
  {
    title: "CryptoFlex LLC (This Site)",
    description:
      "Full-stack production website built with Next.js 15, React 19, and TypeScript. Custom analytics dashboard with IP intelligence, subscriber newsletter with AI-generated intros, blog commenting system, resource library, and an MDX content engine. Built entirely with Claude Code.",
    tech: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Neon Postgres"],
    link: "https://github.com/chris2ao/cryptoflexllc",
  },
  {
    title: "Claude Code AI Infrastructure",
    description:
      "Automation system for Anthropic's Claude Code CLI: persistent vector memory with semantic search via MCP, knowledge graph, session archiving, 30+ custom skills, multi-repo orchestration, and a continuous learning loop. Open-source configuration repository.",
    tech: ["TypeScript", "MCP", "SQLite", "Claude Code"],
    link: "https://github.com/chris2ao/claude-code-config",
  },
  {
    title: "Persistent Memory for Claude Code",
    description:
      "Two-tier persistent memory architecture: a global rule file plus a vector-database MCP server with 30-day temporal decay and hybrid local embedding. Context survives every session with zero manual effort across projects.",
    tech: ["Claude Code", "MCP", "Vector DB", "Python"],
    link: "/blog/persistent-memory-for-claude-code",
  },
  {
    title: "Custom UniFi MCP Server",
    description:
      "A custom Model Context Protocol server for UniFi: 103 tools, 208 unit tests, built across three days. Lazy-loads per product, packaged as a Claude Code plugin that installs with two slash commands.",
    tech: ["Python", "FastMCP", "UniFi", "MCP"],
    link: "/blog/building-a-custom-unifi-mcp-103-tools-across-three-days",
  },
  {
    title: "5-Layer Memory Architecture",
    description:
      "A five-layer persistent memory stack for AI agents (auto, vector, graph, homunculus, session archive). Benchmarked via deep research against community norms; three architectural improvements shipped the same day.",
    tech: ["MCP", "Vector DB", "Knowledge Graph", "Architecture"],
    link: "/blog/my-5-layer-memory-system-vs-the-world-what-deep-research-revealed",
  },
  {
    title: "OpenClaw Multi-Agent System",
    description:
      "Seven-agent AI orchestration system running on a headless Mac Mini. Telegram bot integration for each agent, a pixel-art Mission Control dashboard, hybrid vector memory with Ollama embeddings, health monitoring, and automated gateway watchdog.",
    tech: ["OpenClaw", "Ollama", "Next.js", "Telegram API"],
  },
  {
    title: "Gmail Cleanup Agent",
    description:
      "Autonomous AI inbox cleaner for personal Gmail. Evolved from a manual 5-step script to a v3 agent with VIP detection, delta sync, auto-labeling, and follow-up tracking. Runs unattended every 5 hours on a Mac Mini via launchd and a remote-control daemon.",
    tech: ["Claude Code", "Google Workspace", "launchd", "Agents"],
    link: "/blog/gmail-cleanup-agent-personal-ai-email-assistant",
  },
  {
    title: "NotebookLM Content Pipeline",
    description:
      "Programmatic content-creation pipeline that turns blog posts into branded infographics and slide decks. A custom agent and skill drive notebooklm-py through source ingestion, generation, and automated QA against the site's design system.",
    tech: ["Python", "NotebookLM", "Agents", "Skills"],
    link: "/blog/notebooklm-content-pipeline-from-blog-posts-to-branded-visuals",
  },
  {
    title: "Cryptocurrency Mining Infrastructure",
    description:
      "Designed and built a multi-GPU mining operation from scratch: hardware selection, thermal management, power distribution, and monitoring. Deep dive into Linux system administration and hardware optimization.",
    tech: ["Linux", "Hardware", "Networking", "Monitoring"],
  },
];

export default function PortfolioPage() {
  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 03 / Selected Work"
        overline="Portfolio"
        title={<>Things I&apos;ve <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>built.</em></>}
        lede="Projects I&apos;ve shipped, configured, and tinkered with — full-stack sites, retro game rebuilds, agent systems, and infrastructure."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <ThirdConflictPromo />
            <CannCannPromo />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
