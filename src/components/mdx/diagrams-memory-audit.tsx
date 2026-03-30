/** Memory audit blog post diagrams -- SVG-based, themed to site colors */

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

/** Shows all 5 memory layers as a vertical stack, with Layer 3 (Knowledge Graph) broken/empty */
export function MemoryLayersDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The five-layer memory architecture. Layer 3 had been completely empty since day one."
      }
    >
      <svg
        viewBox="0 0 700 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        {/* Title */}
        <text x="350" y="22" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">Memory Architecture</text>

        {/* Layer 1: Auto Memory */}
        <rect x="60" y="36" width="580" height="44" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <rect x="60" y="36" width="580" height="44" rx="8" className="fill-emerald-500/5" />
        <text x="90" y="54" className="fill-emerald-500 text-[11px] font-semibold">Layer 1</text>
        <text x="90" y="69" className="fill-muted-foreground text-[9px]">Auto Memory</text>
        <text x="250" y="54" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">MEMORY.md</text>
        <text x="250" y="69" textAnchor="middle" className="fill-muted-foreground text-[9px]">Loaded automatically — stable project facts</text>
        <rect x="560" y="44" width="68" height="20" rx="4" className="fill-emerald-500/15" />
        <text x="594" y="58" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">WORKING</text>

        {/* Connector 1-2 */}
        <line x1="350" y1="80" x2="350" y2="94" className="stroke-foreground/25" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Layer 2: Vector Memory */}
        <rect x="60" y="96" width="580" height="44" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <rect x="60" y="96" width="580" height="44" rx="8" className="fill-emerald-500/5" />
        <text x="90" y="114" className="fill-emerald-500 text-[11px] font-semibold">Layer 2</text>
        <text x="90" y="129" className="fill-muted-foreground text-[9px]">Vector Memory</text>
        <text x="250" y="114" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">Semantic Search Store</text>
        <text x="250" y="129" textAnchor="middle" className="fill-muted-foreground text-[9px]">Bug fixes, decisions, gotchas — queried on demand</text>
        <rect x="560" y="104" width="68" height="20" rx="4" className="fill-emerald-500/15" />
        <text x="594" y="118" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">WORKING</text>

        {/* Connector 2-3 */}
        <line x1="350" y1="140" x2="350" y2="154" className="stroke-foreground/25" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Layer 3: Knowledge Graph (broken) */}
        <rect x="60" y="156" width="580" height="54" rx="8" className="stroke-red-500" strokeWidth="2" />
        <rect x="60" y="156" width="580" height="54" rx="8" className="fill-red-500/5" />
        <text x="90" y="176" className="fill-red-500 text-[11px] font-semibold">Layer 3</text>
        <text x="90" y="191" className="fill-red-500/70 text-[9px]">Knowledge Graph</text>
        <text x="90" y="202" className="fill-red-500/70 text-[9px]">!! BROKEN</text>
        <text x="265" y="176" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">Entity Relationship Graph</text>
        <text x="265" y="191" textAnchor="middle" className="fill-muted-foreground text-[9px]">Service deps, data flow, team structure</text>
        <text x="265" y="204" textAnchor="middle" className="fill-red-500/70 text-[9px]">0 entities — never populated since architecture design</text>
        <rect x="548" y="163" width="80" height="20" rx="4" className="fill-red-500/15" />
        <text x="588" y="177" textAnchor="middle" className="fill-red-500 text-[9px] font-semibold">0 ENTITIES</text>
        <rect x="548" y="187" width="80" height="18" rx="4" className="fill-red-500/10" />
        <text x="588" y="199" textAnchor="middle" className="fill-red-500/80 text-[9px]">EMPTY</text>

        {/* Connector 3-4 */}
        <line x1="350" y1="210" x2="350" y2="224" className="stroke-foreground/25" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Layer 4: Homunculus */}
        <rect x="60" y="226" width="580" height="44" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <rect x="60" y="226" width="580" height="44" rx="8" className="fill-emerald-500/5" />
        <text x="90" y="244" className="fill-emerald-500 text-[11px] font-semibold">Layer 4</text>
        <text x="90" y="259" className="fill-muted-foreground text-[9px]">Homunculus</text>
        <text x="250" y="244" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">Behavioral Pattern Store</text>
        <text x="250" y="259" textAnchor="middle" className="fill-muted-foreground text-[9px]">Instincts extracted from session archives by observer hooks</text>
        <rect x="560" y="234" width="68" height="20" rx="4" className="fill-emerald-500/15" />
        <text x="594" y="248" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">WORKING</text>

        {/* Connector 4-5 */}
        <line x1="350" y1="270" x2="350" y2="284" className="stroke-foreground/25" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Layer 5: Session Archive */}
        <rect x="60" y="286" width="580" height="44" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <rect x="60" y="286" width="580" height="44" rx="8" className="fill-emerald-500/5" />
        <text x="90" y="304" className="fill-emerald-500 text-[11px] font-semibold">Layer 5</text>
        <text x="90" y="319" className="fill-muted-foreground text-[9px]">Session Archive</text>
        <text x="250" y="304" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">Session Archive</text>
        <text x="250" y="319" textAnchor="middle" className="fill-muted-foreground text-[9px]">Full transcript backups saved on clean exit via SessionEnd hook</text>
        <rect x="560" y="294" width="68" height="20" rx="4" className="fill-emerald-500/15" />
        <text x="594" y="308" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">WORKING</text>

        <defs>
          <marker id="mem-down" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-foreground/25" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Bar-chart style breakdown of 84 entities across 10 categories */
