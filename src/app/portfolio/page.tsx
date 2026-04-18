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
