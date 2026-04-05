/** Family Wiki Biography Blueprint blog post diagrams -- SVG-based, themed to site colors */

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

/** Two-path approach: NotebookLM vs Local Text Files */
export function TwoPathApproachDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Two paths to the same destination: NotebookLM extraction for rich documents, local text files for everything else"
      }
    >
      <svg
        viewBox="0 0 800 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="fwArrow"
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
          x="400"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Two Paths, Same Pipeline
        </text>

        {/* Source Documents box (top center) */}
        <rect
          x="275"
          y="50"
          width="250"
          height="55"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500/50"
          strokeWidth="1.5"
        />
        <text
          x="400"
          y="72"
          textAnchor="middle"
          className="fill-cyan-400 text-[13px] font-semibold"
        >
          Your Source Documents
        </text>
        <text
          x="400"
          y="92"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          PDFs, images, text files, self-written narratives
        </text>

        {/* Split arrows */}
        <line
          x1="340"
          y1="105"
          x2="200"
          y2="160"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#fwArrow)"
        />
        <line
          x1="460"
          y1="105"
          x2="600"
          y2="160"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#fwArrow)"
        />

        {/* Path A: NotebookLM */}
        <rect
          x="60"
          y="165"
          width="280"
          height="80"
          rx="10"
          className="fill-amber-500/10 stroke-amber-500/50"
          strokeWidth="1.5"
        />
        <text
          x="200"
          y="190"
          textAnchor="middle"
          className="fill-amber-400 text-[12px] font-semibold"
        >
          Path A: NotebookLM MCP
        </text>
        <text
          x="200"
          y="210"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Captain extracts via MCP tools
        </text>
        <text
          x="200"
          y="226"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Best for: PDFs, scanned docs, images
        </text>

        {/* Path B: Local Files */}
        <rect
          x="460"
          y="165"
          width="280"
          height="80"
          rx="10"
          className="fill-emerald-500/10 stroke-emerald-500/50"
          strokeWidth="1.5"
        />
        <text
          x="600"
          y="190"
          textAnchor="middle"
          className="fill-emerald-400 text-[12px] font-semibold"
        >
          Path B: Local Text Files
        </text>
        <text
          x="600"
          y="210"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Place .txt files in source directory
        </text>
        <text
          x="600"
          y="226"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Best for: narratives, text docs, copy-paste
        </text>

        {/* Converge arrows */}
        <line
          x1="200"
          y1="245"
          x2="340"
          y2="310"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#fwArrow)"
        />
        <line
          x1="600"
          y1="245"
          x2="460"
          y2="310"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#fwArrow)"
        />

        {/* Label: saves to local .txt */}
        <text
          x="200"
          y="278"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          saves to local .txt files
        </text>
        <text
          x="600"
          y="278"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          already local .txt files
        </text>

        {/* Convergence point */}
        <rect
          x="275"
          y="310"
          width="250"
          height="55"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500/50"
          strokeWidth="1.5"
        />
        <text
          x="400"
          y="332"
          textAnchor="middle"
          className="fill-cyan-400 text-[13px] font-semibold"
        >
          Parallel Researcher Agents
        </text>
        <text
          x="400"
          y="352"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Read local files only (identical pipeline)
        </text>

        {/* Arrow to output */}
        <line
          x1="400"
          y1="365"
          x2="400"
          y2="395"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#fwArrow)"
        />
        <text
          x="400"
          y="412"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          Wikipedia-Style Biography Page
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** Captain-Coordinator architecture diagram */
export function CaptainCoordinatorDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The captain-coordinator pattern: one orchestrator with MCP access spawns parallel researchers that read only local files"
      }
    >
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="ccArrow"
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
          x="400"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Captain-Coordinator Multi-Agent Architecture
        </text>

        {/* Captain box */}
        <rect
          x="250"
          y="50"
          width="300"
          height="70"
          rx="10"
          className="fill-cyan-500/15 stroke-cyan-500/60"
          strokeWidth="2"
        />
        <text
          x="400"
          y="75"
          textAnchor="middle"
          className="fill-cyan-400 text-[13px] font-semibold"
        >
          Captain Agent (Main Session)
        </text>
        <text
          x="400"
          y="95"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Orchestration + MCP access + conflict resolution + prose writing
        </text>
        <text
          x="400"
          y="110"
          textAnchor="middle"
          className="fill-cyan-400/60 text-[9px]"
        >
          Opus or Sonnet
        </text>

        {/* MCP sidebar (connected to captain) */}
        <rect
          x="600"
          y="55"
          width="160"
          height="60"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/50"
          strokeWidth="1.5"
        />
        <text
          x="680"
          y="78"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-semibold"
        >
          NotebookLM MCP
        </text>
        <text
          x="680"
          y="96"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          (optional)
        </text>
        <line
          x1="550"
          y1="85"
          x2="600"
          y2="85"
          className="stroke-amber-500/50"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Constraint callout */}
        <rect
          x="30"
          y="55"
          width="190"
          height="60"
          rx="8"
          className="fill-red-500/10 stroke-red-500/40"
          strokeWidth="1"
        />
        <text
          x="125"
          y="78"
          textAnchor="middle"
          className="fill-red-400 text-[10px] font-semibold"
        >
          Claude Code Limitation
        </text>
        <text
          x="125"
          y="96"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Background agents cannot
        </text>
        <text
          x="125"
          y="108"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          access MCP tools
        </text>

        {/* Local files layer */}
        <rect
          x="200"
          y="160"
          width="400"
          height="40"
          rx="6"
          className="fill-zinc-500/10 stroke-zinc-500/30"
          strokeWidth="1"
        />
        <text
          x="400"
          y="184"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          Local Text Files (biography/data/raw/*.txt)
        </text>

        {/* Arrow captain to files */}
        <line
          x1="400"
          y1="120"
          x2="400"
          y2="157"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#ccArrow)"
        />
        <text
          x="445"
          y="143"
          className="fill-muted-foreground/70 text-[9px]"
        >
          extracts + saves
        </text>

        {/* Three researcher agents */}
        {/* Researcher 1 */}
        <rect
          x="60"
          y="250"
          width="200"
          height="70"
          rx="10"
          className="fill-emerald-500/10 stroke-emerald-500/50"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="275"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-semibold"
        >
          Researcher 1
        </text>
        <text
          x="160"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Career + Professional
        </text>
        <text
          x="160"
          y="307"
          textAnchor="middle"
          className="fill-emerald-400/60 text-[9px]"
        >
          Sonnet
        </text>

        {/* Researcher 2 */}
        <rect
          x="300"
          y="250"
          width="200"
          height="70"
          rx="10"
          className="fill-emerald-500/10 stroke-emerald-500/50"
          strokeWidth="1.5"
        />
        <text
          x="400"
          y="275"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-semibold"
        >
          Researcher 2
        </text>
        <text
          x="400"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Education + Credentials
        </text>
        <text
          x="400"
          y="307"
          textAnchor="middle"
          className="fill-emerald-400/60 text-[9px]"
        >
          Sonnet
        </text>

        {/* Researcher 3 */}
        <rect
          x="540"
          y="250"
          width="200"
          height="70"
          rx="10"
          className="fill-emerald-500/10 stroke-emerald-500/50"
          strokeWidth="1.5"
        />
        <text
          x="640"
          y="275"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-semibold"
        >
          Researcher 3
        </text>
        <text
          x="640"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Personal + Public Life
        </text>
        <text
          x="640"
          y="307"
          textAnchor="middle"
          className="fill-emerald-400/60 text-[9px]"
        >
          Sonnet
        </text>

        {/* Arrows from files to researchers */}
        <line
          x1="300"
          y1="200"
          x2="160"
          y2="247"
          className="stroke-muted-foreground/40"
          strokeWidth="1"
          markerEnd="url(#ccArrow)"
        />
        <line
          x1="400"
          y1="200"
          x2="400"
          y2="247"
          className="stroke-muted-foreground/40"
          strokeWidth="1"
          markerEnd="url(#ccArrow)"
        />
        <line
          x1="500"
          y1="200"
          x2="640"
          y2="247"
          className="stroke-muted-foreground/40"
          strokeWidth="1"
          markerEnd="url(#ccArrow)"
        />

        {/* Label: reads */}
        <text
          x="210"
          y="222"
          className="fill-muted-foreground/60 text-[8px]"
        >
          reads
        </text>
        <text
          x="407"
          y="222"
          className="fill-muted-foreground/60 text-[8px]"
        >
          reads
        </text>
        <text
          x="570"
          y="222"
          className="fill-muted-foreground/60 text-[8px]"
        >
          reads
        </text>

        {/* Arrows from researchers back to captain synthesis */}
        <line
          x1="160"
          y1="320"
          x2="310"
          y2="370"
          className="stroke-muted-foreground/40"
          strokeWidth="1"
          markerEnd="url(#ccArrow)"
        />
        <line
          x1="400"
          y1="320"
          x2="400"
          y2="370"
          className="stroke-muted-foreground/40"
          strokeWidth="1"
          markerEnd="url(#ccArrow)"
        />
        <line
          x1="640"
          y1="320"
          x2="490"
          y2="370"
          className="stroke-muted-foreground/40"
          strokeWidth="1"
          markerEnd="url(#ccArrow)"
        />

        {/* Synthesis box */}
        <rect
          x="250"
          y="375"
          width="300"
          height="50"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500/50"
          strokeWidth="1.5"
        />
        <text
          x="400"
          y="397"
          textAnchor="middle"
          className="fill-cyan-400 text-[12px] font-semibold"
        >
          Captain: Synthesize + Write + Build
        </text>
        <text
          x="400"
          y="415"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Merge findings, resolve conflicts, write HTML
        </text>

        {/* Arrow to final output */}
        <line
          x1="400"
          y1="425"
          x2="400"
          y2="460"
          className="stroke-cyan-500/60"
          strokeWidth="1.5"
          markerEnd="url(#ccArrow)"
        />
        <text
          x="400"
          y="480"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          Wikipedia-Style Biography (index.html)
        </text>

        {/* "PARALLEL" label */}
        <text
          x="400"
          y="345"
          textAnchor="middle"
          className="fill-emerald-400/50 text-[9px] font-semibold tracking-wider"
        >
          PARALLEL EXECUTION
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** 5-Phase Execution Pipeline diagram */
export function FivePhaseExecutionDiagram({ caption }: DiagramProps) {
  const phases = [
    {
      num: "1a",
      label: "Extract",
      desc: "Captain pulls content via MCP (or skip if local files)",
      color: "amber",
    },
    {
      num: "1b",
      label: "Research",
      desc: "Parallel researcher agents analyze source clusters",
      color: "emerald",
    },
    {
      num: "2",
      label: "Synthesize",
      desc: "Merge timelines, cross-reference facts, deduplicate entities",
      color: "cyan",
    },
    {
      num: "3",
      label: "Resolve",
      desc: "Fix conflicts via hierarchy, fill gaps by asking user",
      color: "cyan",
    },
    {
      num: "4",
      label: "Write",
      desc: "Wikipedia-style prose with citations and neutral tone",
      color: "cyan",
    },
    {
      num: "5",
      label: "Build",
      desc: "HTML builder agent creates self-contained page + CSS",
      color: "cyan",
    },
  ];

  const rowH = 56;
  const startY = 60;
  const svgH = startY + phases.length * rowH + 30;

  return (
    <DiagramWrapper
      caption={
        caption ??
        "The 5-phase execution pipeline: from raw documents to a finished biography page"
      }
    >
      <svg
        viewBox={`0 0 760 ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="fpArrow"
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
          x="380"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          5-Phase Execution Pipeline
        </text>
        <text
          x="380"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          From source documents to published biography
        </text>

        {phases.map((phase, i) => {
          const y = startY + i * rowH;
          const fillClass =
            phase.color === "amber"
              ? "fill-amber-500/10 stroke-amber-500/50"
              : phase.color === "emerald"
                ? "fill-emerald-500/10 stroke-emerald-500/50"
                : "fill-cyan-500/10 stroke-cyan-500/50";
          const textClass =
            phase.color === "amber"
              ? "fill-amber-400"
              : phase.color === "emerald"
                ? "fill-emerald-400"
                : "fill-cyan-400";

          return (
            <g key={phase.num}>
              {/* Phase box */}
              <rect
                x="100"
                y={y}
                width="560"
                height="42"
                rx="8"
                className={fillClass}
                strokeWidth="1.5"
              />
              {/* Phase number */}
              <text
                x="130"
                y={y + 27}
                className={`${textClass} text-[12px] font-bold`}
              >
                {phase.num}
              </text>
              {/* Phase label */}
              <text
                x="175"
                y={y + 27}
                className={`${textClass} text-[12px] font-semibold`}
              >
                {phase.label}
              </text>
              {/* Phase description */}
              <text
                x="280"
                y={y + 27}
                className="fill-muted-foreground text-[10px]"
              >
                {phase.desc}
              </text>
              {/* Arrow to next phase */}
              {i < phases.length - 1 && (
                <line
                  x1="380"
                  y1={y + 42}
                  x2="380"
                  y2={y + rowH}
                  className="stroke-muted-foreground/40"
                  strokeWidth="1"
                  markerEnd="url(#fpArrow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramWrapper>
  );
}

/** PII Protection layers diagram */
export function PIIProtectionLayersDiagram({ caption }: DiagramProps) {
  const layers = [
    {
      label: "Git-ignored raw data",
      desc: "Source files never committed",
      icon: "1",
    },
    {
      label: "Researcher PII stripping",
      desc: "Agents instructed to remove all PII",
      icon: "2",
    },
    {
      label: "Captain verification",
      desc: "Cross-check before writing prose",
      icon: "3",
    },
    {
      label: "Privacy exclusions",
      desc: "User-defined topics to omit",
      icon: "4",
    },
    {
      label: "Human review",
      desc: "Subject approves final content",
      icon: "5",
    },
  ];

  const rowH = 52;
  const startY = 60;
  const svgH = startY + layers.length * rowH + 30;

  return (
    <DiagramWrapper
      caption={
        caption ??
        "Five layers of PII protection: from git-ignored source files to final human review"
      }
    >
      <svg
        viewBox={`0 0 700 ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="350"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          PII Protection: Five Layers Deep
        </text>
        <text
          x="350"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Each layer catches what the previous one missed
        </text>

        {layers.map((layer, i) => {
          const y = startY + i * rowH;
          // Gradient from red (outermost) to emerald (innermost)
          const colors = [
            "fill-red-500/10 stroke-red-500/40",
            "fill-amber-500/10 stroke-amber-500/40",
            "fill-amber-500/10 stroke-amber-500/40",
            "fill-emerald-500/10 stroke-emerald-500/40",
            "fill-emerald-500/10 stroke-emerald-500/40",
          ];
          const textColors = [
            "fill-red-400",
            "fill-amber-400",
            "fill-amber-400",
            "fill-emerald-400",
            "fill-emerald-400",
          ];

          return (
            <g key={layer.icon}>
              <rect
                x={80 + i * 15}
                y={y}
                width={540 - i * 30}
                height="40"
                rx="8"
                className={colors[i]}
                strokeWidth="1.5"
              />
              <text
                x={110 + i * 15}
                y={y + 26}
                className={`${textColors[i]} text-[12px] font-bold`}
              >
                {layer.icon}
              </text>
              <text
                x={140 + i * 15}
                y={y + 20}
                className={`${textColors[i]} text-[11px] font-semibold`}
              >
                {layer.label}
              </text>
              <text
                x={140 + i * 15}
                y={y + 34}
                className="fill-muted-foreground text-[9px]"
              >
                {layer.desc}
              </text>
            </g>
          );
        })}
      </svg>
    </DiagramWrapper>
  );
}
