/** Homunculus Evolution Layer blog post diagrams -- SVG-based, themed to site colors */

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

/** Three-layer pipeline architecture: observation -> instincts -> evolution */
export function HomunculusPipelineDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The three-layer Homunculus pipeline: from raw tool observations to promoted skills"
      }
    >
      <svg
        viewBox="0 0 900 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Arrow marker */}
        <defs>
          <marker
            id="hpArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        {/* Layer 1: Observation */}
        <rect
          x="20"
          y="20"
          width="860"
          height="120"
          rx="12"
          className="fill-cyan-500/8 stroke-cyan-500/40"
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="48"
          className="fill-cyan-500 text-[13px] font-semibold"
        >
          Layer 1: Observation
        </text>

        {/* PostToolUse Hooks box */}
        <rect
          x="60"
          y="65"
          width="180"
          height="55"
          rx="8"
          className="fill-cyan-500/15 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="150"
          y="88"
          textAnchor="middle"
          className="fill-cyan-400 text-[12px] font-medium"
        >
          PostToolUse Hooks
        </text>
        <text
          x="150"
          y="106"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Every tool call captured
        </text>

        {/* Arrow */}
        <line
          x1="240"
          y1="92"
          x2="310"
          y2="92"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hpArrow)"
        />

        {/* observations.jsonl box */}
        <rect
          x="315"
          y="65"
          width="230"
          height="55"
          rx="8"
          className="fill-zinc-500/15 stroke-zinc-500"
          strokeWidth="1.5"
        />
        <text
          x="430"
          y="88"
          textAnchor="middle"
          className="fill-zinc-400 text-[12px] font-medium"
        >
          observations.jsonl
        </text>
        <text
          x="430"
          y="106"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          13,292 entries (2.7 MB)
        </text>

        {/* Arrow down to Layer 2 */}
        <line
          x1="430"
          y1="140"
          x2="430"
          y2="180"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hpArrow)"
        />
        <text
          x="445"
          y="165"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Observer agent
        </text>

        {/* Layer 2: Instincts */}
        <rect
          x="20"
          y="185"
          width="860"
          height="100"
          rx="12"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="213"
          className="fill-amber-500 text-[13px] font-semibold"
        >
          Layer 2: Instincts
        </text>

        {/* Instincts directory box */}
        <rect
          x="200"
          y="225"
          width="460"
          height="45"
          rx="8"
          className="fill-amber-500/15 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="430"
          y="248"
          textAnchor="middle"
          className="fill-amber-400 text-[12px] font-medium"
        >
          instincts/personal/ (50 markdown files, confidence 0.3-0.85)
        </text>
        <text
          x="430"
          y="263"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Each with trigger, domain, evidence, and confidence score
        </text>

        {/* Arrow down to Layer 3 */}
        <line
          x1="430"
          y1="285"
          x2="430"
          y2="325"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hpArrow)"
        />
        <text
          x="445"
          y="310"
          className="fill-muted-foreground/60 text-[9px]"
        >
          /evolve command
        </text>

        {/* Layer 3: Evolution */}
        <rect
          x="20"
          y="330"
          width="860"
          height="175"
          rx="12"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="358"
          className="fill-emerald-500 text-[13px] font-semibold"
        >
          Layer 3: Evolution (NEW)
        </text>

        {/* Synthesizer box */}
        <rect
          x="60"
          y="375"
          width="190"
          height="50"
          rx="8"
          className="fill-emerald-500/15 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="155"
          y="398"
          textAnchor="middle"
          className="fill-emerald-400 text-[12px] font-medium"
        >
          Evolve Synthesizer
        </text>
        <text
          x="155"
          y="414"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Semantic clustering (Sonnet)
        </text>

        {/* Arrow to candidates */}
        <line
          x1="250"
          y1="400"
          x2="310"
          y2="400"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hpArrow)"
        />

        {/* Candidates box */}
        <rect
          x="315"
          y="375"
          width="160"
          height="50"
          rx="8"
          className="fill-violet-500/15 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="395"
          y="398"
          textAnchor="middle"
          className="fill-violet-400 text-[12px] font-medium"
        >
          Evolved Candidates
        </text>
        <text
          x="395"
          y="414"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          13 clusters generated
        </text>

        {/* Arrow to review */}
        <line
          x1="475"
          y1="400"
          x2="530"
          y2="400"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#hpArrow)"
        />

        {/* User Review diamond-ish box */}
        <rect
          x="535"
          y="378"
          width="110"
          height="44"
          rx="8"
          className="fill-amber-500/15 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="590"
          y="404"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-medium"
        >
          User Review
        </text>

        {/* Arrow accept */}
        <line
          x1="645"
          y1="390"
          x2="700"
          y2="370"
          className="stroke-emerald-500/60"
          strokeWidth="1.5"
          markerEnd="url(#hpArrow)"
        />
        <text
          x="660"
          y="372"
          className="fill-emerald-500/80 text-[9px]"
        >
          Accept
        </text>

        {/* Arrow decline */}
        <line
          x1="645"
          y1="410"
          x2="700"
          y2="430"
          className="stroke-red-500/60"
          strokeWidth="1.5"
          markerEnd="url(#hpArrow)"
        />
        <text
          x="660"
          y="440"
          className="fill-red-500/80 text-[9px]"
        >
          Decline
        </text>

        {/* Promoted box */}
        <rect
          x="705"
          y="350"
          width="155"
          height="45"
          rx="8"
          className="fill-emerald-500/20 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="782"
          y="371"
          textAnchor="middle"
          className="fill-emerald-400 text-[11px] font-medium"
        >
          Active Skills
        </text>
        <text
          x="782"
          y="386"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          5 promoted
        </text>

        {/* Discarded box */}
        <rect
          x="705"
          y="415"
          width="155"
          height="35"
          rx="8"
          className="fill-zinc-500/10 stroke-zinc-500/40"
          strokeWidth="1.5"
        />
        <text
          x="782"
          y="437"
          textAnchor="middle"
          className="fill-zinc-500 text-[11px]"
        >
          8 declined/removed
        </text>

        {/* Compression ratio label */}
        <rect
          x="610"
          y="468"
          width="260"
          height="24"
          rx="6"
          className="fill-cyan-500/10"
        />
        <text
          x="740"
          y="484"
          textAnchor="middle"
          className="fill-cyan-400 text-[10px] font-mono"
        >
          2,658:1 compression (observations to skills)
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** Evolution data flow: /evolve command pipeline */
export function EvolutionFlowDiagram({ caption }: DiagramProps) {
  const steps = [
    {
      label: "Gather",
      desc: "List instinct files",
      detail: "full or incremental",
      color: "fill-cyan-500",
      bg: "fill-cyan-500/10",
      stroke: "stroke-cyan-500",
    },
    {
      label: "Synthesize",
      desc: "Spawn Sonnet agent",
      detail: "semantic clustering",
      color: "fill-emerald-500",
      bg: "fill-emerald-500/10",
      stroke: "stroke-emerald-500",
    },
    {
      label: "Classify",
      desc: "Skill / Command / Agent",
      detail: "per cluster heuristics",
      color: "fill-violet-500",
      bg: "fill-violet-500/10",
      stroke: "stroke-violet-500",
    },
    {
      label: "Generate",
      desc: "Write component files",
      detail: "with evolution metadata",
      color: "fill-amber-500",
      bg: "fill-amber-500/10",
      stroke: "stroke-amber-500",
    },
    {
      label: "Review",
      desc: "Present to user",
      detail: "accept or decline each",
      color: "fill-red-500",
      bg: "fill-red-500/10",
      stroke: "stroke-red-500",
    },
    {
      label: "Promote",
      desc: "Copy to active dirs",
      detail: "strip evolution metadata",
      color: "fill-emerald-500",
      bg: "fill-emerald-500/10",
      stroke: "stroke-emerald-500",
    },
  ];

  const boxW = 120;
  const boxH = 75;
  const gap = 18;
  const startX = 30;
  const y = 50;
  const svgW = startX + steps.length * (boxW + gap);

  return (
    <DiagramWrapper
      caption={
        caption ??
        "The /evolve command pipeline: from gathering instincts to promoting active components"
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
            id="efArrow"
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
          /evolve Command Pipeline
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
                  markerEnd="url(#efArrow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramWrapper>
  );
}