export function KGEntityBreakdownDiagram({ caption }: DiagramProps) {
  const categories = [
    { label: "Agents", count: 20, colorClass: "fill-primary", strokeClass: "stroke-primary" },
    { label: "Scripts", count: 12, colorClass: "fill-foreground/70", strokeClass: "stroke-foreground/60" },
    { label: "MCP Servers", count: 11, colorClass: "fill-emerald-500", strokeClass: "stroke-emerald-500" },
    { label: "Hooks", count: 9, colorClass: "fill-amber-500", strokeClass: "stroke-amber-500" },
    { label: "Skills", count: 8, colorClass: "fill-violet-500", strokeClass: "stroke-violet-500" },
    { label: "Infra", count: 7, colorClass: "fill-cyan-500", strokeClass: "stroke-cyan-500" },
    { label: "Rules", count: 5, colorClass: "fill-foreground/40", strokeClass: "stroke-foreground/40" },
    { label: "Commands", count: 5, colorClass: "fill-foreground/40", strokeClass: "stroke-foreground/40" },
    { label: "Projects", count: 4, colorClass: "fill-foreground/30", strokeClass: "stroke-foreground/30" },
    { label: "Accounts", count: 2, colorClass: "fill-foreground/30", strokeClass: "stroke-foreground/30" },
  ];

  const maxCount = 20;
  const barAreaHeight = 140;
  const barAreaTop = 56;
  const barWidth = 52;
  const gap = 18;
  const totalWidth = categories.length * (barWidth + gap) - gap;
  const startX = (700 - totalWidth) / 2;

  return (
    <DiagramWrapper
      caption={
        caption ??
        "The knowledge graph after population: 84 entities across 10 categories, connected by 71 relations."
      }
    >
      <svg
        viewBox="0 0 700 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        {/* Title */}
        <text x="350" y="22" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">Knowledge Graph: Entity Breakdown</text>

        {/* Y-axis baseline */}
        <line x1={startX - 8} y1={barAreaTop + barAreaHeight} x2={startX + totalWidth + 8} y2={barAreaTop + barAreaHeight} className="stroke-foreground/20" strokeWidth="1" />

        {categories.map((cat, i) => {
          const barH = Math.round((cat.count / maxCount) * barAreaHeight);
          const x = startX + i * (barWidth + gap);
          const y = barAreaTop + barAreaHeight - barH;
          return (
            <g key={cat.label}>
              {/* Bar */}
              <rect x={x} y={y} width={barWidth} height={barH} rx="4" className={`${cat.colorClass} opacity-80`} />
              {/* Count label on top of bar */}
              <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" className="fill-foreground text-[10px] font-semibold">{cat.count}</text>
              {/* Category label below baseline */}
              <text x={x + barWidth / 2} y={barAreaTop + barAreaHeight + 14} textAnchor="middle" className="fill-muted-foreground text-[8px]">{cat.label}</text>
            </g>
          );
        })}

        {/* Summary badge */}
        <rect x="220" y="228" width="260" height="34" rx="6" className="fill-primary/10 stroke-primary/40" strokeWidth="1" />
        <text x="350" y="248" textAnchor="middle" className="fill-primary text-[12px] font-semibold">84 entities + 71 relations</text>
        <text x="350" y="260" textAnchor="middle" className="fill-muted-foreground text-[9px]">populated in a single /Knowledge-Graph-Sync run</text>
      </svg>
    </DiagramWrapper>
  );
}

