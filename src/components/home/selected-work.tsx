import Image from "next/image";
import Link from "next/link";

type Project = {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "contain" | "cover";
};

const projects: Project[] = [
  {
    title: "Persistent Memory for Claude Code",
    description:
      "Two-tier memory architecture: a global rule file plus a vector-database MCP server with 30-day temporal decay. Context survives every session with zero manual effort.",
    tech: ["Claude Code", "MCP", "Vector DB"],
    link: "/blog/persistent-memory-for-claude-code",
    image: "/images/blog/persistent-memory-two-tier-architecture.png",
    imageAlt: "Two-tier persistent memory architecture for Claude Code",
    imageFit: "cover",
  },
  {
    title: "Third Conflict",
    description:
      "Browser-based 4X space strategy game rebuilt from a 1991 DOS classic. Tech trees, admiral system, four AI strategies, and 5,250+ lines of pure-function architecture.",
    tech: ["TypeScript", "React", "Game AI"],
    link: "https://third-conflict.vercel.app",
  },
  {
    title: "Custom UniFi MCP",
    description:
      "103 tools, 208 unit tests, 12 hours across three days. A lazy-loading UniFi MCP server packaged as a Claude Code plugin that installs with two slash commands.",
    tech: ["Python", "FastMCP", "UniFi"],
    link: "/blog/building-a-custom-unifi-mcp-103-tools-across-three-days",
  },
  {
    title: "Claude Code Config",
    description:
      "Open-source automation system: persistent vector memory, knowledge graph, 30+ custom skills, multi-repo orchestration, continuous learning loop.",
    tech: ["TypeScript", "MCP", "SQLite"],
    link: "https://github.com/chris2ao/claude-code-config",
  },
  {
    title: "OpenClaw",
    description:
      "Seven-agent orchestration system on a headless Mac Mini. Telegram bots per agent, pixel-art Mission Control dashboard, Ollama embeddings, watchdogs.",
    tech: ["OpenClaw", "Ollama", "Telegram"],
    link: "/portfolio",
    image: "/images/blog/mission-control-soc-hero.png",
    imageAlt: "OpenClaw Mission Control pixel-art SOC dashboard",
    imageFit: "cover",
  },
  {
    title: "5-Layer Memory System vs. The World",
    description:
      "22 sources, 3 parallel research agents, 18 search queries. Benchmarked my 5-layer memory architecture against community norms and shipped three improvements the same day.",
    tech: ["Deep Research", "MCP", "Memory"],
    link: "/blog/my-5-layer-memory-system-vs-the-world-what-deep-research-revealed",
  },
];

export function SelectedWork() {
  return (
    <section id="work" className="ed-section reveal">
      <div className="ed-section-label">§ 03 / Selected Work</div>
      <div className="ed-wrap">
        <div className="ed-section-head reveal">
          <div className="ed-overline">Portfolio</div>
          <h2>Things I&apos;ve shipped.</h2>
          <p className="lede">
            Six representative builds — memory architecture, MCP servers,
            retro game rebuilds, and agent systems. More on the portfolio page.
          </p>
        </div>

        <div className="ed-work-grid">
          {projects.map((project, i) => {
            const isFeatured = i === 0;
            const isExternal = project.link?.startsWith("http");
            const common = (
              <>
                <div className="ed-work-head">
                  <span className="ed-work-idx">
                    {String(i + 1).padStart(2, "0")} / 06
                  </span>
                  <span className="ed-work-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {isFeatured && (
                  project.image ? (
                    <div className={`ed-work-shot ${project.imageFit === "contain" ? "ed-work-shot--contain" : "ed-work-shot--cover"}`}>
                      <Image
                        src={project.image}
                        alt={project.imageAlt ?? project.title}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        className={project.imageFit === "contain" ? "object-contain" : "object-cover"}
                      />
                    </div>
                  ) : (
                    <div className="shot">SHOT / {project.title.toLowerCase()}</div>
                  )
                )}
                {!isFeatured && project.image && (
                  <div className={`ed-work-shot ed-work-shot--small ${project.imageFit === "contain" ? "ed-work-shot--contain" : "ed-work-shot--cover"}`}>
                    <Image
                      src={project.image}
                      alt={project.imageAlt ?? project.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className={project.imageFit === "contain" ? "object-contain" : "object-cover"}
                    />
                  </div>
                )}
                {project.tech.length > 0 && (
                  <div className="ed-work-meta">
                    {project.tech.map((chip) => (
                      <span key={chip} className="chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </>
            );

            // Layout: featured (3 cols x 2 rows) + 2 cards (span-3 each) + 3 cards (span-2 each)
            const spanClass = isFeatured
              ? " ed-work-feat"
              : i <= 2
                ? " span-3"
                : " span-2";
            const className = `ed-work reveal${spanClass}`;

            if (!project.link) {
              return (
                <div key={project.title} className={className}>
                  {common}
                </div>
              );
            }
            if (isExternal) {
              return (
                <a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {common}
                </a>
              );
            }
            return (
              <Link key={project.title} href={project.link} className={className}>
                {common}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
