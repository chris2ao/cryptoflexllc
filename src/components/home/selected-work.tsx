import Image from "next/image";
import Link from "next/link";
import type { SeriesSummary } from "@/lib/home-content";
import { isExternalHref } from "@/lib/links";
import { SectionLabel } from "./section-label";

type Variant = "featured" | "media" | "compact";

type Project = {
  title: string;
  description: string;
  tech: string[];
  variant: Variant;
  link?: string;
  image?: string;
  imageAlt?: string;
  seriesNames?: string[];
};

const projects: Project[] = [
  {
    title: "A home SOC, built from the logs up",
    description:
      "Wazuh on four hosts, a ClickHouse log lake fed by the UDM Pro and Pi-hole, and a Mission Control dashboard that turns DNS traffic into threat-intel detections. Planned, deployed, and debugged in public across three series.",
    tech: ["Wazuh", "ClickHouse", "FastAPI"],
    variant: "featured",
    image: "/blog/building-a-custom-siem-part-1-why-and-architecture/infographic.jpg",
    imageAlt:
      "Custom homelab SIEM architecture: UDP syslog from the UDM Pro, Pi-hole, access points, and switches into Vector on a Mac mini, parsed and written to ClickHouse on an external SSD with 180-day retention, with SQLite kept for reference and ack data.",
    seriesNames: [
      "Homelab Wazuh Deployment",
      "Custom SIEM",
      "Home Network Mission Control",
    ],
  },
  {
    title: "Security reviews of this site",
    description:
      "Two rounds so far. In round two, five security agents and an advocate for my priorities had to agree before anything shipped. They caught a blog draft that could have run code on the server. It's fixed, deployed, and checked in CI on every push.",
    tech: ["AppSec", "OWASP", "Multi-agent"],
    variant: "media",
    link: "/blog/security-review-round-two",
    image: "/blog/security-review-round-two/infographic.jpg",
    imageAlt:
      "Dark editorial cover for Security Review: Round Two, with a safe frontmatter fence labelled Data, Renders Fine beside a dangerous one labelled Code, Would Execute, above a row of six chips naming the review team.",
  },
  {
    title: "Ledgerly",
    description:
      "A local-first personal finance app. Bank exports land in one SQLite file on my machine, and the chat answers questions by querying that database through MCP tools, using the Claude CLI I already had.",
    tech: ["Next.js", "SQLite", "MCP"],
    variant: "media",
    link: "/blog/series/Ledgerly",
    image: "/blog/building-ledgerly-v1/infographic.jpg",
    imageAlt:
      "Dark teal cover graphic titled Ledgerly, Part 1, Local-First Personal Finance, with four panels for Import, Dashboard, Chat, and Reports.",
  },
  {
    title: "Cramdex",
    description:
      "An MIT-licensed study app for open-book GIAC exams: a page-accurate book reader, full-text search that cites book and page, quiz decks, and grounded Q&A over your own course PDFs.",
    tech: ["FastAPI", "React", "SQLite FTS5"],
    variant: "compact",
    link: "/blog/cramdex-open-source-sans-study-app",
  },
  {
    title: "Custom UniFi MCP",
    description:
      "A lazy-loading MCP server for UniFi Network, Protect, and Access, packaged as a Claude Code plugin. Built in three days, then maintained in the open with issues, releases, and semver.",
    tech: ["Python", "FastMCP", "UniFi"],
    variant: "compact",
    link: "/blog/building-a-custom-unifi-mcp-103-tools-across-three-days",
  },
  {
    title: "My Claude Code setup",
    description:
      "The harness behind everything above: memory that survives sessions, specialist agents, hooks, and multi-agent workflows for writing, reviewing, and shipping, written up as the Claude Harness Modernization series.",
    tech: ["Claude Code", "MCP", "Hooks"],
    variant: "compact",
    link: "/blog/series/Claude%20Harness%20Modernization",
  },
];

