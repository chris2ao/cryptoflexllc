import Link from "next/link";

type Project = {
  title: string;
  description: string;
  tech: string[];
  link?: string;
};

const projects: Project[] = [
  {
    title: "CryptoFlex LLC",
    description:
      "Full-stack production site: Next.js 15, React 19, TypeScript. Custom analytics, newsletter, comments, MDX engine. Built end-to-end with Claude Code.",
    tech: ["Next.js", "TypeScript", "Neon", "MDX"],
    link: "/portfolio",
  },
  {
    title: "Third Conflict",
    description:
      "Browser-based 4X space strategy game rebuilt from a 1991 DOS classic. Tech trees, admiral system, four AI strategies, and 5,250+ lines of pure-function architecture.",
    tech: ["TypeScript", "React", "Game AI"],
    link: "https://third-conflict.vercel.app",
  },
  {
    title: "Cann Cann",
    description:
      "Recreation of a 1990 Windows 3.1 artillery game. Three-layer engine/store/render architecture with procedural terrain, physics AI, four biomes.",
    tech: ["TypeScript", "Canvas", "Physics"],
    link: "https://cann-cann.vercel.app",
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
  },
  {
    title: "Mining Rig",
    description:
      "Multi-GPU mining operation built from scratch. Hardware selection, thermal management, power distribution, Linux sysadmin deep-dive.",
    tech: ["Linux", "Hardware", "Ops"],
    link: "/portfolio",
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
            Six representative builds — full-stack sites, retro game rebuilds,
            agent systems, and infrastructure. More on the portfolio page.
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
                  <div className="shot">SHOT / {project.title.toLowerCase()}</div>
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
