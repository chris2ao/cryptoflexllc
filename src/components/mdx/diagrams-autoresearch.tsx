/** Autoresearch evaluation blog post diagrams -- SVG-based, themed to site colors */

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

/** Fitness Rubric: 7 criteria as scored horizontal bars with pass/fail threshold */
export function AutoresearchFitnessRubricDiagram({ caption }: DiagramProps) {
  const criteria = [
    { label: "Metric Clarity", desc: "Single scalar number?", icon: "M" },
    { label: "Eval Speed", desc: "Under 5 min per run?", icon: "S" },
    { label: "Parameter Density", desc: "20+ tunable knobs?", icon: "P" },
    { label: "Search Surface", desc: "1-2 files, no ripple?", icon: "F" },
    { label: "Reproducibility", desc: "Low variance (<1%)?", icon: "R" },
    { label: "Transferability", desc: "Small tests generalize?", icon: "T" },
    { label: "Autonomy", desc: "No human in loop?", icon: "A" },
  ];

  const rowH = 52;
  const startY = 70;
  const barX = 260;
  const barMaxW = 380;
  const svgH = startY + criteria.length * rowH + 80;

  return (
    <DiagramWrapper
      caption={
        caption ??
        "The 7-criteria fitness rubric: each criterion scored 1-10, minimum viable total 45/70"
      }
    >
      <svg
        viewBox={`0 0 720 ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="360"
          y="30"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Autoresearch Fitness Rubric
        </text>
        <text
          x="360"
          y="48"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Score each criterion 1-10. Total 45+ to proceed. Any red flag = automatic disqualifier.
        </text>

        {/* Threshold line at 45/70 (64.3%) */}
        <line
          x1={barX + barMaxW * 0.643}
          y1={startY - 5}
          x2={barX + barMaxW * 0.643}
          y2={startY + criteria.length * rowH + 5}
          className="stroke-amber-500/60"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x={barX + barMaxW * 0.643}
          y={startY - 10}
          textAnchor="middle"
          className="fill-amber-500 text-[9px] font-medium"
        >
          45/70 threshold
        </text>

        {criteria.map((c, i) => {
          const y = startY + i * rowH;
          return (
            <g key={c.label}>
              {/* Circle badge */}
              <circle
                cx="30"
                cy={y + 18}
                r="14"
                className="fill-cyan-500/15 stroke-cyan-500"
                strokeWidth="1"
              />
              <text
                x="30"
                y={y + 22}
                textAnchor="middle"
                className="fill-cyan-400 text-[10px] font-bold"
              >
                {c.icon}
              </text>

              {/* Label */}
              <text
                x="55"
                y={y + 14}
                className="fill-foreground text-[11px] font-medium"
              >
                {c.label}
              </text>
              <text
                x="55"
                y={y + 28}
                className="fill-muted-foreground text-[9px]"
              >
                {c.desc}
              </text>

              {/* Score bar background */}
              <rect
                x={barX}
                y={y + 6}
                width={barMaxW}
                height="22"
                rx="4"
                className="fill-zinc-800/50"
              />

              {/* Score scale markers */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <line
                  key={n}
                  x1={barX + (n / 10) * barMaxW}
                  y1={y + 6}
                  x2={barX + (n / 10) * barMaxW}
                  y2={y + 28}
                  className="stroke-zinc-700/50"
                  strokeWidth="0.5"
                />
              ))}

              {/* Score labels at bottom of last row */}
              {i === criteria.length - 1 &&
                [2, 4, 6, 8, 10].map((n) => (
                  <text
                    key={n}
                    x={barX + (n / 10) * barMaxW}
                    y={y + 44}
                    textAnchor="middle"
                    className="fill-muted-foreground/60 text-[8px]"
                  >
                    {n}
                  </text>
                ))}

              {/* Horizontal separator */}
              {i < criteria.length - 1 && (
                <line
                  x1="20"
                  y1={y + rowH - 2}
                  x2="690"
                  y2={y + rowH - 2}
                  className="stroke-zinc-700/30"
                  strokeWidth="0.5"
                />
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(20, ${startY + criteria.length * rowH + 30})`}>
          <rect
            x="0"
            y="0"
            width="690"
            height="36"
            rx="8"
            className="fill-zinc-800/30"
          />
          <circle cx="30" cy="18" r="6" className="fill-emerald-500/40" />
          <text x="44" y="22" className="fill-muted-foreground text-[9px]">
            55-70: Strong Go
          </text>
          <circle cx="170" cy="18" r="6" className="fill-amber-500/40" />
          <text x="184" y="22" className="fill-muted-foreground text-[9px]">
            45-54: Conditional
          </text>
          <circle cx="310" cy="18" r="6" className="fill-orange-500/40" />
          <text x="324" y="22" className="fill-muted-foreground text-[9px]">
            35-44: Yellow Flag
          </text>
          <circle cx="450" cy="18" r="6" className="fill-red-500/40" />
          <text x="464" y="22" className="fill-muted-foreground text-[9px]">
            Below 35: Red Flag
          </text>
        </g>
      </svg>
    </DiagramWrapper>
  );
}

