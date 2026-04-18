/** /homenet-document blog post diagrams: SVG-based, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return <DiagramLightbox caption={caption}>{children}</DiagramLightbox>;
}

/**
 * /homenet-document architecture: orchestrator + 3 specialists across 6 phases,
 * with HomeNetwork/ markdown output and a redacted NotebookLM publication.
 */
export function HomenetDocumentTeamDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "/homenet-document orchestrator runs 6 phases across 4 agents, producing 19 HomeNetwork/ markdown files, 2 diagrams, and a redacted NotebookLM notebook"
      }
    >
      <svg
        viewBox="0 0 920 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="hndArrow"
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
          x="460"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          /homenet-document Agent Team and Phase Flow
        </text>

        {/* Orchestrator box */}
        <rect
          x="320"
          y="48"
          width="280"
          height="72"
          rx="12"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="2"
        />
        <text
          x="460"
          y="74"
          textAnchor="middle"
          className="fill-violet-400 text-[13px] font-semibold"
        >
          network-architect (Opus)
        </text>
        <text
          x="460"
          y="92"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Orchestrator + diagram generator
        </text>
        <text
          x="460"
          y="106"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Phases 1, 3, 4, 5, 6 + UniFi MCP read-only
        </text>

        {/* Phase 1 lane */}
        <rect
          x="20"
          y="140"
          width="880"
          height="58"
          rx="8"
          className="fill-cyan-500/5 stroke-cyan-500/30"
          strokeWidth="1"
        />
        <text
          x="40"
          y="160"
          className="fill-cyan-500/80 text-[11px] font-semibold"
        >
          PHASE 1 - Data extraction
        </text>
        <text
          x="40"
          y="180"
          className="fill-muted-foreground text-[10px]"
        >
          30+ UniFi MCP tools across 10 categories
        </text>
        <text
          x="880"
          y="180"
          textAnchor="end"
          className="fill-muted-foreground/70 text-[10px]"
        >
          1.16 MB JSON snapshot, 86 tools probed
        </text>

        {/* Arrow from orchestrator to Phase 1 */}
        <line
          x1="460"
          y1="120"
          x2="460"
          y2="140"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hndArrow)"
        />

        {/* Phase 2 lane (parallel specialists) */}
        <rect
          x="20"
          y="215"
          width="880"
          height="180"
          rx="10"
          className="fill-emerald-500/5 stroke-emerald-500/30"
          strokeWidth="1"
        />
        <text
          x="40"
          y="235"
          className="fill-emerald-500/80 text-[11px] font-semibold"
        >
          PHASE 2 - Specialist analysis (designed parallel, ran inline)
        </text>

        {/* Arrow into Phase 2 */}
        <line
          x1="460"
          y1="198"
          x2="460"
          y2="215"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hndArrow)"
        />

        {/* Tech writer */}
        <rect
          x="40"
          y="250"
          width="270"
          height="130"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="175"
          y="273"
          textAnchor="middle"
          className="fill-amber-400 text-[12px] font-semibold"
        >
          network-tech-writer (Sonnet)
        </text>
        <text
          x="175"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Rewrites every HomeNetwork/ md file
        </text>
        <text
          x="175"
          y="309"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Inventory, topology, devices, configs
        </text>
        <text
          x="175"
          y="325"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Tiered client strategy, house style
        </text>
        <text
          x="175"
          y="345"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Output: 16 markdown files
        </text>
        <text
          x="175"
          y="365"
          textAnchor="middle"
          className="fill-amber-500/70 text-[9px]"
        >
          Read-only against MCP
        </text>

        {/* Security engineer */}
        <rect
          x="325"
          y="250"
          width="270"
          height="130"
          rx="8"
          className="fill-rose-500/10 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="460"
          y="273"
          textAnchor="middle"
          className="fill-rose-400 text-[12px] font-semibold"
        >
          network-security-engineer (Sonnet)
        </text>
        <text
          x="460"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Scores findings: Severity - Usability
        </text>
        <text
          x="460"
          y="309"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          MCP-actionable fixes only
        </text>
        <text
          x="460"
          y="325"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Output: security-recommendations.md
        </text>
        <text
          x="460"
          y="345"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          8 findings, 1 false-positive caught
        </text>
        <text
          x="460"
          y="365"
          textAnchor="middle"
          className="fill-rose-500/70 text-[9px]"
        >
          Read-only against MCP
        </text>

        {/* Research */}
        <rect
          x="610"
          y="250"
          width="270"
          height="130"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="745"
          y="273"
          textAnchor="middle"
          className="fill-cyan-400 text-[12px] font-semibold"
        >
          network-research (Sonnet)
        </text>
        <text
          x="745"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          /deep-research threads
        </text>
        <text
          x="745"
          y="309"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          UDM Pro hardening, U7 RF tuning,
        </text>
        <text
          x="745"
          y="325"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          ZBF home IoT segmentation
        </text>
        <text
          x="745"
          y="345"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Output: 3 cited research files
        </text>
        <text
          x="745"
          y="365"
          textAnchor="middle"
          className="fill-cyan-500/70 text-[9px]"
        >
          Exa + Firecrawl + WebSearch
        </text>

        {/* Phase 3 lane */}
        <rect
          x="20"
          y="410"
          width="880"
          height="60"
          rx="8"
          className="fill-amber-500/5 stroke-amber-500/30"
          strokeWidth="1"
        />
        <text
          x="40"
          y="430"
          className="fill-amber-500/80 text-[11px] font-semibold"
        >
          PHASE 3 - Diagram generation
        </text>
        <text
          x="40"
          y="450"
          className="fill-muted-foreground text-[10px]"
        >
          mingrammer/diagrams + Graphviz, 2 outputs each in SVG and PNG
        </text>
        <text
          x="880"
          y="450"
          textAnchor="end"
          className="fill-muted-foreground/70 text-[10px]"
        >
          logical-network + physical-topology
        </text>

        {/* Arrow into Phase 3 */}
        <line
          x1="460"
          y1="395"
          x2="460"
          y2="410"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hndArrow)"
        />

        {/* Phase 4 lane */}
        <rect
          x="20"
          y="485"
          width="880"
          height="58"
          rx="8"
          className="fill-violet-500/5 stroke-violet-500/30"
          strokeWidth="1"
        />
        <text
          x="40"
          y="505"
          className="fill-violet-500/80 text-[11px] font-semibold"
        >
          PHASE 4 - Synthesis
        </text>
        <text
          x="40"
          y="525"
          className="fill-muted-foreground text-[10px]"
        >
          README executive summary + cross-link research into security findings
        </text>

        {/* Arrow into Phase 4 */}
        <line
          x1="460"
          y1="470"
          x2="460"
          y2="485"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hndArrow)"
        />

        {/* Phase 5 lane */}
        <rect
          x="20"
          y="558"
          width="880"
          height="60"
          rx="8"
          className="fill-rose-500/5 stroke-rose-500/30"
          strokeWidth="1"
        />
        <text
          x="40"
          y="578"
          className="fill-rose-500/80 text-[11px] font-semibold"
        >
          PHASE 5 - Redaction + NotebookLM
        </text>
        <text
          x="40"
          y="598"
          className="fill-muted-foreground text-[10px]"
        >
          homenet-redact.py scrubs PSKs, PPSKs, RADIUS, bearer tokens (16 secrets caught)
        </text>
        <text
          x="880"
          y="598"
          textAnchor="end"
          className="fill-muted-foreground/70 text-[10px]"
        >
          20 redacted sources to "Johnson Home Network"
        </text>

        {/* Arrow into Phase 5 */}
        <line
          x1="460"
          y1="543"
          x2="460"
          y2="558"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hndArrow)"
        />

        {/* Phase 6 lane */}
        <rect
          x="20"
          y="633"
          width="880"
          height="58"
          rx="8"
          className="fill-emerald-500/8 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="40"
          y="653"
          className="fill-emerald-400 text-[11px] font-semibold"
        >
          PHASE 6 - Final report
        </text>
        <text
          x="40"
          y="673"
          className="fill-muted-foreground text-[10px]"
        >
          19 HomeNetwork/ markdown files + 2 diagrams + 1 NotebookLM notebook + 1 real bug shipped
        </text>

        {/* Arrow into Phase 6 */}
        <line
          x1="460"
          y1="618"
          x2="460"
          y2="633"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hndArrow)"
        />
      </svg>
    </DiagramWrapper>
  );
}
