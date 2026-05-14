/** Custom SIEM rollout Part 2 diagram -- SVG-based, themed to site colors */

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
 * 14-phase horizontal rollout timeline with color-coded stage groupings and a
 * commit-count stat box. Phases 4.5 and 5.5 appear as half-step ticks between
 * their neighbors.
 */
export function SiemRolloutTimelineDiagram({ caption }: DiagramProps) {
  // Phase definitions: id, label, tick x position (0-based scaled across axis)
  // Axis runs x=40 to x=780 (740px wide), 16 stops (0,1,2,3,4,4.5,5,5.5,6..13)
  const axisX0 = 40;
  const axisX1 = 780;
  const axisWidth = axisX1 - axisX0;
  const axisY = 100;

  // 16 tick positions: 0,1,2,3,4,4.5,5,5.5,6,7,8,9,10,11,12,13
  const ticks: { id: string; label: string; sublabel: string }[] = [
    { id: "0", label: "Phase 0", sublabel: "Prerequisites" },
    { id: "1", label: "Phase 1", sublabel: "Stack scaffold" },
    { id: "2", label: "Phase 2", sublabel: "Schema migrations" },
    { id: "3", label: "Phase 3", sublabel: "Vector pipeline" },
    { id: "4", label: "Phase 4", sublabel: "Backend CH module" },
    { id: "4.5", label: "Phase 4.5", sublabel: "Smoke gate" },
    { id: "5", label: "Phase 5", sublabel: "Endpoint rewrite" },
    { id: "5.5", label: "Phase 5.5", sublabel: "Cutover gate" },
    { id: "6", label: "Phase 6", sublabel: "Detection retarget" },
    { id: "7", label: "Phase 7", sublabel: "Findings table" },
    { id: "8", label: "Phase 8", sublabel: "Notifications" },
    { id: "9", label: "Phase 9", sublabel: "Health chips" },
    { id: "10", label: "Phase 10", sublabel: "SQLite cleanup" },
    { id: "11", label: "Phase 11", sublabel: "Signal CH refactor" },
    { id: "12", label: "Phase 12", sublabel: "E2E soak" },
    { id: "13", label: "Phase 13", sublabel: "Documentation" },
  ];

  // Map tick id to fraction along axis [0,1]
  const idToFraction: Record<string, number> = {
    "0": 0 / 15,
    "1": 1 / 15,
    "2": 2 / 15,
    "3": 3 / 15,
    "4": 4 / 15,
    "4.5": 4.5 / 15,
    "5": 5 / 15,
    "5.5": 5.5 / 15,
    "6": 6 / 15,
    "7": 7 / 15,
    "8": 8 / 15,
    "9": 9 / 15,
    "10": 10 / 15,
    "11": 11 / 15,
    "12": 12 / 15,
    "13": 13 / 15,
  };

  const tickX = (id: string) =>
    axisX0 + idToFraction[id] * axisWidth;

  // Stage groupings for pill cards below the axis
  const stages = [
    {
      label: "Setup",
      phases: ["0", "1", "2"],
      colorStroke: "stroke-cyan-500",
      colorFill: "fill-cyan-500/10",
      colorText: "fill-cyan-300",
      y: 145,
    },
    {
      label: "Wire-up",
      phases: ["3", "4", "4.5"],
      colorStroke: "stroke-emerald-500",
      colorFill: "fill-emerald-500/10",
      colorText: "fill-emerald-300",
      y: 200,
    },
    {
      label: "Cutover",
      phases: ["5", "5.5", "6", "7"],
      colorStroke: "stroke-amber-500",
      colorFill: "fill-amber-500/10",
      colorText: "fill-amber-300",
      y: 255,
    },
    {
      label: "Operationalize",
      phases: ["8", "9"],
      colorStroke: "stroke-fuchsia-500",
      colorFill: "fill-fuchsia-500/10",
      colorText: "fill-fuchsia-300",
      y: 310,
    },
    {
      label: "Cleanup + soak",
      phases: ["10", "11", "12", "13"],
      colorStroke: "stroke-rose-500",
      colorFill: "fill-rose-500/10",
      colorText: "fill-rose-300",
      y: 365,
    },
  ];

  // Sub-descriptions per stage pill
  const stageDesc: Record<string, string> = {
    Setup: "Prerequisites, stack scaffolding, schema migrations",
    "Wire-up": "Vector pipeline, backend CH module, operator smoke gate",
    Cutover: "Endpoint rewrite, cutover gate, detection retarget, findings table",
    Operationalize: "Notification dispatcher, health chips, doctor.sh",
    "Cleanup + soak": "SQLite cleanup, signal CH refactor, end-to-end soak, documentation",
  };

  return (
    <DiagramWrapper
      caption={
        caption ??
        "14-phase SIEM rollout: 137 commits across 221 files, from prerequisites through documentation soak. Phases are grouped into five stages: Setup (cyan), Wire-up (emerald), Cutover (amber), Operationalize (fuchsia), and Cleanup plus soak (rose)."
      }
    >
      <svg
        viewBox="0 0 980 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="490"
          y="24"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          14 Phases, 137 Commits, One PR -- SIEM Rollout
        </text>

        {/* Axis line */}
        <line
          x1={axisX0}
          y1={axisY}
          x2={axisX1}
          y2={axisY}
          className="stroke-muted-foreground/50"
          strokeWidth="2"
        />

        {/* Tick marks + labels */}
        {ticks.map((tick) => {
          const x = tickX(tick.id);
          const isHalf = tick.id.includes(".");
          return (
            <g key={tick.id}>
              <line
                x1={x}
                y1={axisY - (isHalf ? 5 : 8)}
                x2={x}
                y2={axisY + (isHalf ? 5 : 8)}
                className={isHalf ? "stroke-muted-foreground/40" : "stroke-muted-foreground/70"}
                strokeWidth={isHalf ? 1 : 1.5}
              />
              {/* Phase label above axis */}
              <text
                x={x}
                y={axisY - 20}
                textAnchor="middle"
                className={
                  isHalf
                    ? "fill-muted-foreground/50 text-[7px]"
                    : "fill-muted-foreground/80 text-[8px] font-semibold"
                }
                transform={`rotate(-40, ${x}, ${axisY - 20})`}
              >
                {tick.label}
              </text>
              {/* Sub-label below axis */}
              <text
                x={x}
                y={axisY + 20}
                textAnchor="middle"
                className="fill-muted-foreground/60 text-[7px]"
                transform={`rotate(35, ${x}, ${axisY + 20})`}
              >
                {tick.sublabel}
              </text>
            </g>
          );
        })}

        {/* Stage pill bands */}
        {stages.map((stage) => {
          const x0 = tickX(stage.phases[0]);
          const x1 = tickX(stage.phases[stage.phases.length - 1]);
          const w = x1 - x0 + 20;
          const rx0 = x0 - 10;
          return (
            <g key={stage.label}>
              <rect
                x={rx0}
                y={stage.y}
                width={w}
                height={48}
                rx="8"
                className={`${stage.colorFill} ${stage.colorStroke}`}
                strokeWidth="1.2"
              />
              <text
                x={rx0 + 10}
                y={stage.y + 18}
                className={`${stage.colorText} text-[10px] font-semibold`}
              >
                {stage.label}
              </text>
              <text
                x={rx0 + 10}
                y={stage.y + 34}
                className="fill-muted-foreground/70 text-[8px]"
              >
                {stageDesc[stage.label]}
              </text>

              {/* Connector line from pill to axis */}
              <line
                x1={(x0 + x1) / 2 + 10}
                y1={stage.y}
                x2={(x0 + x1) / 2 + 10}
                y2={axisY + 8}
                className="stroke-muted-foreground/20"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          );
        })}

        {/* Stat box */}
        <rect
          x="800"
          y="140"
          width="162"
          height="148"
          rx="8"
          className="fill-muted/20 stroke-muted-foreground/40"
          strokeWidth="1"
        />
        <text
          x="881"
          y="160"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          PR Stats
        </text>
        {[
          "137 commits",
          "221 files changed",
          "+31,587 / -7,747 lines",
          "984 tests passing",
          "68 persona-rule catches",
        ].map((line, i) => (
          <text
            key={line}
            x="881"
            y={180 + i * 20}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {line}
          </text>
        ))}

        {/* Legend */}
        {[
          { label: "Setup", cls: "fill-cyan-500/60" },
          { label: "Wire-up", cls: "fill-emerald-500/60" },
          { label: "Cutover", cls: "fill-amber-500/60" },
          { label: "Operationalize", cls: "fill-fuchsia-500/60" },
          { label: "Cleanup + soak", cls: "fill-rose-500/60" },
        ].map(({ label, cls }, i) => (
          <g key={label}>
            <rect
              x="800"
              y={310 + i * 22}
              width="12"
              height="12"
              rx="3"
              className={cls}
            />
            <text
              x="820"
              y={310 + i * 22 + 10}
              className="fill-muted-foreground text-[9px]"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </DiagramWrapper>
  );
}