/** Before/After comparison: 5 blind spots in memory-nudge hook and their fixes */
export function HookBlindSpotsDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Five blind spots in the memory-nudge hook, and the fixes that closed each one."
      }
    >
      <svg
        viewBox="0 0 820 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Column headers */}
        <text x="200" y="22" textAnchor="middle" className="fill-amber-500 text-[13px] font-bold">Before</text>
        <text x="200" y="38" textAnchor="middle" className="fill-muted-foreground text-[9px]">memory-nudge.sh (original)</text>
        <text x="620" y="22" textAnchor="middle" className="fill-emerald-500 text-[13px] font-bold">After</text>
        <text x="620" y="38" textAnchor="middle" className="fill-muted-foreground text-[9px]">memory-nudge.sh (patched)</text>

        {/* Vertical divider */}
        <line x1="410" y1="14" x2="410" y2="330" className="stroke-border" strokeWidth="1" strokeDasharray="6 4" />
        <rect x="393" y="150" width="34" height="24" rx="4" className="fill-background" />
        <text x="410" y="167" textAnchor="middle" className="fill-primary text-[14px] font-bold">vs</text>

        {/* Row 1: Extensions */}
        <text x="32" y="62" className="fill-foreground/60 text-[9px] font-semibold">1. Extensions</text>
        <rect x="32" y="68" width="352" height="32" rx="6" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="1" />
        <text x="42" y="83" className="fill-amber-500 text-[9px] font-medium">.ts .js .py .json .sh .yaml</text>
        <text x="42" y="95" className="fill-red-500/70 text-[9px]">Missing: .md .mdx (docs never triggered nudge)</text>
        <text x="436" y="62" className="fill-foreground/60 text-[9px] font-semibold">1. Extensions</text>
        <rect x="436" y="68" width="352" height="32" rx="6" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1" />
        <text x="446" y="83" className="fill-emerald-500 text-[9px] font-medium">.ts .js .py .json .sh .yaml .md .mdx</text>
        <text x="446" y="95" className="fill-muted-foreground text-[9px]">Added: .md .mdx coverage</text>

        {/* Row 2: Tools */}
        <text x="32" y="118" className="fill-foreground/60 text-[9px] font-semibold">2. Tool Coverage</text>
        <rect x="32" y="124" width="352" height="32" rx="6" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="1" />
        <text x="42" y="139" className="fill-amber-500 text-[9px] font-medium">Edit | Write | Bash | Task</text>
        <text x="42" y="151" className="fill-red-500/70 text-[9px]">Missing: MCP tool calls (mcp__ prefix) never matched</text>
        <text x="436" y="118" className="fill-foreground/60 text-[9px] font-semibold">2. Tool Coverage</text>
        <rect x="436" y="124" width="352" height="32" rx="6" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1" />
        <text x="446" y="139" className="fill-emerald-500 text-[9px] font-medium">Edit | Write | Bash | Task | mcp__* prefix</text>
        <text x="446" y="151" className="fill-muted-foreground text-[9px]">Added: MCP tool prefix matcher</text>

        {/* Row 3: Work type */}
        <text x="32" y="174" className="fill-foreground/60 text-[9px] font-semibold">3. Work Type</text>
        <rect x="32" y="180" width="352" height="32" rx="6" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="1" />
        <text x="42" y="195" className="fill-amber-500 text-[9px] font-medium">Write operations only</text>
        <text x="42" y="207" className="fill-red-500/70 text-[9px]">Read/Grep/Glob research work not counted</text>
        <text x="436" y="174" className="fill-foreground/60 text-[9px] font-semibold">3. Work Type</text>
        <rect x="436" y="180" width="352" height="32" rx="6" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1" />
        <text x="446" y="195" className="fill-emerald-500 text-[9px] font-medium">Writes (1.0x) + Reads/Grep/Glob (0.5x weight)</text>
        <text x="446" y="207" className="fill-muted-foreground text-[9px]">Research sessions now accumulate toward threshold</text>

        {/* Row 4: Timing */}
        <text x="32" y="230" className="fill-foreground/60 text-[9px] font-semibold">4. Timing</text>
        <rect x="32" y="236" width="352" height="32" rx="6" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="1" />
        <text x="42" y="251" className="fill-amber-500 text-[9px] font-medium">Mid-session only (threshold: 5 work units)</text>
        <text x="42" y="263" className="fill-red-500/70 text-[9px]">Short sessions under threshold: no nudge, no save</text>
        <text x="436" y="230" className="fill-foreground/60 text-[9px] font-semibold">4. Timing</text>
        <rect x="436" y="236" width="352" height="32" rx="6" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1" />
        <text x="446" y="251" className="fill-emerald-500 text-[9px] font-medium">Threshold lowered to 3 + Stop hook checkpoint</text>
        <text x="446" y="263" className="fill-muted-foreground text-[9px]">Session-end always fires regardless of session length</text>

        {/* Row 5: Language */}
        <text x="32" y="286" className="fill-foreground/60 text-[9px] font-semibold">5. Urgency Language</text>
        <rect x="32" y="292" width="352" height="32" rx="6" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="1" />
        <text x="42" y="307" className="fill-amber-500 text-[9px] font-medium">&quot;consider saving to memory...&quot;</text>
        <text x="42" y="319" className="fill-red-500/70 text-[9px]">Soft suggestion, easy to defer and forget</text>
        <text x="436" y="286" className="fill-foreground/60 text-[9px] font-semibold">5. Urgency Language</text>
        <rect x="436" y="292" width="352" height="32" rx="6" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1" />
        <text x="446" y="307" className="fill-emerald-500 text-[9px] font-medium">&quot;MEMORY SAVE REQUIRED — do not skip&quot;</text>
        <text x="446" y="319" className="fill-muted-foreground text-[9px]">Imperative framing raises perceived priority</text>
      </svg>
    </DiagramWrapper>
  );
}

