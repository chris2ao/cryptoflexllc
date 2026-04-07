/** Deep Research blog post diagrams -- SVG-based, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return (
    <DiagramLightbox caption={caption}>
      {children}
    </DiagramLightbox>
  );
}

/** Three-tier research tool stack: Exa > Firecrawl > WebSearch/WebFetch */
export function ThreeTierResearchDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Three-tier research tool stack: Exa for semantic search, Firecrawl for JS-rendered scraping, WebSearch/WebFetch as fallback"
      }
    >
      <svg
        viewBox="0 0 1000 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl mx-auto"
      >
        <defs>
          <marker
            id="drArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="500"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Deep Research: Three-Tier Tool Stack
        </text>

        {/* Claude Code Session box (top center) */}
        <rect
          x="370"
          y="50"
          width="260"
          height="55"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500/50"
          strokeWidth="1.5"
        />
        <text
          x="500"
          y="74"
          textAnchor="middle"
          className="fill-cyan-400 text-[13px] font-semibold"
        >
          Claude Code Session
        </text>
        <text
          x="500"
          y="94"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          /deep-research skill + parallel haiku agents
        </text>

        {/* Arrows from session to three tiers */}
        <line
          x1="420"
          y1="105"
          x2="165"
          y2="155"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#drArrow)"
        />
        <line
          x1="500"
          y1="105"
          x2="500"
          y2="155"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#drArrow)"
        />
        <line
          x1="580"
          y1="105"
          x2="835"
          y2="155"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#drArrow)"
        />

        {/* Tier labels */}
        <text
          x="165"
          y="145"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Tier 1 (primary)
        </text>
        <text
          x="500"
          y="145"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Tier 2 (JS pages)
        </text>
        <text
          x="835"
          y="145"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Tier 3 (fallback)
        </text>

        {/* TIER 1: Exa MCP */}
        <rect
          x="10"
          y="160"
          width="310"
          height="150"
          rx="10"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1.5"
        />
        <text
          x="165"
          y="186"
          textAnchor="middle"
          className="fill-emerald-400 text-[13px] font-semibold"
        >
          Exa (MCP Server)
        </text>
        <text
          x="165"
          y="202"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Semantic web search
        </text>

        {/* Exa tool badges */}
        {[
          { label: "web_search_exa", x: 25, w: 105 },
          { label: "crawling_exa", x: 140, w: 85 },
          { label: "code_context", x: 235, w: 75 },
        ].map((tool) => (
          <g key={tool.label}>
            <rect
              x={tool.x}
              y="215"
              width={tool.w}
              height="22"
              rx="6"
              className="fill-emerald-500/15 stroke-emerald-500/60"
              strokeWidth="1"
            />
            <text
              x={tool.x + tool.w / 2}
              y="230"
              textAnchor="middle"
              className="fill-emerald-400 text-[8px] font-mono"
            >
              {tool.label}
            </text>
          </g>
        ))}

        {/* Exa capabilities */}
        {[
          "Date filtering, domain scoping",
          "LinkedIn search, GitHub/SO search",
          "1000 req/mo free tier",
        ].map((cap, i) => (
          <g key={cap}>
            <circle cx="35" cy={252 + i * 16} r="2.5" className="fill-emerald-400/60" />
            <text
              x="45"
              y={256 + i * 16}
              className="fill-muted-foreground text-[9px]"
            >
              {cap}
            </text>
          </g>
        ))}

        {/* TIER 2: Firecrawl MCP */}
        <rect
          x="345"
          y="160"
          width="310"
          height="150"
          rx="10"
          className="fill-violet-500/8 stroke-violet-500/40"
          strokeWidth="1.5"
        />
        <text
          x="500"
          y="186"
          textAnchor="middle"
          className="fill-violet-400 text-[13px] font-semibold"
        >
          Firecrawl (MCP Server)
        </text>
        <text
          x="500"
          y="202"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          JS-rendered scraping + crawling
        </text>

        {/* Firecrawl tool badges */}
        {[
          { label: "scrape", x: 360, w: 55 },
          { label: "crawl", x: 425, w: 50 },
          { label: "search", x: 485, w: 55 },
          { label: "extract", x: 550, w: 55 },
        ].map((tool) => (
          <g key={tool.label}>
            <rect
              x={tool.x}
              y="215"
              width={tool.w}
              height="22"
              rx="6"
              className="fill-violet-500/15 stroke-violet-500/60"
              strokeWidth="1"
            />
            <text
              x={tool.x + tool.w / 2}
              y="230"
              textAnchor="middle"
              className="fill-violet-400 text-[8px] font-mono"
            >
              {tool.label}
            </text>
          </g>
        ))}

        {/* Firecrawl capabilities */}
        {[
          "Full JS rendering, anti-bot bypass",
          "Site crawling, structured extraction",
          "500 credits free tier",
        ].map((cap, i) => (
          <g key={cap}>
            <circle cx="370" cy={252 + i * 16} r="2.5" className="fill-violet-400/60" />
            <text
              x="380"
              y={256 + i * 16}
              className="fill-muted-foreground text-[9px]"
            >
              {cap}
            </text>
          </g>
        ))}

        {/* TIER 3: WebSearch + WebFetch */}
        <rect
          x="680"
          y="160"
          width="310"
          height="150"
          rx="10"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1.5"
        />
        <text
          x="835"
          y="186"
          textAnchor="middle"
          className="fill-amber-400 text-[13px] font-semibold"
        >
          WebSearch + WebFetch (Built-in)
        </text>
        <text
          x="835"
          y="202"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Keyword search + basic HTTP fetch
        </text>

        {/* WebSearch/WebFetch tool badges */}
        {[
          { label: "WebSearch", x: 720, w: 80 },
          { label: "WebFetch", x: 815, w: 75 },
        ].map((tool) => (
          <g key={tool.label}>
            <rect
              x={tool.x}
              y="215"
              width={tool.w}
              height="22"
              rx="6"
              className="fill-amber-500/15 stroke-amber-500/60"
              strokeWidth="1"
            />
            <text
              x={tool.x + tool.w / 2}
              y="230"
              textAnchor="middle"
              className="fill-amber-400 text-[8px] font-mono"
            >
              {tool.label}
            </text>
          </g>
        ))}

        {/* WebSearch/WebFetch capabilities */}
        {[
          "No JS rendering, no date filtering",
          "Blocked by LinkedIn and many SPAs",
          "Free, always available",
        ].map((cap, i) => (
          <g key={cap}>
            <circle cx="705" cy={252 + i * 16} r="2.5" className="fill-amber-400/60" />
            <text
              x="715"
              y={256 + i * 16}
              className="fill-muted-foreground text-[9px]"
            >
              {cap}
            </text>
          </g>
        ))}

        {/* Decision flow at bottom */}
        <rect
          x="60"
          y="340"
          width="880"
          height="55"
          rx="10"
          className="fill-cyan-500/5 stroke-cyan-500/20"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="500"
          y="362"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          When to Use Each Tier
        </text>

        {/* Decision criteria */}
        <text
          x="165"
          y="382"
          textAnchor="middle"
          className="fill-emerald-400 text-[9px]"
        >
          Semantic queries, date-filtered,
        </text>
        <text
          x="165"
          y="392"
          textAnchor="middle"
          className="fill-emerald-400 text-[9px]"
        >
          LinkedIn, code context
        </text>
        <text
          x="500"
          y="382"
          textAnchor="middle"
          className="fill-violet-400 text-[9px]"
        >
          SPAs, dynamic pages, full-site
        </text>
        <text
          x="500"
          y="392"
          textAnchor="middle"
          className="fill-violet-400 text-[9px]"
        >
          crawls, JSON extraction
        </text>
        <text
          x="835"
          y="382"
          textAnchor="middle"
          className="fill-amber-400 text-[9px]"
        >
          Simple static pages, quick
        </text>
        <text
          x="835"
          y="392"
          textAnchor="middle"
          className="fill-amber-400 text-[9px]"
        >
          lookups, MCP unavailable
        </text>

        {/* Wrapper script callout at bottom */}
        <rect
          x="200"
          y="420"
          width="600"
          height="80"
          rx="10"
          className="fill-red-500/5 stroke-red-500/30"
          strokeWidth="1.5"
        />
        <text
          x="500"
          y="445"
          textAnchor="middle"
          className="fill-red-400 text-[11px] font-semibold"
        >
          Key Gotcha: MCP Environment Variables
        </text>
        <text
          x="500"
          y="464"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          env: &#123;&#125; in MCP config passes nothing to child processes.
        </text>
        <text
          x="500"
          y="478"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Shell variables from .zshrc do NOT reach MCP subprocesses.
        </text>
        <text
          x="500"
          y="492"
          textAnchor="middle"
          className="fill-red-400 text-[9px] font-semibold"
        >
          Fix: wrapper scripts that source secrets.env before exec
        </text>
      </svg>
    </DiagramWrapper>
  );
}
