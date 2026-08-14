/**
 * Editorial diagram primitives: the shared visual language for inline
 * SVG diagrams, matching the brand cover infographics (workshop frame,
 * chip badges, terminal panels, mono labels, orthogonal connectors).
 *
 * All color classes are static strings from the maps below (never
 * interpolated fragments) and use semantic tokens so both themes work.
 * Every consumer passes a unique `id` prefix so marker/pattern/gradient
 * ids never collide when multiple diagrams share a page.
 */

export type DiagramAccent =
  | "primary"
  | "cyan"
  | "emerald"
  | "amber"
  | "red"
  | "violet"
  | "muted";

interface AccentClasses {
  stroke: string;
  strokeSoft: string;
  text: string;
  fill: string;
  softFill: string;
  tintFill: string;
}

export const DIAGRAM_ACCENTS: Record<DiagramAccent, AccentClasses> = {
  primary: {
    stroke: "stroke-primary",
    strokeSoft: "stroke-primary/50",
    text: "fill-primary",
    fill: "fill-primary",
    softFill: "fill-primary/10",
    tintFill: "fill-primary/[0.06]",
  },
  cyan: {
    stroke: "stroke-cyan-500",
    strokeSoft: "stroke-cyan-500/50",
    text: "fill-cyan-600",
    fill: "fill-cyan-500",
    softFill: "fill-cyan-500/10",
    tintFill: "fill-cyan-500/[0.06]",
  },
  emerald: {
    stroke: "stroke-emerald-500",
    strokeSoft: "stroke-emerald-500/50",
    text: "fill-success",
    fill: "fill-emerald-500",
    softFill: "fill-emerald-500/10",
    tintFill: "fill-emerald-500/[0.06]",
  },
  amber: {
    stroke: "stroke-amber-500",
    strokeSoft: "stroke-amber-500/50",
    text: "fill-warning",
    fill: "fill-amber-500",
    softFill: "fill-amber-500/10",
    tintFill: "fill-amber-500/[0.06]",
  },
  red: {
    stroke: "stroke-red-500",
    strokeSoft: "stroke-red-500/50",
    text: "fill-destructive",
    fill: "fill-red-500",
    softFill: "fill-red-500/10",
    tintFill: "fill-red-500/[0.06]",
  },
  violet: {
    stroke: "stroke-violet-500",
    strokeSoft: "stroke-violet-500/50",
    text: "fill-violet-500",
    fill: "fill-violet-500",
    softFill: "fill-violet-500/10",
    tintFill: "fill-violet-500/[0.06]",
  },
  muted: {
    stroke: "stroke-foreground/40",
    strokeSoft: "stroke-foreground/25",
    text: "fill-muted-foreground",
    fill: "fill-muted-foreground",
    softFill: "fill-foreground/5",
    tintFill: "fill-foreground/[0.03]",
  },
};

/** Approximate JetBrains Mono advance width for chip sizing. */
export function monoWidth(label: string, fontSize: number): number {
  return label.length * fontSize * 0.62;
}

/** Arrowhead markers for every accent, namespaced by diagram id. */
export function ArrowDefs({ id }: { id: string }) {
  return (
    <>
      {(Object.keys(DIAGRAM_ACCENTS) as DiagramAccent[]).map((accent) => (
        <marker
          key={accent}
          id={`${id}-arrow-${accent}`}
          markerWidth="9"
          markerHeight="7"
          refX="8"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L9,3.5 L0,7 Z" className={DIAGRAM_ACCENTS[accent].fill} />
        </marker>
      ))}
    </>
  );
}

/**
 * Orthogonal connector path with rounded elbows. `dir` sets whether the
 * path leaves horizontally or vertically first. Straight runs collapse
 * to a plain line automatically.
 */
export function elbowPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dir: "h" | "v" = "h",
  radius = 8
): string {
  if (x1 === x2 || y1 === y2) return `M${x1},${y1} L${x2},${y2}`;
  const r = Math.min(radius, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2);
  const sx = x2 > x1 ? 1 : -1;
  const sy = y2 > y1 ? 1 : -1;
  if (dir === "h") {
    return [
      `M${x1},${y1}`,
      `L${x2 - sx * r},${y1}`,
      `Q${x2},${y1} ${x2},${y1 + sy * r}`,
      `L${x2},${y2}`,
    ].join(" ");
  }
  return [
    `M${x1},${y1}`,
    `L${x1},${y2 - sy * r}`,
    `Q${x1},${y2} ${x1 + sx * r},${y2}`,
    `L${x2},${y2}`,
  ].join(" ");
}

interface FlowLineProps {
  id: string;
  d: string;
  accent?: DiagramAccent;
  dashed?: boolean;
  width?: number;
  arrow?: boolean;
}

