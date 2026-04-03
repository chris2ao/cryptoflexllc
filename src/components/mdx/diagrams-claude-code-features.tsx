/** Claude Code features blog post diagrams -- SVG-based, themed to site colors */

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

/** Shows the configuration stack as a vertical layer diagram */
export function ConfigStackDiagram({ caption }: DiagramProps) {
  const layers = [
    {
      label: "Agents + Subagents",
      desc: "Parallel workers with specialized roles",
      color: "fill-red-500",
      bg: "fill-red-500/8",
      stroke: "stroke-red-500",
      badge: "fill-red-500/15",
      badgeText: "fill-red-500",
    },
    {
      label: "MCP Servers + Plugins",
      desc: "External tools, APIs, databases",
      color: "fill-violet-500",
      bg: "fill-violet-500/8",
      stroke: "stroke-violet-500",
      badge: "fill-violet-500/15",
      badgeText: "fill-violet-500",
    },
    {
      label: "Skills + Hooks",
      desc: "Automation and reusable workflows",
      color: "fill-amber-500",
      bg: "fill-amber-500/8",
      stroke: "stroke-amber-500",
      badge: "fill-amber-500/15",
      badgeText: "fill-amber-500",
    },
    {
      label: "Rules + Permissions",
      desc: "Behavioral guardrails and access control",
      color: "fill-emerald-500",
      bg: "fill-emerald-500/8",
      stroke: "stroke-emerald-500",
      badge: "fill-emerald-500/15",
      badgeText: "fill-emerald-500",
    },
    {
      label: "CLAUDE.md + .claude/ Directory",
      desc: "Project facts, file organization",
      color: "fill-cyan-500",
      bg: "fill-cyan-500/8",
      stroke: "stroke-cyan-500",
      badge: "fill-cyan-500/15",
      badgeText: "fill-cyan-500",
    },
  ];

  const layerH = 50;
  const gap = 14;
  const startY = 40;
  const totalH = startY + layers.length * (layerH + gap) + 40;

  return (
    <DiagramWrapper
      caption={caption ?? "Each layer builds on the ones below. Start at the bottom and add as needed."}
    >
      <svg
        viewBox={`0 0 700 ${totalH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        <text x="350" y="24" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          The Configuration Stack
        </text>

        {layers.map((layer, i) => {
          const y = startY + i * (layerH + gap);
          return (
            <g key={layer.label}>
              {/* Background fill */}
              <rect x="60" y={y} width="440" height={layerH} rx="8" className={layer.bg} />
              {/* Border */}
              <rect x="60" y={y} width="440" height={layerH} rx="8" className={layer.stroke} strokeWidth="1.5" fill="none" />
              {/* Label */}
              <text x="280" y={y + 22} textAnchor="middle" className={`${layer.color} text-[12px] font-semibold`}>
                {layer.label}
              </text>
              {/* Description */}
              <text x="280" y={y + 38} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                {layer.desc}
              </text>
              {/* Connector to next layer */}
              {i < layers.length - 1 && (
                <line
                  x1="280" y1={y + layerH}
                  x2="280" y2={y + layerH + gap}
                  className="stroke-foreground/20"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}
              {/* Side description badge */}
              <rect x="520" y={y + 12} width="140" height={layerH - 24} rx="4" className={layer.badge} />
              <text x="590" y={y + layerH / 2 + 4} textAnchor="middle" className={`${layer.badgeText} text-[9px] font-medium`}>
                {i === 0 ? "ADVANCED" : i === 1 ? "INTEGRATION" : i === 2 ? "WORKFLOW" : i === 3 ? "SAFETY" : "FOUNDATION"}
              </text>
            </g>
          );
        })}

        {/* Start here arrow */}
        <text x="280" y={totalH - 10} textAnchor="middle" className="fill-emerald-500 text-[11px] font-medium">
          Start here. Add layers as you need them.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows permission levels from most restrictive to most permissive */
export function PermissionLevelsDiagram({ caption }: DiagramProps) {
  const levels = [
    {
      label: "Read Only",
      desc: "Glob, Grep, Read only. No changes allowed.",
      color: "fill-emerald-500",
      bg: "fill-emerald-500/8",
      stroke: "stroke-emerald-500",
      recommended: false,
    },
    {
      label: "Approve Each Action",
      desc: "Default mode. Claude asks before every edit or command.",
      color: "fill-cyan-500",
      bg: "fill-cyan-500/8",
      stroke: "stroke-cyan-500",
      recommended: true,
    },
    {
      label: "Allow List",
      desc: "Specific tools auto-approved. Everything else still asks.",
      color: "fill-amber-500",
      bg: "fill-amber-500/8",
      stroke: "stroke-amber-500",
      recommended: false,
    },
    {
      label: "Accept Edits",
      desc: "All file edits auto-approved. Commands still need approval.",
      color: "fill-violet-500",
      bg: "fill-violet-500/8",
      stroke: "stroke-violet-500",
      recommended: false,
    },
    {
      label: "Full Auto",
      desc: "Everything auto-approved. Use only with trusted plans.",
      color: "fill-red-500",
      bg: "fill-red-500/8",
      stroke: "stroke-red-500",
      recommended: false,
    },
  ];

  const levelH = 54;
  const gap = 10;
  const startY = 44;
  const totalH = startY + levels.length * (levelH + gap) + 30;

  return (
    <DiagramWrapper
      caption={caption ?? "Permission levels from most restrictive (top) to most permissive (bottom)."}
    >
      <svg
        viewBox={`0 0 660 ${totalH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        <text x="330" y="22" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Permission Levels
        </text>
        <text x="330" y="38" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Most restrictive (top) to most permissive (bottom)
        </text>

        {/* Trust arrow on the left */}
        <line x1="30" y1={startY + 10} x2="30" y2={startY + levels.length * (levelH + gap) - gap - 10} className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#trustArrow)" />
        <text x="30" y={startY + levels.length * (levelH + gap) / 2 - 8} textAnchor="middle" className="fill-red-500/70 text-[9px]" transform={`rotate(-90, 30, ${startY + levels.length * (levelH + gap) / 2})`}>
          More trust needed
        </text>

        {levels.map((level, i) => {
          const y = startY + i * (levelH + gap);
          return (
            <g key={level.label}>
              <rect x="55" y={y} width="310" height={levelH} rx="8" className={level.bg} />
              <rect x="55" y={y} width="310" height={levelH} rx="8" className={level.stroke} strokeWidth={level.recommended ? 2 : 1.5} fill="none" />
              <text x="210" y={y + 22} textAnchor="middle" className={`${level.color} text-[12px] font-semibold`}>
                {level.label}
              </text>
              <text x="210" y={y + 38} textAnchor="middle" className="fill-muted-foreground text-[9px]">
                {level.desc}
              </text>
              {/* Recommended badge */}
              {level.recommended && (
                <>
                  <rect x="380" y={y + 14} width="80" height="22" rx="4" className="fill-cyan-500/15" />
                  <text x="420" y={y + 29} textAnchor="middle" className="fill-cyan-500 text-[9px] font-semibold">
                    DEFAULT
                  </text>
                </>
              )}
              {/* Description on the right */}
              {!level.recommended && (
                <text x="390" y={y + levelH / 2 + 4} className="fill-muted-foreground text-[9px]">
                  {i === 0 ? "Safest option" : i === 2 ? "Best balance for most users" : i === 3 ? "Good for trusted projects" : "Use with caution"}
                </text>
              )}
              {/* Connector */}
              {i < levels.length - 1 && (
                <line
                  x1="210" y1={y + levelH}
                  x2="210" y2={y + levelH + gap}
                  className="stroke-foreground/20"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}
            </g>
          );
        })}

        <defs>
          <marker id="trustArrow" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-red-500/60" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows serial vs parallel execution side by side */
export function SerialVsParallelDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={caption ?? "The same work in 12 minutes (serial) vs 5 minutes (parallel subagents). 2.4x faster."}
    >
      <svg
        viewBox="0 0 760 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Serial side */}
        <rect x="10" y="10" width="230" height="400" rx="10" className="fill-red-500/5 stroke-red-500/30" strokeWidth="1" />
        <text x="125" y="36" textAnchor="middle" className="fill-red-500 text-[13px] font-semibold">Serial (default)</text>

        {/* Serial flow */}
        <rect x="50" y="50" width="150" height="36" rx="6" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="125" y="73" textAnchor="middle" className="fill-cyan-500 text-[11px] font-medium">Your Request</text>

        <line x1="125" y1="86" x2="125" y2="100" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />

        {[
          { label: "Research", time: "3 min", y: 100 },
          { label: "Analyze", time: "2 min", y: 152 },
          { label: "Write Code", time: "4 min", y: 204 },
          { label: "Review", time: "2 min", y: 256 },
          { label: "Update Docs", time: "1 min", y: 308 },
        ].map((step, i) => (
          <g key={step.label}>
            <rect x="50" y={step.y} width="150" height="40" rx="6" className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
            <text x="125" y={step.y + 18} textAnchor="middle" className="fill-amber-500 text-[10px] font-semibold">{step.label}</text>
            <text x="125" y={step.y + 32} textAnchor="middle" className="fill-muted-foreground text-[9px]">{step.time}</text>
            {i < 4 && (
              <line x1="125" y1={step.y + 40} x2="125" y2={step.y + 52} className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
            )}
          </g>
        ))}

        <rect x="60" y="360" width="130" height="32" rx="6" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="125" y="381" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">Done</text>
        <line x1="125" y1="348" x2="125" y2="360" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
        <text x="125" y="410" textAnchor="middle" className="fill-red-500 text-[11px] font-medium">Total: 12 minutes</text>

        {/* Parallel side */}
        <rect x="270" y="10" width="480" height="400" rx="10" className="fill-emerald-500/5 stroke-emerald-500/30" strokeWidth="1" />
        <text x="510" y="36" textAnchor="middle" className="fill-emerald-500 text-[13px] font-semibold">Parallel (with subagents)</text>

        {/* Request */}
        <rect x="435" y="50" width="150" height="36" rx="6" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="510" y="73" textAnchor="middle" className="fill-cyan-500 text-[11px] font-medium">Your Request</text>

        {/* Fan out arrows */}
        <line x1="475" y1="86" x2="345" y2="108" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
        <line x1="510" y1="86" x2="510" y2="108" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
        <line x1="545" y1="86" x2="665" y2="108" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />

        {/* Parallel agents */}
        {[
          { label: "Research Agent", time: "3 min", x: 290 },
          { label: "Analyze Agent", time: "2 min", x: 450 },
          { label: "Docs Agent", time: "1 min", x: 610 },
        ].map((agent) => (
          <g key={agent.label}>
            <rect x={agent.x} y="108" width="140" height="50" rx="6" className="fill-violet-500/10 stroke-violet-500" strokeWidth="1.5" />
            <text x={agent.x + 70} y="130" textAnchor="middle" className="fill-violet-500 text-[10px] font-semibold">{agent.label}</text>
            <text x={agent.x + 70} y="146" textAnchor="middle" className="fill-muted-foreground text-[9px]">{agent.time}</text>
          </g>
        ))}

        {/* Parallel label */}
        <rect x="390" y="168" width="240" height="18" rx="4" className="fill-emerald-500/10" />
        <text x="510" y="181" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">All three run simultaneously</text>

        {/* Merge arrows to Write Code */}
        <line x1="360" y1="158" x2="475" y2="196" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
        <line x1="520" y1="158" x2="510" y2="196" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
        <line x1="680" y1="158" x2="555" y2="196" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />

        {/* Write Code */}
        <rect x="435" y="196" width="150" height="40" rx="6" className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
        <text x="510" y="214" textAnchor="middle" className="fill-amber-500 text-[10px] font-semibold">Write Code</text>
        <text x="510" y="228" textAnchor="middle" className="fill-muted-foreground text-[9px]">4 min</text>

        {/* Fan out to reviewers */}
        <line x1="480" y1="236" x2="400" y2="260" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
        <line x1="540" y1="236" x2="620" y2="260" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />

        {/* Review agents */}
        <rect x="320" y="260" width="150" height="44" rx="6" className="fill-violet-500/10 stroke-violet-500" strokeWidth="1.5" />
        <text x="395" y="280" textAnchor="middle" className="fill-violet-500 text-[10px] font-semibold">Code Review Agent</text>
        <text x="395" y="294" textAnchor="middle" className="fill-muted-foreground text-[9px]">read-only analysis</text>

        <rect x="550" y="260" width="150" height="44" rx="6" className="fill-violet-500/10 stroke-violet-500" strokeWidth="1.5" />
        <text x="625" y="280" textAnchor="middle" className="fill-violet-500 text-[10px] font-semibold">Security Agent</text>
        <text x="625" y="294" textAnchor="middle" className="fill-muted-foreground text-[9px]">vulnerability scan</text>

        {/* Merge to done */}
        <line x1="395" y1="304" x2="480" y2="330" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />
        <line x1="625" y1="304" x2="540" y2="330" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#serialArrow)" />

        <rect x="445" y="330" width="130" height="32" rx="6" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="510" y="351" textAnchor="middle" className="fill-emerald-500 text-[11px] font-semibold">Done</text>
        <text x="510" y="385" textAnchor="middle" className="fill-emerald-500 text-[11px] font-medium">Total: 5 minutes</text>

        {/* Bottom summary */}
        <text x="380" y="430" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
          2.4x faster with the same work done
        </text>

        <defs>
          <marker id="serialArrow" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/30" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}