/** Side-by-side: Autoresearch Loop vs Homunculus Pipeline, shared meta-pattern */
export function AutoresearchVsHomunculusDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The same meta-pattern at different speeds: observe, propose, evaluate, promote"
      }
    >
      <svg
        viewBox="0 0 820 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="avhArrow"
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
          x="410"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Same Pattern, Different Speeds
        </text>

        {/* Left column: Autoresearch */}
        <rect
          x="20"
          y="50"
          width="370"
          height="310"
          rx="12"
          className="fill-cyan-500/5 stroke-cyan-500/30"
          strokeWidth="1.5"
        />
        <text
          x="205"
          y="75"
          textAnchor="middle"
          className="fill-cyan-500 text-[13px] font-semibold"
        >
          Autoresearch
        </text>
        <text
          x="205"
          y="92"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Minutes per cycle. 50-100 iterations/day.
        </text>

        {/* Left: Observe */}
        <rect x="50" y="110" width="310" height="42" rx="8" className="fill-cyan-500/10 stroke-cyan-500/50" strokeWidth="1" />
        <text x="70" y="128" className="fill-cyan-500 text-[11px] font-semibold">Observe</text>
        <text x="70" y="143" className="fill-muted-foreground text-[9px]">Run system, collect metrics</text>
        <line x1="205" y1="152" x2="205" y2="170" className="stroke-muted-foreground/40" strokeWidth="1" markerEnd="url(#avhArrow)" />

        {/* Left: Propose */}
        <rect x="50" y="170" width="310" height="42" rx="8" className="fill-violet-500/10 stroke-violet-500/50" strokeWidth="1" />
        <text x="70" y="188" className="fill-violet-500 text-[11px] font-semibold">Propose</text>
        <text x="70" y="203" className="fill-muted-foreground text-[9px]">LLM suggests parameter changes</text>
        <line x1="205" y1="212" x2="205" y2="230" className="stroke-muted-foreground/40" strokeWidth="1" markerEnd="url(#avhArrow)" />

        {/* Left: Evaluate */}
        <rect x="50" y="230" width="310" height="42" rx="8" className="fill-amber-500/10 stroke-amber-500/50" strokeWidth="1" />
        <text x="70" y="248" className="fill-amber-500 text-[11px] font-semibold">Evaluate</text>
        <text x="70" y="263" className="fill-muted-foreground text-[9px]">Automated scalar metric (fitness fn)</text>
        <line x1="205" y1="272" x2="205" y2="290" className="stroke-muted-foreground/40" strokeWidth="1" markerEnd="url(#avhArrow)" />

        {/* Left: Promote */}
        <rect x="50" y="290" width="310" height="42" rx="8" className="fill-emerald-500/10 stroke-emerald-500/50" strokeWidth="1" />
        <text x="70" y="308" className="fill-emerald-500 text-[11px] font-semibold">Promote</text>
        <text x="70" y="323" className="fill-muted-foreground text-[9px]">Keep if score improves</text>

        {/* Right column: Homunculus */}
        <rect
          x="430"
          y="50"
          width="370"
          height="310"
          rx="12"
          className="fill-emerald-500/5 stroke-emerald-500/30"
          strokeWidth="1.5"
        />
        <text
          x="615"
          y="75"
          textAnchor="middle"
          className="fill-emerald-500 text-[13px] font-semibold"
        >
          Homunculus Pipeline
        </text>
        <text
          x="615"
          y="92"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Days per cycle. Weekly ingestion cadence.
        </text>

        {/* Right: Observe */}
        <rect x="460" y="110" width="310" height="42" rx="8" className="fill-cyan-500/10 stroke-cyan-500/50" strokeWidth="1" />
        <text x="480" y="128" className="fill-cyan-500 text-[11px] font-semibold">Observe</text>
        <text x="480" y="143" className="fill-muted-foreground text-[9px]">PostToolUse hooks capture behavior</text>
        <line x1="615" y1="152" x2="615" y2="170" className="stroke-muted-foreground/40" strokeWidth="1" markerEnd="url(#avhArrow)" />

        {/* Right: Propose */}
        <rect x="460" y="170" width="310" height="42" rx="8" className="fill-violet-500/10 stroke-violet-500/50" strokeWidth="1" />
        <text x="480" y="188" className="fill-violet-500 text-[11px] font-semibold">Propose</text>
        <text x="480" y="203" className="fill-muted-foreground text-[9px]">Observer extracts instincts from data</text>
        <line x1="615" y1="212" x2="615" y2="230" className="stroke-muted-foreground/40" strokeWidth="1" markerEnd="url(#avhArrow)" />

        {/* Right: Evaluate */}
        <rect x="460" y="230" width="310" height="42" rx="8" className="fill-amber-500/10 stroke-amber-500/50" strokeWidth="1" />
        <text x="480" y="248" className="fill-amber-500 text-[11px] font-semibold">Evaluate</text>
        <text x="480" y="263" className="fill-muted-foreground text-[9px]">Human reviews and approves each one</text>
        <line x1="615" y1="272" x2="615" y2="290" className="stroke-muted-foreground/40" strokeWidth="1" markerEnd="url(#avhArrow)" />

        {/* Right: Promote */}
        <rect x="460" y="290" width="310" height="42" rx="8" className="fill-emerald-500/10 stroke-emerald-500/50" strokeWidth="1" />
        <text x="480" y="308" className="fill-emerald-500 text-[11px] font-semibold">Promote</text>
        <text x="480" y="323" className="fill-muted-foreground text-[9px]">Copy accepted to active directories</text>

        {/* Connecting bracket: shared pattern label */}
        <line
          x1="405"
          y1="130"
          x2="405"
          y2="330"
          className="stroke-muted-foreground/30"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <rect
          x="385"
          y="370"
          width="50"
          height="24"
          rx="6"
          className="fill-zinc-800/50"
        />
        <text
          x="410"
          y="386"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[8px] font-medium"
        >
          SAME
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** The Unexpected Discovery: evaluation process branching to real improvements */
export function UnexpectedDiscoveryDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The evaluation detour: tool didn't fit, but the research surfaced real improvements"
      }
    >
      <svg
        viewBox="0 0 780 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="udArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker
            id="udArrowGreen"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="390"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          The Unexpected Discovery
        </text>

        {/* Step 1: Exciting tool */}
        <rect
          x="30"
          y="55"
          width="180"
          height="50"
          rx="10"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="120"
          y="77"
          textAnchor="middle"
          className="fill-cyan-400 text-[11px] font-medium"
        >
          Discover autoresearch
        </text>
        <text
          x="120"
          y="93"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Karpathy's new tool
        </text>

        {/* Arrow to Step 2 */}
        <line
          x1="210"
          y1="80"
          x2="270"
          y2="80"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#udArrow)"
        />

        {/* Step 2: Rigorous evaluation */}
        <rect
          x="275"
          y="55"
          width="210"
          height="50"
          rx="10"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="380"
          y="77"
          textAnchor="middle"
          className="fill-violet-400 text-[11px] font-medium"
        >
          5-agent evaluation team
        </text>
        <text
          x="380"
          y="93"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          7 criteria, 7 candidates, scored 1-10
        </text>

        {/* Branch point */}
        <circle
          cx="380"
          cy="140"
          r="18"
          className="fill-amber-500/15 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="380"
          y="144"
          textAnchor="middle"
          className="fill-amber-500 text-[10px] font-bold"
        >
          ?
        </text>

        {/* Arrow down from evaluation to branch */}
        <line
          x1="380"
          y1="105"
          x2="380"
          y2="122"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#udArrow)"
        />

        {/* LEFT BRANCH: Expected path (doesn't fit) */}
        <line
          x1="362"
          y1="140"
          x2="160"
          y2="200"
          className="stroke-red-500/50"
          strokeWidth="1.5"
          markerEnd="url(#udArrow)"
        />
        <text
          x="240"
          y="165"
          textAnchor="middle"
          className="fill-red-500/70 text-[9px]"
        >
          Primary verdict
        </text>

        <rect
          x="40"
          y="200"
          width="230"
          height="55"
          rx="10"
          className="fill-red-500/8 stroke-red-500/50"
          strokeWidth="1.5"
        />
        <text
          x="155"
          y="222"
          textAnchor="middle"
          className="fill-red-400 text-[11px] font-medium"
        >
          "Doesn't fit my workflow"
        </text>
        <text
          x="155"
          y="240"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          6 of 7 candidates failed the rubric
        </text>

        {/* Sub-result boxes */}
        <rect
          x="40"
          y="275"
          width="230"
          height="35"
          rx="6"
          className="fill-zinc-800/30"
        />
        <text
          x="155"
          y="296"
          textAnchor="middle"
          className="fill-zinc-500 text-[9px]"
        >
          1 strong fit (GOAP, 62/70) but game is on pause
        </text>

        {/* RIGHT BRANCH: Unexpected discovery */}
        <line
          x1="398"
          y1="140"
          x2="570"
          y2="200"
          className="stroke-emerald-500/60"
          strokeWidth="2"
          markerEnd="url(#udArrowGreen)"
        />
        <text
          x="510"
          y="165"
          textAnchor="middle"
          className="fill-emerald-500/80 text-[9px] font-medium"
        >
          Unexpected discovery
        </text>

        <rect
          x="470"
          y="200"
          width="280"
          height="55"
          rx="10"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="2"
        />
        <text
          x="610"
          y="222"
          textAnchor="middle"
          className="fill-emerald-400 text-[12px] font-semibold"
        >
          Real improvements found
        </text>
        <text
          x="610"
          y="240"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Vector Memory MCP config problems
        </text>

        {/* Discovery detail boxes */}
        {[
          "QUALITY_BOOST disabled (false)",
          "Retention too short (30 days)",
          "candidateMultiplier too low (4x)",
        ].map((fix, i) => {
          const y = 275 + i * 35;
          return (
            <g key={fix}>
              <rect
                x="490"
                y={y}
                width="240"
                height="28"
                rx="6"
                className="fill-emerald-500/8 stroke-emerald-500/40"
                strokeWidth="1"
              />
              <text
                x="510"
                y={y + 18}
                className="fill-emerald-400 text-[9px] font-mono"
              >
                {fix}
              </text>
            </g>
          );
        })}

        {/* Bottom lesson */}
        <rect
          x="160"
          y="385"
          width="460"
          height="24"
          rx="8"
          className="fill-cyan-500/10"
        />
        <text
          x="390"
          y="401"
          textAnchor="middle"
          className="fill-cyan-400 text-[10px] font-medium"
        >
          The value was in the evaluation process, not the tool itself
        </text>
      </svg>
    </DiagramWrapper>
  );
}