/** A connector stroke with optional arrowhead, themed by accent. */
export function FlowLine({
  id,
  d,
  accent = "muted",
  dashed = false,
  width = 1.5,
  arrow = true,
}: FlowLineProps) {
  return (
    <path
      d={d}
      fill="none"
      className={DIAGRAM_ACCENTS[accent].strokeSoft}
      strokeWidth={width}
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd={arrow ? `url(#${id}-arrow-${accent})` : undefined}
    />
  );
}

interface ChipProps {
  x: number;
  y: number;
  label: string;
  accent?: DiagramAccent;
  filled?: boolean;
  fontSize?: number;
  anchor?: "start" | "end";
}

/** Cover-style chip badge: bordered pill with uppercase mono text. */
export function Chip({
  x,
  y,
  label,
  accent = "primary",
  filled = false,
  fontSize = 10,
  anchor = "start",
}: ChipProps) {
  const a = DIAGRAM_ACCENTS[accent];
  const padX = 9;
  const h = fontSize + 11;
  const w = monoWidth(label, fontSize) + padX * 2;
  const rx = anchor === "end" ? x - w : x;
  return (
    <g>
      <rect
        x={rx}
        y={y}
        width={w}
        height={h}
        rx={5}
        className={
          filled ? `${a.softFill} ${a.stroke}` : `fill-surface-1/80 ${a.strokeSoft}`
        }
        strokeWidth="1"
      />
      <text
        x={rx + w / 2}
        y={y + h / 2 + fontSize * 0.36}
        textAnchor="middle"
        className={`${a.text} font-mono font-semibold uppercase`}
        style={{ fontSize, letterSpacing: "0.08em" }}
      >
        {label}
      </text>
    </g>
  );
}

/** Terminal traffic-light dots, a house motif for runtime/process panels. */
export function TerminalDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={3.5} className="fill-red-500/80" />
      <circle cx={x + 12} cy={y} r={3.5} className="fill-amber-500/80" />
      <circle cx={x + 24} cy={y} r={3.5} className="fill-emerald-500/80" />
    </g>
  );
}

interface NodePanelProps {
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: DiagramAccent;
  title: string;
  sub?: string[];
  variant?: "solid" | "dashed" | "ghost";
  emphasis?: boolean;
  align?: "center" | "left";
  titleSize?: number;
  terminal?: boolean;
  children?: React.ReactNode;
}

/**
 * The standard diagram node: surface-toned panel, accent border, heading
 * title, mono sublines. `emphasis` adds a stronger border and corner
 * ticks; `terminal` adds traffic-light dots; `ghost` is a placeholder.
 */
export function NodePanel({
  x,
  y,
  w,
  h,
  accent = "muted",
  title,
  sub = [],
  variant = "solid",
  emphasis = false,
  align = "center",
  titleSize = 15,
  terminal = false,
  children,
}: NodePanelProps) {
  const a = DIAGRAM_ACCENTS[accent];
  const tx = align === "center" ? x + w / 2 : x + 14;
  const anchor = align === "center" ? "middle" : "start";
  const contentTop = terminal ? y + 34 : y;
  const textBlockH = titleSize + 6 + sub.length * 15;
  const ty = contentTop + (h - (contentTop - y) - textBlockH) / 2 + titleSize;
  const titleFill = accent === "muted" ? "fill-foreground" : a.text;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={`fill-surface-2/80 ${emphasis ? a.stroke : a.strokeSoft}`}
        strokeWidth={emphasis ? 2 : 1.25}
        strokeDasharray={variant === "dashed" ? "6 4" : undefined}
        opacity={variant === "ghost" ? 0.55 : 1}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={emphasis ? a.softFill : a.tintFill}
      />
      {terminal && <TerminalDots x={x + 16} y={y + 16} />}
      {emphasis && (
        <path
          d={`M${x + 1.5},${y + 14} L${x + 1.5},${y + 5} Q${x + 1.5},${y + 1.5} ${x + 5},${y + 1.5} L${x + 14},${y + 1.5}`}
          fill="none"
          className={a.stroke}
          strokeWidth="3"
        />
      )}
      <text
        x={tx}
        y={ty}
        textAnchor={anchor}
        className={`${titleFill} font-heading font-semibold`}
        style={{ fontSize: titleSize }}
      >
        {title}
      </text>
      {sub.map((line, i) => (
        <text
          key={line}
          x={tx}
          y={ty + 17 + i * 15}
          textAnchor={anchor}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 11 }}
        >
          {line}
        </text>
      ))}
      {children}
    </g>
  );
}

