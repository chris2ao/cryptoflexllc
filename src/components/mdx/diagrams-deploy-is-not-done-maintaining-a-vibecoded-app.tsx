/**
 * "Deploy Is Not Done" blog post diagrams: editorial SVG, themed to site
 * colors. Each diagram animates with CSS keyframes in its own <style>
 * element (no JS timers). The base styles are the final, fully lit state,
 * and the animation is only attached when the reader has not asked for
 * reduced motion, so screenshots, RSS and reduced-motion readers all see
 * the finished diagram.
 */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  StepBadge,
  DIAGRAM_ACCENTS,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

const MOTION_OK = "@media (prefers-reduced-motion: no-preference)";

/**
 * Keyframes that hold a dimmed state, light up at `at` percent of the
 * cycle, stay lit, and fade back before the loop restarts.
 */
function litFrames(name: string, at: number, lo: number): string {
  const before = Math.max(at - 2, 0);
  return `@keyframes ${name} { 0%,${before}% { opacity: ${lo}; } ${at + 3}%,94% { opacity: 1; } 100% { opacity: ${lo}; } }`;
}

function MotionStyle({ css }: { css: string }) {
  return <style>{css}</style>;
}

/* ------------------------------------------------------------------ */
/* 1. Who patches what                                                 */
/* ------------------------------------------------------------------ */

const WHO_ROWS = [
  {
    label: "Watch advisories",
    theirs: "Security team reads feeds",
    yours: "Release notes, advisory pages",
  },
  {
    label: "Decide what applies",
    theirs: "Triage desk sorts them",
    yours: "Check the code and launch flags",
  },
  {
    label: "Patch",
    theirs: "Engineers ship the fix",
    yours: "Small upgrade batches",
  },
  {
    label: "Test",
    theirs: "QA and CI before release",
    yours: "Unit tests plus full E2E",
  },
  {
    label: "Deploy quietly",
    theirs: "Staged rollout",
    yours: "Wait until nobody is streaming",
  },
  {
    label: "Roll back",
    theirs: "On-call rolls it back",
    yours: "Keep the old version around",
  },
  {
    label: "Write it down",
    theirs: "Their release notes",
    yours: "Tag, changelog, release record",
  },
] as const;

const WHO_CSS = [
  ...WHO_ROWS.map((_, i) => litFrames(`wpw-k${i}`, 4 + i * 11, 0.3)),
  `${MOTION_OK} {`,
  ...WHO_ROWS.map((_, i) => `.wpw-r${i} { animation: wpw-k${i} 15s ease-in-out infinite; }`),
  `}`,
].join("\n");

/**
 * Two columns, seven maintenance jobs. For an app you pay for, every
 * job belongs to someone else's team. For an app you vibecoded, every
 * cell reads "You" and lights up row by row.
 */
