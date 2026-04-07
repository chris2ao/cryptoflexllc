/** Memory comparison blog post diagrams -- SVG-based, themed to site colors */

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

/** Five-layer memory architecture mapped to community L1/L2/L3 tiers */
export function FiveLayerArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Five-layer memory architecture mapped to the community L1/L2/L3 consensus"
      }
    >
      <svg
        viewBox="0 0 920 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="mcArrow"
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
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Five-Layer Memory Architecture
        </text>

        {/* Community tier labels (right side) */}
        <rect
          x="770"
          y="52"
          width="130"
          height="28"
          rx="6"
          className="fill-cyan-500/10 stroke-cyan-500/30"
          strokeWidth="1"
        />
        <text
          x="835"
          y="70"
          textAnchor="middle"
          className="fill-cyan-400 text-[10px] font-semibold"
        >
          Community Tiers
        </text>

        {/* L1 bracket */}
        <rect
          x="780"
          y="95"
          width="110"
          height="90"
          rx="6"
          className="fill-cyan-500/8 stroke-cyan-500/30"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x="835"
          y="118"
          textAnchor="middle"
          className="fill-cyan-400 text-[11px] font-semibold"
        >
          L1: Active
        </text>
        <text
          x="835"
          y="134"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Hot / In-session
        </text>
        <text
          x="835"
          y="148"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Working memory
        </text>

        {/* L2 bracket */}
        <rect
          x="780"
          y="200"
          width="110"
          height="90"
          rx="6"
          className="fill-emerald-500/8 stroke-emerald-500/30"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x="835"
          y="223"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-semibold"
        >
          L2: Session
        </text>
        <text
          x="835"
          y="239"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Warm / Semantic
        </text>
        <text
          x="835"
          y="253"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Vector search
        </text>

        {/* L3 bracket */}
        <rect
          x="780"
          y="305"
          width="110"
          height="90"
          rx="6"
          className="fill-violet-500/8 stroke-violet-500/30"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x="835"
          y="328"
          textAnchor="middle"
          className="fill-violet-400 text-[11px] font-semibold"
        >
          L3: Knowledge
        </text>
        <text
          x="835"
          y="344"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Cold / Structured
        </text>
        <text
          x="835"
          y="358"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Graph / Relational
        </text>

        {/* No equivalent label */}
        <rect
          x="780"
          y="420"
          width="110"
          height="170"
          rx="6"
          className="fill-amber-500/8 stroke-amber-500/30"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x="835"
          y="475"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-semibold"
        >
          No Community
        </text>
        <text
          x="835"
          y="491"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-semibold"
        >
          Equivalent
        </text>
        <text
          x="835"
          y="510"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Unique layers
        </text>

        {/* Layer 1: MEMORY.md */}
        <rect
          x="30"
          y="90"
          width="720"
          height="100"
          rx="10"
          className="fill-cyan-500/8 stroke-cyan-500/40"
          strokeWidth="1.5"
        />
        <text
          x="55"
          y="115"
          className="fill-cyan-500 text-[13px] font-semibold"
        >
          Layer 1: MEMORY.md (Auto-Memory)
        </text>

        <rect
          x="60"
          y="128"
          width="200"
          height="45"
          rx="8"
          className="fill-cyan-500/15 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="148"
          textAnchor="middle"
          className="fill-cyan-400 text-[11px] font-medium"
        >
          Per-project index
        </text>
        <text
          x="160"
          y="164"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          200-line limit, auto-loaded
        </text>

        <rect
          x="290"
          y="128"
          width="200"
          height="45"
          rx="8"
          className="fill-cyan-500/15 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="390"
          y="148"
          textAnchor="middle"
          className="fill-cyan-400 text-[11px] font-medium"
        >
          Topic files (4KB each)
        </text>
        <text
          x="390"
          y="164"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Sonnet sidequery per turn
        </text>

        <rect
          x="520"
          y="128"
          width="200"
          height="45"
          rx="8"
          className="fill-zinc-500/15 stroke-zinc-500"
          strokeWidth="1.5"
        />
        <text
          x="620"
          y="148"
          textAnchor="middle"
          className="fill-zinc-400 text-[11px] font-medium"
        >
          Syncthing sync
        </text>
        <text
          x="620"
          y="164"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Mac + Windows
        </text>

        {/* Connector to L1 */}
        <line
          x1="750"
          y1="140"
          x2="780"
          y2="140"
          className="stroke-cyan-500/40"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Layer 2: Vector Memory */}
        <rect
          x="30"
          y="200"
          width="720"
          height="90"
          rx="10"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1.5"
        />
        <text
          x="55"
          y="225"
          className="fill-emerald-500 text-[13px] font-semibold"
        >
          Layer 2: Vector Memory
        </text>

        <rect
          x="60"
          y="237"
          width="160"
          height="40"
          rx="8"
          className="fill-emerald-500/15 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="140"
          y="255"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-medium"
        >
          Ollama + sqlite-vec
        </text>
        <text
          x="140"
          y="269"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          nomic-embed (768d)
        </text>

        <rect
          x="240"
          y="237"
          width="160"
          height="40"
          rx="8"
          className="fill-emerald-500/15 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="320"
          y="255"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-medium"
        >
          Hybrid search
        </text>
        <text
          x="320"
          y="269"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          vector 0.7 / text 0.3
        </text>

        <rect
          x="420"
          y="237"
          width="160"
          height="40"
          rx="8"
          className="fill-emerald-500/15 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="500"
          y="255"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-medium"
        >
          SSE server (port 8765)
        </text>
        <text
          x="500"
          y="269"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Cross-machine access
        </text>

        <rect
          x="600"
          y="237"
          width="120"
          height="40"
          rx="8"
          className="fill-zinc-500/15 stroke-zinc-500"
          strokeWidth="1.5"
        />
        <text
          x="660"
          y="255"
          textAnchor="middle"
          className="fill-zinc-400 text-[11px] font-medium"
        >
          MMR lambda 0.7
        </text>
        <text
          x="660"
          y="269"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Diversity boost
        </text>

        {/* Connector to L2 */}
        <line
          x1="750"
          y1="245"
          x2="780"
          y2="245"
          className="stroke-emerald-500/40"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Layer 3: Knowledge Graph */}
        <rect
          x="30"
          y="300"
          width="720"
          height="90"
          rx="10"
          className="fill-violet-500/8 stroke-violet-500/40"
          strokeWidth="1.5"
        />
        <text
          x="55"
          y="325"
          className="fill-violet-500 text-[13px] font-semibold"
        >
          Layer 3: Knowledge Graph
        </text>

        <rect
          x="60"
          y="337"
          width="200"
          height="40"
          rx="8"
          className="fill-violet-500/15 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="355"
          textAnchor="middle"
          className="fill-violet-400 text-[11px] font-medium"
        >
          MCP memory server
        </text>
        <text
          x="160"
          y="369"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Entities + Relations
        </text>

        <rect
          x="290"
          y="337"
          width="200"
          height="40"
          rx="8"
          className="fill-violet-500/15 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="390"
          y="355"
          textAnchor="middle"
          className="fill-violet-400 text-[11px] font-medium"
        >
          84 entities, 71 relations
        </text>
        <text
          x="390"
          y="369"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Service dependencies, data flow
        </text>

        <rect
          x="520"
          y="337"
          width="200"
          height="40"
          rx="8"
          className="fill-zinc-500/15 stroke-zinc-500"
          strokeWidth="1.5"
        />
        <text
          x="620"
          y="355"
          textAnchor="middle"
          className="fill-zinc-400 text-[11px] font-medium"
        >
          KG sync command
        </text>
        <text
          x="620"
          y="369"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          5-phase reconciliation
        </text>

        {/* Connector to L3 */}
        <line
          x1="750"
          y1="350"
          x2="780"
          y2="350"
          className="stroke-violet-500/40"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Layer 4: Homunculus (UNIQUE) */}
        <rect
          x="30"
          y="410"
          width="720"
          height="90"
          rx="10"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1.5"
        />
        <text
          x="55"
          y="435"
          className="fill-amber-500 text-[13px] font-semibold"
        >
          Layer 4: Homunculus (Behavioral Learning)
        </text>
        <rect
          x="410"
          y="418"
          width="60"
          height="18"
          rx="4"
          className="fill-amber-500/20 stroke-amber-500"
          strokeWidth="1"
        />
        <text
          x="440"
          y="430"
          textAnchor="middle"
          className="fill-amber-400 text-[9px] font-bold"
        >
          UNIQUE
        </text>

        <rect
          x="60"
          y="448"
          width="200"
          height="40"
          rx="8"
          className="fill-amber-500/15 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="465"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-medium"
        >
          PostToolUse observations
        </text>
        <text
          x="160"
          y="479"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          13,292 entries logged
        </text>

        <rect
          x="290"
          y="448"
          width="200"
          height="40"
          rx="8"
          className="fill-amber-500/15 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="390"
          y="465"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-medium"
        >
          50 instincts extracted
        </text>
        <text
          x="390"
          y="479"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Confidence 0.3-0.85
        </text>

        <rect
          x="520"
          y="448"
          width="200"
          height="40"
          rx="8"
          className="fill-amber-500/15 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="620"
          y="465"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-medium"
        >
          /evolve synthesis
        </text>
        <text
          x="620"
          y="479"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          5 promoted skills
        </text>

        {/* Connector to unique */}
        <line
          x1="750"
          y1="460"
          x2="780"
          y2="475"
          className="stroke-amber-500/40"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Layer 5: Session Archives */}
        <rect
          x="30"
          y="510"
          width="720"
          height="90"
          rx="10"
          className="fill-rose-500/8 stroke-rose-500/40"
          strokeWidth="1.5"
        />
        <text
          x="55"
          y="535"
          className="fill-rose-500 text-[13px] font-semibold"
        >
          Layer 5: Session Archives
        </text>
        <rect
          x="330"
          y="518"
          width="90"
          height="18"
          rx="4"
          className="fill-rose-500/20 stroke-rose-500"
          strokeWidth="1"
        />
        <text
          x="375"
          y="530"
          textAnchor="middle"
          className="fill-rose-400 text-[9px] font-bold"
        >
          PARTIAL EQUIV
        </text>

        <rect
          x="60"
          y="548"
          width="200"
          height="40"
          rx="8"
          className="fill-rose-500/15 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="565"
          textAnchor="middle"
          className="fill-rose-400 text-[11px] font-medium"
        >
          Full transcript backup
        </text>
        <text
          x="160"
          y="579"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          SessionEnd hook
        </text>

        <rect
          x="290"
          y="548"
          width="200"
          height="40"
          rx="8"
          className="fill-rose-500/15 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="390"
          y="565"
          textAnchor="middle"
          className="fill-rose-400 text-[11px] font-medium"
        >
          7-phase ingestion
        </text>
        <text
          x="390"
          y="579"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Archives to memories
        </text>

        <rect
          x="520"
          y="548"
          width="200"
          height="40"
          rx="8"
          className="fill-zinc-500/15 stroke-zinc-500"
          strokeWidth="1.5"
        />
        <text
          x="620"
          y="565"
          textAnchor="middle"
          className="fill-zinc-400 text-[11px] font-medium"
        >
          Instinct extraction
        </text>
        <text
          x="620"
          y="579"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Feeds Layer 4
        </text>

        {/* Connector to unique */}
        <line
          x1="750"
          y1="560"
          x2="780"
          y2="535"
          className="stroke-rose-500/40"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
      </svg>
    </DiagramWrapper>
  );
}