/** Flow diagram showing two independent hooks creating reliability redundancy */
export function DualLayerReliabilityDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Two independent hooks with different trigger conditions. If one misses, the other catches it."
      }
    >
      <svg
        viewBox="0 0 750 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        {/* Source: Claude Code Session */}
        <rect x="250" y="10" width="250" height="44" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="375" y="29" textAnchor="middle" className="fill-primary text-[12px] font-semibold">Claude Code Session</text>
        <text x="375" y="46" textAnchor="middle" className="fill-muted-foreground text-[9px]">active work accumulates</text>

        {/* Split arrows */}
        <line x1="300" y1="54" x2="175" y2="100" className="stroke-foreground/40" strokeWidth="1.5" markerEnd="url(#mem-fork-gray)" />
        <line x1="450" y1="54" x2="575" y2="100" className="stroke-foreground/40" strokeWidth="1.5" markerEnd="url(#mem-fork-gray2)" />

        {/* Layer 1: memory-nudge (left path) */}
        <rect x="60" y="102" width="230" height="56" rx="8" className="stroke-primary" strokeWidth="1.5" />
        <text x="175" y="122" textAnchor="middle" className="fill-primary text-[11px] font-semibold">memory-nudge.sh</text>
        <text x="175" y="137" textAnchor="middle" className="fill-muted-foreground text-[9px]">PostToolUse hook</text>
        <text x="175" y="150" textAnchor="middle" className="fill-muted-foreground text-[9px]">Fires at threshold (3+ work units)</text>

        {/* Layer 2: memory-checkpoint (right path) */}
        <rect x="460" y="102" width="230" height="56" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="575" y="122" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">memory-checkpoint.sh</text>
        <text x="575" y="137" textAnchor="middle" className="fill-muted-foreground text-[9px]">Stop hook</text>
        <text x="575" y="150" textAnchor="middle" className="fill-muted-foreground text-[9px]">Fires at session end, always</text>

        {/* Outcome labels */}
        <rect x="90" y="170" width="170" height="22" rx="4" className="fill-primary/10" />
        <text x="175" y="185" textAnchor="middle" className="fill-primary text-[9px] font-medium">mid-session reminder</text>
        <rect x="490" y="170" width="170" height="22" rx="4" className="fill-foreground/8" />
        <text x="575" y="185" textAnchor="middle" className="fill-foreground text-[9px] font-medium">5-category checklist</text>

        {/* Arrows down to failures */}
        <line x1="175" y1="192" x2="175" y2="220" className="stroke-foreground/25" strokeWidth="1.5" markerEnd="url(#mem-down-sm)" />
        <line x1="575" y1="192" x2="575" y2="220" className="stroke-foreground/25" strokeWidth="1.5" markerEnd="url(#mem-down-sm2)" />

        {/* Failure modes caught */}
        <rect x="60" y="222" width="230" height="54" rx="6" className="fill-red-500/8 stroke-red-500/30" strokeWidth="1" />
        <text x="175" y="241" textAnchor="middle" className="fill-red-500/70 text-[9px] font-semibold">Catches:</text>
        <text x="175" y="255" textAnchor="middle" className="fill-muted-foreground text-[9px]">Long sessions that drift without saving</text>
        <text x="175" y="268" textAnchor="middle" className="fill-muted-foreground text-[9px]">High-volume work passing threshold</text>

        <rect x="460" y="222" width="230" height="54" rx="6" className="fill-red-500/8 stroke-red-500/30" strokeWidth="1" />
        <text x="575" y="241" textAnchor="middle" className="fill-red-500/70 text-[9px] font-semibold">Catches:</text>
        <text x="575" y="255" textAnchor="middle" className="fill-muted-foreground text-[9px]">Short sessions under threshold</text>
        <text x="575" y="268" textAnchor="middle" className="fill-muted-foreground text-[9px]">Nudge deprioritized or dismissed</text>

        {/* Converge arrows to Vector Memory */}
        <line x1="175" y1="276" x2="310" y2="326" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#mem-conv-green)" />
        <line x1="575" y1="276" x2="440" y2="326" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#mem-conv-green2)" />

        {/* Vector Memory destination */}
        <rect x="260" y="328" width="230" height="44" rx="8" className="stroke-emerald-500" strokeWidth="2" />
        <rect x="260" y="328" width="230" height="44" rx="8" className="fill-emerald-500/8" />
        <text x="375" y="348" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">Vector Memory</text>
        <text x="375" y="363" textAnchor="middle" className="fill-muted-foreground text-[9px]">memories saved, context preserved</text>

        <defs>
          <marker id="mem-fork-gray" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/40" />
          </marker>
          <marker id="mem-fork-gray2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/40" />
          </marker>
          <marker id="mem-down-sm" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-foreground/25" />
          </marker>
          <marker id="mem-down-sm2" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-foreground/25" />
          </marker>
          <marker id="mem-conv-green" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
          <marker id="mem-conv-green2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Cycle diagram showing the KG drift-detection and reconciliation loop */
