/**
 * Shared building blocks for "The Agent That Rewrote Its Own Rules"
 * diagrams. Kept out of the diagrams-*.tsx files on purpose: every
 * export of a diagrams-*.tsx file is treated as a diagram by the phone
 * width coverage test (mobile-diagram-scroll.test.tsx).
 */

import { DiagramLightbox } from "./diagram-lightbox";
import { DIAGRAM_ACCENTS, type DiagramAccent } from "./diagram-editorial";

export interface DiagramProps {
  caption?: string;
}

export function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return <DiagramLightbox caption={caption}>{children}</DiagramLightbox>;
}

type Pt = readonly [number, number];

/** Orthogonal polyline with rounded corners, for multi-bend connectors. */
export function route(pts: readonly Pt[], r = 8): string {
  const parts = [`M${pts[0][0]},${pts[0][1]}`];
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const d1 = Math.hypot(cx - px, cy - py);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const ax = cx - ((cx - px) / d1) * rr;
    const ay = cy - ((cy - py) / d1) * rr;
    const bx = cx + ((nx - cx) / d2) * rr;
    const by = cy + ((ny - cy) / d2) * rr;
    parts.push(`L${ax},${ay}`, `Q${cx},${cy} ${bx},${by}`);
  }
  const last = pts[pts.length - 1];
  parts.push(`L${last[0]},${last[1]}`);
  return parts.join(" ");
}

export type Tone = DiagramAccent | "fg";

/** Mono text in a theme-safe tone (accent text fills or foreground). */
export function Mono({
  x,
  y,
  children,
  tone = "muted",
  size = 12.5,
  anchor = "start",
  bold = false,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  tone?: Tone;
  size?: number;
  anchor?: "start" | "middle" | "end";
  bold?: boolean;
}) {
  const fill = tone === "fg" ? "fill-foreground" : DIAGRAM_ACCENTS[tone].text;
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`${fill} font-mono${bold ? " font-semibold" : ""}`}
      style={{ fontSize: size }}
    >
      {children}
    </text>
  );
}

/** Dashed trust-zone rectangle tinted by accent. */
export function Zone({
  x,
  y,
  w,
  h,
  accent,
  dashed = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: DiagramAccent;
  dashed?: boolean;
}) {
  const a = DIAGRAM_ACCENTS[accent];
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={12}
      className={`${a.tintFill} ${a.strokeSoft}`}
      strokeWidth={1.25}
      strokeDasharray={dashed ? "6 4" : undefined}
    />
  );
}
