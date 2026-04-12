import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Projects and engineering work by Chris Johnson: a production Next.js site, retro game rebuilds, AI agent orchestration, and developer tooling.",
  alternates: {
    canonical: `${BASE_URL}/portfolio`,
  },
  openGraph: {
    title: "Portfolio — Chris Johnson",
    description:
      "Engineering projects spanning full-stack web development, game development, AI agent systems, and developer tooling.",
    url: `${BASE_URL}/portfolio`,
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
    title: "Third Conflict: 4X Space Strategy",
    description:
      "Browser-based 4X space strategy game rebuilt from a 1991 DOS classic. Technology trees, admiral system, four AI strategies, dynamic combat, and a retro terminal UI. Over 5,250 lines of pure-function architecture.",
    tech: ["TypeScript", "React", "Game AI", "Claude Code"],
    link: "https://third-conflict.vercel.app/game/setup",
  },
  {
    title: "Cann Cann: Artillery Game",
    description:
      "Recreation of a 1990 Windows 3.1 artillery game for the modern web. Three-layer architecture (engine, store, rendering) with procedural terrain generation, physics-based AI opponents, multiple weapons, and four biomes.",
    tech: ["TypeScript", "React", "Canvas", "Claude Code"],
    link: "https://cann-cann.vercel.app",
  },
  {
    title: "Claude Code AI Infrastructure",
    description:
      "Automation system for Anthropic's Claude Code CLI: persistent vector memory with semantic search via MCP, knowledge graph, session archiving, 30+ custom skills, multi-repo orchestration, and a continuous learning loop. Open-source configuration repository.",
    tech: ["TypeScript", "MCP", "SQLite", "Claude Code"],
    link: "https://github.com/chris2ao/claude-code-config",
  },
  {
    title: "OpenClaw Multi-Agent System",
    description:
      "Seven-agent AI orchestration system running on a headless Mac Mini. Telegram bot integration for each agent, a pixel-art Mission Control dashboard, hybrid vector memory with Ollama embeddings, health monitoring, and automated gateway watchdog.",
    tech: ["OpenClaw", "Ollama", "Next.js", "Telegram API"],
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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">Portfolio</h1>
          <p className="mt-4 text-lg font-body text-muted-foreground">
            Projects I&apos;ve built, configured, and tinkered with.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