interface SectionLabelProps {
  x: number;
  y: number;
  label: string;
  accent?: DiagramAccent;
  fontSize?: number;
}

/** Uppercase section header with the square accent dot, cover-style. */
export function SectionLabel({
  x,
  y,
  label,
  accent = "primary",
  fontSize = 12,
}: SectionLabelProps) {
  const a = DIAGRAM_ACCENTS[accent];
  return (
    <g>
      <rect x={x} y={y - fontSize + 3} width={8} height={8} className={a.fill} />
      <text
        x={x + 16}
        y={y}
        className="fill-foreground font-heading font-bold uppercase"
        style={{ fontSize, letterSpacing: "0.14em" }}
      >
        {label}
      </text>
    </g>
  );
}

interface StepBadgeProps {
  cx: number;
  cy: number;
  n: string | number;
  accent?: DiagramAccent;
}

/** Numbered step marker for sequence diagrams. */
export function StepBadge({ cx, cy, n, accent = "primary" }: StepBadgeProps) {
  const a = DIAGRAM_ACCENTS[accent];
  return (
    <g>
      <circle cx={cx} cy={cy} r={13} className={`${a.softFill} ${a.stroke}`} strokeWidth="1.5" />
      <text
        x={cx}
        y={cy + 4.5}
        textAnchor="middle"
        className={`${a.text} font-heading font-bold`}
        style={{ fontSize: 13 }}
      >
        {n}
      </text>
    </g>
  );
}

interface EditorialFrameProps {
  id: string;
  w: number;
  h: number;
  eyebrow: string;
  eyebrowAccent?: DiagramAccent;
  chips?: { label: string; accent: DiagramAccent }[];
  footerRight?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

/**
 * The workshop frame every editorial diagram sits in: hatched canvas
 * with a corner glow, section-label header, chips top-right, and the
 * CRYPTOFLEX footer strip. Content renders between header and footer;
 * keep children inside y = 58 .. h - 44.
 */
export function EditorialFrame({
  id,
  w,
  h,
  eyebrow,
  eyebrowAccent = "primary",
  chips = [],
  footerRight,
  maxWidthClass = "max-w-3xl",
  children,
}: EditorialFrameProps) {
  const chipEls = chips.map((chip, i) => {
    const offset = chips
      .slice(0, i)
      .reduce((sum, c) => sum + monoWidth(c.label, 10) + 28, 0);
    return (
      <Chip
        key={chip.label}
        x={w - 16 - offset}
        y={16}
        label={chip.label}
        accent={chip.accent}
        anchor="end"
      />
    );
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full ${maxWidthClass} mx-auto`}
      role="img"
      aria-label={eyebrow}
    >
      <defs>
        <pattern
          id={`${id}-hatch`}
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <line x1="0" y1="0" x2="0" y2="14" className="stroke-foreground/[0.04]" strokeWidth="1" />
        </pattern>
        <radialGradient id={`${id}-glow`} cx="85%" cy="0%" r="80%">
          <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 0.09 }} />
          <stop offset="60%" style={{ stopColor: "var(--primary)", stopOpacity: 0 }} />
        </radialGradient>
        <ArrowDefs id={id} />
      </defs>

      {/* Canvas */}
      <rect x="0" y="0" width={w} height={h} rx={12} className="fill-surface-1/70" />
      <rect x="0" y="0" width={w} height={h} rx={12} fill={`url(#${id}-hatch)`} />
      <rect x="0" y="0" width={w} height={h} rx={12} fill={`url(#${id}-glow)`} />
      <rect
        x="0.75"
        y="0.75"
        width={w - 1.5}
        height={h - 1.5}
        rx={11}
        className="stroke-border"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Header */}
      <SectionLabel x={20} y={33} label={eyebrow} accent={eyebrowAccent} />
      {chipEls}

      {/* Content */}
      {children}

      {/* Footer strip */}
      <line x1={16} y1={h - 34} x2={w - 16} y2={h - 34} className="stroke-border" strokeWidth="1" />
      <text
        x={20}
        y={h - 15}
        className="font-mono font-bold"
        style={{ fontSize: 9.5, letterSpacing: "0.18em" }}
      >
        <tspan className="fill-foreground/80">CRYPTO</tspan>
        <tspan className="fill-primary">FLEX</tspan>
        <tspan className="fill-muted-foreground"> LLC // FROM THE WORKSHOP</tspan>
      </text>
      {footerRight && (
        <text
          x={w - 20}
          y={h - 15}
          textAnchor="end"
          className="fill-muted-foreground font-mono uppercase"
          style={{ fontSize: 9.5, letterSpacing: "0.14em" }}
        >
          {footerRight}
        </text>
      )}
    </svg>
  );
}