// Static class map: never interpolate Tailwind or ed-* fragments.
const VARIANT_CLASS: Record<Variant, string> = {
  featured: "ed-work ed-work-feat reveal",
  media: "ed-work ed-work-media reveal span-3",
  compact: "ed-work ed-work-compact reveal span-2",
};

// Compact cards render no image, so they need no sizes entry.
const IMAGE_SIZES: Record<Exclude<Variant, "compact">, string> = {
  featured: "(max-width: 900px) 100vw, 700px",
  media: "(max-width: 900px) 100vw, 50vw",
};

function WorkHead({ position, total, linked }: { position: number; total: number; linked: boolean }) {
  return (
    <div className="ed-work-head">
      <span className="ed-work-idx">
        {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      {linked && (
        <span className="ed-work-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </div>
  );
}

function WorkChips({ tech }: { tech: string[] }) {
  if (tech.length === 0) return null;
  return (
    <div className="ed-work-meta">
      {tech.map((chip) => (
        <span key={chip} className="chip">
          {chip}
        </span>
      ))}
    </div>
  );
}

function WorkImage({ project }: { project: Project }) {
  if (!project.image || project.variant === "compact") return null;
  return (
    <div className="ed-work-shot">
      <Image
        src={project.image}
        alt={project.imageAlt ?? project.title}
        fill
        sizes={IMAGE_SIZES[project.variant]}
        className="object-cover"
      />
    </div>
  );
}

function SeriesLinks({ names, series }: { names: string[]; series: SeriesSummary[] }) {
  const found = names
    .map((name) => series.find((s) => s.name === name))
    .filter((s): s is SeriesSummary => s !== undefined);
  if (found.length === 0) return null;
  return (
    <ul className="ed-work-series">
      {found.map((s) => (
        <li key={s.name}>
          <Link href={s.href}>
            {s.name} · {s.postCount} parts <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FeaturedCard({
  project,
  position,
  total,
  series,
}: {
  project: Project;
  position: number;
  total: number;
  series: SeriesSummary[];
}) {
  return (
    <article className={VARIANT_CLASS.featured}>
      <div className="ed-work-feat-body">
        <WorkHead position={position} total={total} linked={false} />
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <SeriesLinks names={project.seriesNames ?? []} series={series} />
        <WorkChips tech={project.tech} />
      </div>
      <WorkImage project={project} />
    </article>
  );
}

function LinkedCard({
  project,
  position,
  total,
}: {
  project: Project;
  position: number;
  total: number;
}) {
  const className = VARIANT_CLASS[project.variant];
  const link = project.link ?? "/portfolio";
  // The whole card is the link; name it by its title rather than every word inside it.
  const titleId = `work-title-${position}`;
  const content = (
    <>
      <WorkHead position={position} total={total} linked />
      <h3 id={titleId}>{project.title}</h3>
      <p>{project.description}</p>
      <WorkImage project={project} />
      <WorkChips tech={project.tech} />
    </>
  );

  if (isExternalHref(link)) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-labelledby={titleId}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={link} className={className} aria-labelledby={titleId}>
      {content}
    </Link>
  );
}

export function SelectedWork({ index, series }: { index: number; series: SeriesSummary[] }) {
  const total = projects.length;

  return (
    <section id="work" className="ed-section reveal">
      <SectionLabel index={index} name="Selected Work" />
      <div className="ed-wrap">
        <div className="ed-section-head reveal">
          <div className="ed-overline">Portfolio</div>
          <h2>Things I&apos;ve shipped.</h2>
          <p className="lede">
            What I built this year, from a home SOC to the AI setup behind all
            of it. More on the <Link href="/portfolio">portfolio page</Link>.
          </p>
        </div>

        <div className="ed-work-grid">
          {projects.map((project, i) =>
            project.variant === "featured" ? (
              <FeaturedCard
                key={project.title}
                project={project}
                position={i + 1}
                total={total}
                series={series}
              />
            ) : (
              <LinkedCard key={project.title} project={project} position={i + 1} total={total} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