/** Memory audit flow: search > group > detect > report > clean */
export function MemoryAuditFlowDiagram({ caption }: DiagramProps) {
  const steps = [
    {
      label: "Search",
      desc: "Query all memories",
      detail: "vector + graph",
      color: "fill-cyan-500",
      bg: "fill-cyan-500/10",
      stroke: "stroke-cyan-500",
    },
    {
      label: "Group",
      desc: "Cluster by topic",
      detail: "semantic similarity",
      color: "fill-emerald-500",
      bg: "fill-emerald-500/10",
      stroke: "stroke-emerald-500",
    },
    {
      label: "Detect",
      desc: "Find conflicts",
      detail: "contradictions + dupes",
      color: "fill-amber-500",
      bg: "fill-amber-500/10",
      stroke: "stroke-amber-500",
    },
    {
      label: "Report",
      desc: "Present findings",
      detail: "3 contradictions found",
      color: "fill-violet-500",
      bg: "fill-violet-500/10",
      stroke: "stroke-violet-500",
    },
    {
      label: "Clean",
      desc: "Supersede stale",
      detail: "9 memories cleaned",
      color: "fill-rose-500",
      bg: "fill-rose-500/10",
      stroke: "stroke-rose-500",
    },
  ];

  const boxW = 130;
  const boxH = 75;
  const gap = 20;
  const startX = 30;
  const y = 50;
  const svgW = startX + steps.length * (boxW + gap);

  return (
    <DiagramWrapper
      caption={
        caption ??
        "The /memory-audit pipeline: from bulk retrieval to contradiction detection and cleanup"
      }
    >
      <svg
        viewBox={`0 0 ${svgW} 150`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="maArrow"
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
          x={svgW / 2}
          y="25"
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          /memory-audit Pipeline
        </text>

        {steps.map((step, i) => {
          const x = startX + i * (boxW + gap);
          return (
            <g key={step.label}>
              {/* Step number badge */}
              <circle
                cx={x + 15}
                cy={y + 2}
                r="10"
                className={`${step.bg} ${step.stroke}`}
                strokeWidth="1"
              />
              <text
                x={x + 15}
                y={y + 6}
                textAnchor="middle"
                className={`${step.color} text-[9px] font-bold`}
              >
                {i + 1}
              </text>

              {/* Box */}
              <rect
                x={x}
                y={y + 15}
                width={boxW}
                height={boxH}
                rx="8"
                className={`${step.bg} ${step.stroke}`}
                strokeWidth="1.5"
              />
              <text
                x={x + boxW / 2}
                y={y + 38}
                textAnchor="middle"
                className={`${step.color} text-[11px] font-semibold`}
              >
                {step.label}
              </text>
              <text
                x={x + boxW / 2}
                y={y + 54}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {step.desc}
              </text>
              <text
                x={x + boxW / 2}
                y={y + 67}
                textAnchor="middle"
                className="fill-muted-foreground/60 text-[8px]"
              >
                {step.detail}
              </text>

              {/* Arrow to next */}
              {i < steps.length - 1 && (
                <line
                  x1={x + boxW}
                  y1={y + 52}
                  x2={x + boxW + gap}
                  y2={y + 52}
                  className="stroke-muted-foreground/40"
                  strokeWidth="1.5"
                  markerEnd="url(#maArrow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramWrapper>
  );
}