export function WhoPatchesWhatDiagram({ caption }: DiagramProps) {
  const x0 = 292;
  const x1 = 592;
  const cellH = 54;
  const pitch = 60;
  const top = 98;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Seven jobs keep an app safe after launch. When you pay for the app, a vendor team does every one of them. When you vibecode it yourself, every row is yours."
      }
    >
      <EditorialFrame
        id="dvp-who"
        w={880}
        h={566}
        eyebrow="Who Patches What"
        chips={[
          { label: "7 jobs", accent: "primary" },
          { label: "1 owner", accent: "amber" },
        ]}
        footerRight="Vendor team vs you"
      >
        <MotionStyle css={WHO_CSS} />
        <SectionLabel x={x0} y={84} label="An app you pay for" accent="muted" />
        <SectionLabel x={x1} y={84} label="An app you vibecoded" accent="amber" />

        {WHO_ROWS.map((row, i) => {
          const y = top + i * pitch;
          const cy = y + cellH / 2;
          return (
            <g key={row.label}>
              <StepBadge cx={44} cy={cy} n={i + 1} accent="primary" />
              <text
                x={70}
                y={cy + 5.5}
                className="fill-foreground font-heading font-semibold"
                style={{ fontSize: 16 }}
              >
                {row.label}
              </text>
              <NodePanel
                x={x0}
                y={y}
                w={268}
                h={cellH}
                variant="ghost"
                align="left"
                title="Their team"
                sub={[row.theirs]}
                titleSize={16}
                subSize={12.5}
              />
              <g className={`wpw-r${i}`}>
                <FlowLine
                  id="dvp-who"
                  d={`M562,${cy} L${x1 - 2},${cy}`}
                  accent="amber"
                  width={2}
                />
                <NodePanel
                  x={x1}
                  y={y}
                  w={264}
                  h={cellH}
                  accent="amber"
                  align="left"
                  title="You"
                  sub={[row.yours]}
                  titleSize={16}
                  subSize={12.5}
                />
              </g>
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Exposure funnel                                                  */
/* ------------------------------------------------------------------ */

type Severity = "high" | "medium" | "low";

const SEV_FILL: Record<Severity, string> = {
  high: DIAGRAM_ACCENTS.red.fill,
  medium: DIAGRAM_ACCENTS.amber.fill,
  low: DIAGRAM_ACCENTS.muted.fill,
};

/** The 16 Node CVEs in the order the four gates remove them. */
const CVES: { sev: Severity; gate: 1 | 2 | 3 | 4 }[] = [
  { sev: "high", gate: 1 },
  { sev: "high", gate: 1 },
  { sev: "high", gate: 1 },
  { sev: "high", gate: 1 },
  { sev: "medium", gate: 1 },
  { sev: "medium", gate: 1 },
  { sev: "medium", gate: 1 },
  { sev: "high", gate: 2 },
  { sev: "high", gate: 2 },
  { sev: "high", gate: 2 },
  { sev: "medium", gate: 2 },
  { sev: "medium", gate: 2 },
  { sev: "medium", gate: 3 },
  { sev: "low", gate: 3 },
  { sev: "low", gate: 3 },
  { sev: "low", gate: 4 },
];

const GATES = [
  { n: 1, q: "HTTP/2 server?", sub: "No http2 import in server", drop: "HTTP/2 CVEs" },
  { n: 2, q: "TLS or HTTPS server?", sub: "No https, plain HTTP", drop: "TLS and https" },
  { n: 3, q: "Permission flag or proxy?", sub: "node --import tsx, no flags", drop: "flag and proxy" },
  { n: 4, q: "zlib params() call?", sub: "No zlib params() calls", drop: "zlib CVE" },
] as const;

const SQ = 13;
const PITCH = 18;
const FUNNEL_ROW_AT = [0, 14, 28, 42, 56, 70];

const FUNNEL_CSS = [
  ...FUNNEL_ROW_AT.map((at, k) => litFrames(`efn-k${k}`, at, 0.2)),
  ...[1, 2, 3, 4].map(
    (k) =>
      `@keyframes efn-f${k} { 0%,${Math.max(FUNNEL_ROW_AT[k] - 2, 0)}% { opacity: 0; transform: translateY(-16px); } ${FUNNEL_ROW_AT[k] + 4}%,94% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-16px); } }`
  ),
  `${MOTION_OK} {`,
  ...FUNNEL_ROW_AT.map((_, k) => `.efn-r${k} { animation: efn-k${k} 18s ease-in-out infinite; }`),
  ...[1, 2, 3, 4].map((k) => `.efn-f${k} { animation: efn-f${k} 18s ease-in-out infinite; }`),
  `}`,
].join("\n");

function Square({ x, y, sev }: { x: number; y: number; sev: Severity }) {
  return <rect x={x} y={y} width={SQ} height={SQ} rx={3} className={SEV_FILL[sev]} />;
}

/** The 16-slot grid; slots whose gate has already run show a dashed ghost. */
function RemainingGrid({ x, cy, passed }: { x: number; cy: number; passed: number }) {
  const y0 = cy - (2 * PITCH - 5) / 2;
  return (
    <g>
      {CVES.map((c, i) => {
        const sx = x + (i % 8) * PITCH;
        const sy = y0 + Math.floor(i / 8) * PITCH;
        return c.gate > passed ? (
          <Square key={i} x={sx} y={sy} sev={c.sev} />
        ) : (
          <rect
            key={i}
            x={sx}
            y={sy}
            width={SQ}
            height={SQ}
            rx={3}
            className="fill-none stroke-foreground/20"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        );
      })}
    </g>
  );
}

/**
 * Sixteen Node CVEs fall through four yes/no gates about what the app
 * actually runs. Each gate removes a group; none are left reachable.
 */
export function ExposureFunnelDiagram({ caption }: DiagramProps) {
  const startY = 94;
  const startH = 56;
  const gateY = [168, 248, 328, 408];
  const gateH = 62;
  const resultY = 488;
  const gridX = 705;
  const remainingCount = (passed: number) => CVES.filter((c) => c.gate > passed).length;
  const spineTop = [startY + startH, ...gateY.map((y) => y + gateH / 2 + 13)];
  const spineBottom = [...gateY.map((y) => y + gateH / 2 - 13), resultY];

  return (
    <DiagramLightbox
      caption={
        caption ??
        "Sixteen Node CVEs, four questions about what the app runs. HTTP/2 removes seven, TLS and HTTPS five, permission flags and proxies three, zlib params() one. Zero are reachable today."
      }
    >
      <EditorialFrame
        id="dvp-funnel"
        w={880}
        h={596}
        eyebrow="Severity Is Not Exposure"
        chips={[
          { label: "16 CVEs", accent: "red" },
          { label: "0 reachable", accent: "emerald" },
        ]}
        footerRight="Four gates · 7 + 5 + 3 + 1"
      >
        <MotionStyle css={FUNNEL_CSS} />

        {/* Spine arrows between rows */}
        {spineBottom.map((yb, i) => (
          <FlowLine
            key={i}
            id="dvp-funnel"
            d={`M40,${spineTop[i]} L40,${yb}`}
            accent="amber"
            width={2}
          />
        ))}

        {/* Start row */}
        <g className="efn-r0">
          <NodePanel
            x={24}
            y={startY}
            w={320}
            h={startH}
            accent="red"
            align="left"
            title="16 CVEs in Node 26.13.1"
            sub={["2026-11-11 security release"]}
            titleSize={17}
            subSize={12.5}
          />
          {(
            [
              ["7 high", "high", 380],
              ["6 medium", "medium", 462],
              ["3 low", "low", 556],
            ] as const
          ).map(([label, sev, lx]) => (
            <g key={label}>
              <Square x={lx} y={startY + startH / 2 - SQ / 2} sev={sev} />
              <text
                x={lx + SQ + 7}
                y={startY + startH / 2 + 4.5}
                className="fill-muted-foreground font-mono"
                style={{ fontSize: 12.5 }}
              >
                {label}
              </text>
            </g>
          ))}
          <NodePanel
            x={640}
            y={startY}
            w={216}
            h={startH}
            accent="cyan"
            align="left"
            title="16"
            sub={["total"]}
            titleSize={22}
            subSize={12.5}
          />
          <RemainingGrid x={gridX} cy={startY + startH / 2} passed={0} />
        </g>

        {/* Gate rows */}
        {GATES.map((g, i) => {
          const y = gateY[i];
          const cy = y + gateH / 2;
          const dropped = CVES.filter((c) => c.gate === g.n);
          const dropX = 372 + 250 - 14 - (dropped.length * PITCH - 5);
          return (
            <g key={g.n} className={`efn-r${g.n}`}>
              <StepBadge cx={40} cy={cy} n={g.n} accent="amber" />
              <NodePanel
                x={64}
                y={y}
                w={280}
                h={gateH}
                accent="amber"
                align="left"
                title={g.q}
                sub={[g.sub]}
                titleSize={17}
                subSize={12.5}
              >
                <Chip x={336} y={y + gateH - 27} label="No" accent="emerald" filled anchor="end" />
              </NodePanel>
              <FlowLine id="dvp-funnel" d={`M344,${cy} L370,${cy}`} accent="emerald" width={2} />
              <NodePanel
                x={372}
                y={y}
                w={250}
                h={gateH}
                accent="muted"
                align="left"
                title={`${dropped.length} removed`}
                sub={[g.drop]}
                titleSize={17}
                subSize={12.5}
              />
              <g className={`efn-f${g.n}`}>
                {dropped.map((c, j) => (
                  <Square key={j} x={dropX + j * PITCH} y={cy - SQ / 2} sev={c.sev} />
                ))}
              </g>
              <NodePanel
                x={640}
                y={y}
                w={216}
                h={gateH}
                accent="cyan"
                align="left"
                title={String(remainingCount(g.n))}
                sub={["left"]}
                titleSize={22}
                subSize={12.5}
              />
              <RemainingGrid x={gridX} cy={cy} passed={g.n} />
            </g>
          );
        })}

        {/* Result */}
        <g className="efn-r5">
          <NodePanel
            x={24}
            y={resultY}
            w={832}
            h={54}
            accent="emerald"
            emphasis
            align="left"
            title="0 reachable today"
            sub={["A snapshot of today's code, not a proof"]}
            titleSize={18}
            subSize={12.5}
          >
            <Chip
              x={840}
              y={resultY + 16}
              label="Add https: 5 live"
              accent="amber"
              filled
              fontSize={11}
              anchor="end"
            />
          </NodePanel>
        </g>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Advisory lag timeline                                            */
/* ------------------------------------------------------------------ */

const LAG_X = [140, 417, 740] as const;
const LAG_CSS = [
  litFrames("alt-k0", 0, 0.25),
  litFrames("alt-k1", 26, 0.25),
  litFrames("alt-k2", 53, 0.25),
  litFrames("alt-kbr", 60, 0.15),
  litFrames("alt-kb", 58, 0.2),
  `@keyframes alt-kast { 0%,56% { opacity: 1; } 64%,96% { opacity: 0; } 100% { opacity: 1; } }`,
  `@keyframes alt-kabase { 0%,56% { opacity: 0; } 64%,94% { opacity: 1; } 100% { opacity: 0; } }`,
  `@keyframes alt-kpulse { 0%,2% { transform: translateX(0px); opacity: 0; } 4% { transform: translateX(0px); opacity: 1; } 56% { transform: translateX(600px); opacity: 1; } 60%,100% { transform: translateX(600px); opacity: 0; } }`,
  `@keyframes alt-kline { 0%,2% { stroke-dashoffset: 1; opacity: 1; } 56%,90% { stroke-dashoffset: 0; opacity: 1; } 96% { stroke-dashoffset: 0; opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; } }`,
  `.alt-pulse, .alt-ast { opacity: 0; }`,
  `${MOTION_OK} {`,
  `.alt-e0 { animation: alt-k0 14s ease-in-out infinite; }`,
  `.alt-e1 { animation: alt-k1 14s ease-in-out infinite; }`,
  `.alt-e2 { animation: alt-k2 14s ease-in-out infinite; }`,
  `.alt-br { animation: alt-kbr 14s ease-in-out infinite; }`,
  `.alt-b { animation: alt-kb 14s ease-in-out infinite; }`,
  `.alt-ast { animation: alt-kast 14s ease-in-out infinite; }`,
  `.alt-abase { animation: alt-kabase 14s ease-in-out infinite; }`,
  `.alt-pulse { animation: alt-kpulse 14s ease-in-out infinite; }`,
  `.alt-line { animation: alt-kline 14s ease-in-out infinite; }`,
  `}`,
].join("\n");

const LAG_EVENTS = [
  {
    date: "2026-11-05",
    day: "Day 0",
    title: "undici 8.12.4 ships",
    sub: ["6 CVE fixes", "1 high, 5 medium"],
    accent: "cyan",
  },
  {
    date: "2026-11-11",
    day: "Day 6",
    title: "Node 26.13.1 ships",
    sub: ["bundles undici 8.12.4", "plus 16 Node CVEs"],
    accent: "cyan",
  },
  {
    date: "2026-11-18",
    day: "Day 13",
    title: "The survey runs",
    sub: ["audit says clean", "release notes disagree"],
    accent: "amber",
  },
] as const;

/**
 * A fix is public on day 0. The scanner still says clean on day 13,
 * because it reads a database that had not caught up. The release notes
 * had been right the whole time.
 */
export function AdvisoryLagTimelineDiagram({ caption }: DiagramProps) {
  const lineY = 250;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "undici shipped six CVE fixes on 2026-11-05. On 2026-11-18, pnpm audit still reported zero findings because GitHub's advisory lookup returned 404, while the release notes listed six CVEs. The gap was 13 days."
      }
    >
      <EditorialFrame
        id="dvp-lag"
        w={880}
        h={514}
        eyebrow="The Advisory Lag"
        chips={[
          { label: "13 days", accent: "amber" },
          { label: "6 CVEs", accent: "red" },
        ]}
        footerRight="Release notes vs audit"
      >
        <MotionStyle css={LAG_CSS} />

        {/* Base line and the lit overlay the pulse draws */}
        <path
          d={`M${LAG_X[0]},${lineY} L${LAG_X[2]},${lineY}`}
          className="stroke-foreground/25"
          strokeWidth="2"
        />
        <path
          d={`M${LAG_X[0]},${lineY} L${LAG_X[2]},${lineY}`}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="0"
          className="alt-line stroke-cyan-500"
          strokeWidth="2.5"
        />

        {/* Event cards, stems, markers, dates */}
        {LAG_EVENTS.map((ev, i) => {
          const cx = LAG_X[i];
          const a = DIAGRAM_ACCENTS[ev.accent];
          return (
            <g key={ev.date} className={`alt-e${i}`}>
              <NodePanel
                x={cx - 116}
                y={84}
                w={232}
                h={84}
                accent={ev.accent}
                emphasis={i === 2}
                title={ev.title}
                sub={[...ev.sub]}
                titleSize={17}
                subSize={12.5}
              />
              <path
                d={`M${cx},168 L${cx},${lineY - 9}`}
                className={a.strokeSoft}
                strokeWidth="1.5"
              />
              <circle
                cx={cx}
                cy={lineY}
                r={8}
                className={`${a.softFill} ${a.stroke}`}
                strokeWidth="2.5"
              />
              <text
                x={cx}
                y={278}
                textAnchor="middle"
                className="fill-foreground font-mono font-semibold"
                style={{ fontSize: 13 }}
              >
                {ev.date}
              </text>
              <text
                x={cx}
                y={296}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                style={{ fontSize: 12.5 }}
              >
                {ev.day}
              </text>
            </g>
          );
        })}

        {/* Pulse travelling the line */}
        <g transform={`translate(${LAG_X[0]} ${lineY})`}>
          <g className="alt-pulse">
            <circle cx={0} cy={0} r={13} className="fill-cyan-500/20" />
            <circle cx={0} cy={0} r={5} className="fill-cyan-500" />
          </g>
        </g>

        {/* 13 day bracket */}
        <g className="alt-br">
          <path
            d={`M${LAG_X[0]},308 L${LAG_X[0]},326 L${LAG_X[2]},326 L${LAG_X[2]},308`}
            fill="none"
            className="stroke-amber-500/60"
            strokeWidth="1.5"
          />
          <Chip x={440 - 43} y={315} label="13-day gap" accent="amber" filled fontSize={11} />
          <FlowLine id="dvp-lag" d="M440,337 L440,352" accent="amber" arrow={false} />
          <path d="M229,352 L651,352" className="stroke-amber-500/50" strokeWidth="1.5" />
          <FlowLine id="dvp-lag" d="M229,352 L229,376" accent="amber" />
          <FlowLine id="dvp-lag" d="M651,352 L651,376" accent="amber" />
        </g>

        {/* Left panel: the audit, flipping from "clean" to lagging */}
        <g className="alt-ast">
          <NodePanel
            x={24}
            y={378}
            w={410}
            h={92}
            accent="emerald"
            emphasis
            align="left"
            title="The audit said: clean"
            sub={["pnpm audit --prod: 0 high", "GitHub advisories: lookup 404"]}
            titleSize={17}
            subSize={12.5}
          />
        </g>
        <g className="alt-abase">
          <NodePanel
            x={24}
            y={378}
            w={410}
            h={92}
            accent="muted"
            variant="dashed"
            align="left"
            title="The audit said: clean"
            sub={["pnpm audit --prod: 0 high", "GitHub advisories: lookup 404"]}
            titleSize={17}
            subSize={12.5}
          />
          <Chip x={418} y={388} label="Lagging" accent="amber" filled anchor="end" />
        </g>

        {/* Right panel: what the release notes said */}
        <g className="alt-b">
          <NodePanel
            x={446}
            y={378}
            w={410}
            h={92}
            accent="red"
            emphasis
            align="left"
            title="The release notes said: 6 CVEs"
            sub={["undici v8.12.4: 1 high, 5 medium", "Public since 2026-11-05"]}
            titleSize={17}
            subSize={12.5}
          />
        </g>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Patch night pipeline                                             */
/* ------------------------------------------------------------------ */

const PIPE_STEPS = [
  { title: "Survey", sub: ["/cryptoflix-deps", "read-only survey"], accent: "violet" },
  { title: "Triage", sub: ["release notes read", "grep the code paths"], accent: "cyan" },
  { title: "Upgrade", sub: ["Node 26.13.1", "undici 8.12.4", "npm patch batch"], accent: "primary" },
  { title: "Gate", sub: ["13,677 unit passed", "806 E2E passed", "0 CSP violations"], accent: "amber" },
  { title: "Stream check", sub: ["0 bytes in 5 s", "no transcode", "nobody watching"], accent: "amber" },
  { title: "Deploy", sub: ["22:22 restart", "frozen lockfile", "web bundle copied"], accent: "primary" },
  { title: "Tag and release", sub: ["v9.15.2", "GitHub Release", "marked latest"], accent: "emerald" },
  { title: "Record", sub: ["CHANGELOG entry", "release record", "Node before-state"], accent: "emerald" },
] as const;

const PIPE_W = 190;
const PIPE_H = 124;
const PIPE_ROW_Y = [100, 284] as const;
const pipeX = (i: number) => 24 + 214 * (i % 4);
const pipeY = (i: number) => PIPE_ROW_Y[i < 4 ? 0 : 1];
const PIPE_AT = (i: number) => 2 + i * 11;

const PIPE_CSS = [
  ...PIPE_STEPS.map((_, i) => litFrames(`pnp-k${i}`, PIPE_AT(i) - 1, 0.3)),
  `@keyframes pnp-hl { 0% { opacity: 0; transform: translate(0px,0px); } ${PIPE_STEPS.map(
    (_, i) => {
      const dx = pipeX(i) - pipeX(0);
      const dy = pipeY(i) - pipeY(0);
      return `${PIPE_AT(i)}%,${PIPE_AT(i) + 6}% { opacity: 1; transform: translate(${dx}px,${dy}px); }`;
    }
  ).join(" ")} 90% { opacity: 1; transform: translate(${pipeX(7) - pipeX(0)}px,${pipeY(7) - pipeY(0)}px); } 96% { opacity: 0; transform: translate(${pipeX(7) - pipeX(0)}px,${pipeY(7) - pipeY(0)}px); } 100% { opacity: 0; transform: translate(0px,0px); } }`,
  `.pnp-hl { opacity: 0; }`,
  `${MOTION_OK} {`,
  ...PIPE_STEPS.map((_, i) => `.pnp-s${i} { animation: pnp-k${i} 16s ease-in-out infinite; }`),
  `.pnp-hl { animation: pnp-hl 16s ease-in-out infinite; }`,
  `}`,
].join("\n");

/**
 * Eight steps in two rows. A return elbow carries the flow from the end
 * of row one to the start of row two. A highlight sweeps the steps, then
 * a fan-in leads to the post-restart checks.
 */
export function PatchNightPipelineDiagram({ caption }: DiagramProps) {
  const row2Bottom = PIPE_ROW_Y[1] + PIPE_H;
  const midY = (PIPE_ROW_Y[0] + PIPE_H + PIPE_ROW_Y[1]) / 2;
  const busY = row2Bottom + 16;
  const bandY = busY + 18;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "One night, eight steps: survey, triage, upgrade, the full test gate, a stream check, the 22:22 deploy, a tag and release, and the written record."
      }
    >
      <EditorialFrame
        id="dvp-night"
        w={880}
        h={bandY + 52 + 44}
        eyebrow="Patch Night"
        chips={[
          { label: "9.15.2", accent: "primary" },
          { label: "22:22 deploy", accent: "amber" },
        ]}
        footerRight="Survey to record"
      >
        <MotionStyle css={PIPE_CSS} />

        {/* Row connectors */}
        {PIPE_STEPS.slice(0, 7).map((_, i) =>
          i === 3 ? null : (
            <FlowLine
              key={i}
              id="dvp-night"
              d={`M${pipeX(i) + PIPE_W},${pipeY(i) + PIPE_H / 2} L${pipeX(i + 1) - 2},${pipeY(i) + PIPE_H / 2}`}
              accent="cyan"
              width={2}
            />
          )
        )}
        <FlowLine
          id="dvp-night"
          d={`M${pipeX(3) + PIPE_W / 2},${PIPE_ROW_Y[0] + PIPE_H} L${pipeX(3) + PIPE_W / 2},${midY - 8} Q${pipeX(3) + PIPE_W / 2},${midY} ${pipeX(3) + PIPE_W / 2 - 8},${midY} L${pipeX(4) + PIPE_W / 2 + 8},${midY} Q${pipeX(4) + PIPE_W / 2},${midY} ${pipeX(4) + PIPE_W / 2},${midY + 8} L${pipeX(4) + PIPE_W / 2},${PIPE_ROW_Y[1] - 2}`}
          accent="cyan"
          width={2}
        />

        {/* Steps */}
        {PIPE_STEPS.map((s, i) => (
          <g key={s.title} className={`pnp-s${i}`}>
            <NodePanel
              x={pipeX(i)}
              y={pipeY(i)}
              w={PIPE_W}
              h={PIPE_H}
              accent={s.accent}
              emphasis={i === 4}
              title={s.title}
              sub={[...s.sub]}
              titleSize={17}
              subSize={12.5}
            />
            <StepBadge cx={pipeX(i) + PIPE_W - 18} cy={pipeY(i)} n={i + 1} accent={s.accent} />
          </g>
        ))}

        {/* Sweeping highlight */}
        <rect
          x={pipeX(0)}
          y={pipeY(0)}
          width={PIPE_W}
          height={PIPE_H}
          rx={10}
          fill="none"
          className="pnp-hl stroke-amber-500"
          strokeWidth="3"
        />

        {/* Fan-in from row two to the outcome band */}
        {[4, 5, 6, 7].map((i) => (
          <path
            key={i}
            d={`M${pipeX(i) + PIPE_W / 2},${row2Bottom} L${pipeX(i) + PIPE_W / 2},${busY}`}
            className="stroke-emerald-500/50"
            strokeWidth="1.5"
          />
        ))}
        <path
          d={`M${pipeX(4) + PIPE_W / 2},${busY} L${pipeX(7) + PIPE_W / 2},${busY}`}
          className="stroke-emerald-500/50"
          strokeWidth="1.5"
        />
        <FlowLine id="dvp-night" d={`M440,${busY} L440,${bandY - 2}`} accent="emerald" />
        <NodePanel
          x={24}
          y={bandY}
          w={832}
          h={52}
          accent="emerald"
          emphasis
          align="left"
          title="After the restart"
          sub={["health ok, 12 of 12 PC drives mounted, new Node loaded"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={840} y={bandY + 15} label="No migration" accent="emerald" filled fontSize={11} anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}
