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
    slug: "unifi-mcp-infographic",
    title: "Custom UniFi MCP for Claude Code: Infographic",
    description:
      "A visual overview of composing a custom UniFi MCP server from two open-source libraries: 103 tools across Network and Protect, the FastMCP closure trick, probe-by-status-code endpoint archaeology, PRODUCT_UNAVAILABLE stubs, and the single-repo plugin marketplace pattern.",
    type: "document",
    tags: ["Claude Code", "MCP", "UniFi", "Home Lab", "Infographic"],
    date: "2026-04-17",
    downloadPath: "/blog/unifi-mcp-infographic.png",
    downloadLabel: "Download Infographic",
  },
  {
    slug: "unifi-mcp-slides",
    title: "Custom UniFi MCP for Claude Code: Slide Deck",
    description:
      "A slide deck covering the full build of chris2ao/unifi-mcp: the /deep-research survey that found two contenders, the compose-don't-clone decision, three-loader lazy architecture, the FastMCP _bind_client closure, probe-by-status-code endpoint archaeology, AJV_PARSE_ERROR as a negative-space signal, PRODUCT_UNAVAILABLE stubs, and the Claude Code plugin install path.",
    type: "document",
    tags: ["Claude Code", "MCP", "UniFi", "Home Lab", "Slides"],
    date: "2026-04-17",
    downloadPath: "/resources/unifi-mcp-slides.pdf",
    downloadLabel: "Download Slide Deck",
  },
  {
    slug: "ui-ux-skill-system-infographic",
    title: "/ui-ux Skill System Infographic",
    description:
      "A visual overview of the 5-agent UI/UX design team: the 3-tier research pipeline, director + specialist architecture, shared knowledge base, performance budget, security firewall, and the reskin vs. redesign lesson.",
    type: "document",
    tags: ["Claude Code", "UI/UX", "Design Systems", "Agent Teams", "Infographic"],
    date: "2026-04-12",
    downloadPath: "/blog/ui-ux-skill-system-infographic.png",
    downloadLabel: "Download Infographic",
  },
  {
    slug: "ui-ux-skill-system-slides",
    title: "/ui-ux Skill System Slide Deck",
    description:
      "15-slide deck covering the end-to-end journey of building a 5-agent UI/UX design team: 12 skills evaluated in 3 tiers, the 36% prompt injection security decision, director + 4 specialists architecture, shared knowledge base, parallel quality gate, and engineering takeaways.",
    type: "document",
    tags: ["Claude Code", "UI/UX", "Design Systems", "Agent Teams", "Slides"],
    date: "2026-04-12",
    downloadPath: "/resources/ui-ux-skill-system-slides.pdf",
    downloadLabel: "Download Slide Deck",
  },
  {
    slug: "deep-research-slides",
    title: "Deep Research Stack: Exa + Firecrawl for Claude Code",
    description:
      "6-slide deck covering the three-tier research architecture: WebSearch limitations, Exa semantic search, Firecrawl JS scraping, the wrapper script security pattern, and the /deep-research skill workflow.",
    type: "document",
    tags: ["Claude Code", "Research", "Exa", "Firecrawl", "Slides"],
    date: "2026-04-06",
    downloadPath: "/resources/deep-research-slides.pdf",
    downloadLabel: "Download Slide Deck",
  },
  {
    slug: "memory-comparison-slides",
    title: "5-Layer Memory Architecture: Research and Comparison",
    description:
      "15-slide deck from a 22-source research report comparing persistent memory approaches for Claude Code. Covers the community landscape, the 5-layer architecture, Homunculus behavioral learning, fact versioning, and the memory-audit command.",
    type: "document",
    tags: ["Claude Code", "Memory", "Architecture", "Research", "Slides"],
    date: "2026-04-06",
    downloadPath: "/resources/memory-comparison-slides.pdf",
    downloadLabel: "Download Slide Deck",
  },
  {
    slug: "notebooklm-content-pipeline-infographic",
    title: "NotebookLM Content Pipeline Infographic",
    description:
      "A visual overview of the NotebookLM content pipeline: the 6-step generation process, security audit with three HIGH findings and mitigations, 4-dimension QA gate, and performance specs.",
    type: "document",
    tags: ["NotebookLM", "Content Creation", "Automation", "Infographic"],
    date: "2026-04-02",
    downloadPath: "/images/blog/notebooklm-pipeline/infographic.png",
    downloadLabel: "Download Infographic",
  },
  {
    slug: "notebooklm-content-pipeline-slides",
    title: "NotebookLM Content Pipeline Slide Deck",
    description:
      "A 12-slide deep dive into building an autonomous content pipeline with NotebookLM: from threat modeling the unofficial API to the 6-step agent workflow, brand priming, and the 4-dimension QA loop.",
    type: "document",
    tags: ["NotebookLM", "Content Creation", "Automation", "Slides"],
    date: "2026-04-02",
    downloadPath: "/resources/notebooklm-content-pipeline-slides.pdf",
    downloadLabel: "Download Slide Deck",
  },
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