export function KGMaintenanceLoopDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The KG maintenance loop: detect drift at the moment it happens, reconcile on demand."
      }
    >
      <svg
        viewBox="0 0 780 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Start: Component Changed */}
        <rect x="30" y="120" width="160" height="56" rx="8" className="stroke-amber-500" strokeWidth="2" />
        <rect x="30" y="120" width="160" height="56" rx="8" className="fill-amber-500/8" />
        <text x="110" y="143" textAnchor="middle" className="fill-amber-500 text-[11px] font-semibold">Component Changed</text>
        <text x="110" y="158" textAnchor="middle" className="fill-muted-foreground text-[9px]">agent, hook, skill,</text>
        <text x="110" y="169" textAnchor="middle" className="fill-muted-foreground text-[9px]">script, or MCP config</text>

        {/* Arrow to hook */}
        <line x1="190" y1="148" x2="240" y2="148" className="stroke-foreground/40" strokeWidth="1.5" markerEnd="url(#mem-right1)" />

        {/* kg-update-detect.sh */}
        <rect x="242" y="116" width="165" height="64" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="324" y="138" textAnchor="middle" className="fill-primary text-[11px] font-semibold">kg-update-detect.sh</text>
        <text x="324" y="153" textAnchor="middle" className="fill-muted-foreground text-[9px]">PostToolUse hook</text>
        <text x="324" y="165" textAnchor="middle" className="fill-muted-foreground text-[9px]">inspects tool + file path</text>
        <text x="324" y="175" textAnchor="middle" className="fill-muted-foreground text-[9px]">detects KG-relevant writes</text>

        {/* Decision: small change? — split arrows up and down */}
        <line x1="407" y1="148" x2="452" y2="148" className="stroke-foreground/40" strokeWidth="1.5" markerEnd="url(#mem-right2)" />

        {/* Diamond decision */}
        <polygon points="465,128 510,148 465,168 420,148" className="stroke-foreground/60 fill-card" strokeWidth="1.5" />
        <text x="465" y="152" textAnchor="middle" className="fill-foreground text-[8px] font-medium">small?</text>

        {/* Small = yes path (up, emerald) */}
        <line x1="465" y1="128" x2="465" y2="68" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#mem-up-green)" />
        <text x="476" y="102" className="fill-emerald-500 text-[8px]">yes</text>

        {/* Direct API call box */}
        <rect x="390" y="20" width="150" height="46" rx="6" className="stroke-emerald-500" strokeWidth="1.5" />
        <text x="465" y="39" textAnchor="middle" className="fill-emerald-500 text-[10px] font-semibold">Direct API call</text>
        <text x="465" y="52" textAnchor="middle" className="fill-muted-foreground text-[9px]">create_entities / create_relations</text>
        <text x="465" y="63" textAnchor="middle" className="fill-muted-foreground text-[9px]">add_observations</text>

        {/* Large = no path (right, amber) */}
        <line x1="510" y1="148" x2="555" y2="148" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#mem-right3)" />
        <text x="522" y="140" className="fill-amber-500 text-[8px]">no</text>

        {/* /Knowledge-Graph-Sync box */}
        <rect x="557" y="108" width="188" height="80" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="651" y="127" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">/Knowledge-Graph-Sync</text>
        <text x="651" y="141" textAnchor="middle" className="fill-muted-foreground text-[9px]">Phase 1: Disk scan</text>
        <text x="651" y="153" textAnchor="middle" className="fill-muted-foreground text-[9px]">Phase 2: KG query</text>
        <text x="651" y="165" textAnchor="middle" className="fill-muted-foreground text-[9px]">Phase 3: Reconcile + patch</text>
        <text x="651" y="177" textAnchor="middle" className="fill-muted-foreground text-[9px]">Phase 4: Validate | Phase 5: Report</text>

        {/* Both paths converge to KG Updated */}
        <line x1="465" y1="66" x2="620" y2="66" className="stroke-emerald-500" strokeWidth="1.5" />
        <line x1="620" y1="66" x2="620" y2="240" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#mem-down-green)" />
        <line x1="651" y1="188" x2="651" y2="240" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#mem-down-green2)" />

        {/* KG Updated */}
        <rect x="520" y="242" width="200" height="46" rx="8" className="stroke-emerald-500" strokeWidth="2" />
        <rect x="520" y="242" width="200" height="46" rx="8" className="fill-emerald-500/8" />
        <text x="620" y="262" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">KG Updated</text>
        <text x="620" y="278" textAnchor="middle" className="fill-muted-foreground text-[9px]">graph reflects current reality</text>

        {/* Cycle dotted arrow back to start */}
        <path d="M520 265 Q320 300 180 265 Q110 248 110 176" className="stroke-foreground/30" strokeWidth="1.5" strokeDasharray="5 4" fill="none" markerEnd="url(#mem-cycle-gray)" />
        <text x="290" y="305" textAnchor="middle" className="fill-foreground/40 text-[8px]">next component change restarts the loop</text>

        <defs>
          <marker id="mem-right1" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/40" />
          </marker>
          <marker id="mem-right2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/40" />
          </marker>
          <marker id="mem-right3" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-amber-500" />
          </marker>
          <marker id="mem-up-green" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
          <marker id="mem-down-green" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
          <marker id="mem-down-green2" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
          <marker id="mem-cycle-gray" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/30" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}
