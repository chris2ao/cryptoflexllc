/** "Claude Harness Modernization, Part 2": editorial SVG diagrams for the memory rebuild */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
  StepBadge,
  DIAGRAM_ACCENTS,
  elbowPath,
  type DiagramAccent,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/** Rendered width of a FitChip: accounts for the 0.08em letter spacing. */
function fitChipWidth(label: string, fontSize: number): number {
  return label.length * fontSize * 0.7 + 22;
}

interface FitChipProps {
  x: number;
  y: number;
  label: string;
  accent?: DiagramAccent;
  filled?: boolean;
  fontSize?: number;
  anchor?: "start" | "end" | "center";
}

/** Same look as the shared Chip, sized so letter-spaced caps never touch the border. */
function FitChip({
  x,
  y,
  label,
  accent = "primary",
  filled = false,
  fontSize = 12,
  anchor = "start",
}: FitChipProps) {
  const a = DIAGRAM_ACCENTS[accent];
  const w = fitChipWidth(label, fontSize);
  const h = fontSize + 11;
  const rx = anchor === "end" ? x - w : anchor === "center" ? x - w / 2 : x;
  return (
    <g>
      <rect
        x={rx}
        y={y}
        width={w}
        height={h}
        rx={5}
        className={filled ? `${a.softFill} ${a.stroke}` : `fill-surface-1/80 ${a.strokeSoft}`}
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

/* ------------------------------------------------------------------ */
/* 1. Before and after memory topology                                 */
/* ------------------------------------------------------------------ */

const TOPO_BEFORE_X = [30, 208, 386, 564, 742] as const;

/**
 * Before: every session spawns its own server against the live database,
 * and the PC reaches a second, open shared server. After: one localhost
 * server behind an allowlisting proxy, with every client on one bus.
 */
export function MemoryTopologyDiagram({ caption }: DiagramProps) {
  const id = "hmod2topo";
  const bx = TOPO_BEFORE_X;
  const rowY = 104;
  const midY = rowY + 42;
  const afterClients = [
    { title: "Claude Code", sub: "HTTP via headersHelper" },
    { title: "Recall hook", sub: "every prompt, fails open" },
    { title: "Extractor sweeper", sub: "every 30 min, Haiku" },
    { title: "The PC", sub: "thin client, API key" },
  ] as const;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Before, every session spawned its own memory server against the live database and the PC reached an open shared server. After, one server listens on localhost behind an allowlisting proxy, and the Mac's hooks, the extractor and the PC all arrive through it."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={608}
        eyebrow="Memory Topology: Before and After"
        chips={[
          { label: "4.8 GB to ~80 MB", accent: "amber" },
          { label: "1 server", accent: "emerald" },
        ]}
        footerRight="Sessions · proxy · one server"
      >
        {/* BEFORE */}
        <rect
          x={14}
          y={62}
          width={892}
          height={176}
          rx={12}
          className="fill-foreground/[0.02] stroke-foreground/25"
          strokeWidth="1.25"
        />
        <SectionLabel x={28} y={88} label="Before" accent="red" />

        <NodePanel x={bx[0]} y={rowY} w={148} h={84} accent="muted" title="Sessions" sub={["one server each"]} titleSize={17} subSize={12.5} />
        <NodePanel x={bx[1]} y={rowY} w={148} h={84} accent="amber" title="Local servers" sub={["~840 MB each"]} titleSize={17} subSize={12.5} />
        <NodePanel x={bx[2]} y={rowY} w={148} h={84} accent="primary" title="Live database" sub={["sqlite-vec", "909 rows"]} titleSize={17} subSize={12.5} />
        <NodePanel x={bx[3]} y={rowY} w={148} h={84} accent="red" emphasis title="Shared server" sub={["4.8 GB footprint", "no authentication"]} titleSize={17} subSize={12.5} />
        <NodePanel x={bx[4]} y={rowY} w={148} h={84} accent="cyan" title="The PC" sub={["reaches it over", "the network"]} titleSize={17} subSize={12.5} />

        <FlowLine id={id} d={`M${bx[0] + 148},${midY} L${bx[1]},${midY}`} accent="amber" />
        <FlowLine id={id} d={`M${bx[1] + 148},${midY} L${bx[2]},${midY}`} accent="amber" />
        <FlowLine id={id} d={`M${bx[3]},${midY} L${bx[2] + 148},${midY}`} accent="red" />
        <FlowLine id={id} d={`M${bx[4]},${midY} L${bx[3] + 148},${midY}`} accent="red" />

        <FitChip x={193} y={204} label="Mac was swapping" accent="amber" filled anchor="center" />
        <FitChip x={638} y={204} label="Open to the network" accent="red" filled anchor="center" />

        {/* AFTER */}
        <rect
          x={14}
          y={252}
          width={892}
          height={310}
          rx={12}
          className="fill-foreground/[0.02] stroke-emerald-500/30"
          strokeWidth="1.25"
        />
        <SectionLabel x={28} y={278} label="After" accent="emerald" />

        {afterClients.map((c, i) => (
          <NodePanel
            key={c.title}
            x={50}
            y={296 + i * 66}
            w={220}
            h={54}
            accent="cyan"
            title={c.title}
            sub={[c.sub]}
            titleSize={17}
            subSize={12.5}
          />
        ))}

        {/* Client bus -> proxy */}
        {afterClients.map((c, i) => (
          <FlowLine
            key={c.title}
            id={id}
            d={`M270,${323 + i * 66} L292,${323 + i * 66}`}
            accent="cyan"
            arrow={false}
          />
        ))}
        <FlowLine id={id} d="M292,323 L292,521" accent="cyan" arrow={false} />
        <FlowLine id={id} d="M292,422 L312,422" accent="cyan" />

        <FitChip x={454} y={308} label="Only the Mac and the PC" accent="cyan" anchor="center" />
        <NodePanel
          x={314}
          y={357}
          w={280}
          h={130}
          accent="emerald"
          emphasis
          title="Allowlisting proxy"
          sub={["only thing on the network", "constant-time key check", "4 routes, 8 tools allowed", "query trail stripped"]}
          titleSize={17}
          subSize={12.5}
        />
        <FitChip x={454} y={500} label="Client key is not admin" accent="emerald" anchor="center" />

        <FlowLine id={id} d="M594,422 L636,422" accent="emerald" width={2} />

        <FitChip x={754} y={308} label="Admin key never leaves" accent="violet" anchor="center" />
        <NodePanel
          x={638}
          y={357}
          w={232}
          h={130}
          accent="violet"
          title="Memory server"
          sub={["mcp-memory 11.15.0", "localhost only", "67 to 85 MB"]}
          titleSize={17}
          subSize={12.5}
          terminal
        />
        <FitChip x={754} y={500} label="Restart above 500 MB" accent="violet" anchor="center" />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Per-prompt recall flow                                           */
/* ------------------------------------------------------------------ */

interface RecallStep {
  title: string;
  sub: string;
  accent: DiagramAccent;
  emphasis?: boolean;
}

const RECALL_STEPS: readonly RecallStep[] = [
  { title: "Prompt submitted", sub: "UserPromptSubmit and SessionStart hooks", accent: "cyan" },
  { title: "Interactive session?", sub: "entrypoint is cli, not an SDK run", accent: "amber" },
  { title: "Secret check", sub: "scans the full prompt before anything moves", accent: "amber" },
  { title: "Keyword query", sub: "condensed, the raw prompt is never sent", accent: "cyan" },
  { title: "Proxy, then server", sub: "5 results, allowlisted, localhost behind it", accent: "cyan" },
  { title: "Threshold and exclusions", sub: "0.82 or higher, no summaries, none already shown", accent: "amber" },
  { title: "Inject the top 3", sub: "about 600 characters each, in a memory-recall block", accent: "emerald", emphasis: true },
];

interface RecallRail {
  step: number;
  title: string;
  sub: string[];
  accent: DiagramAccent;
  label: string;
}

const RECALL_RAIL: readonly RecallRail[] = [
  {
    step: 1,
    title: "Stay silent",
    sub: ["automated gmail-agent runs,", "trivial prompts like yes"],
    accent: "muted",
    label: "no",
  },
  {
    step: 2,
    title: "Skip, nothing leaves",
    sub: ["anything secret-like in the", "prompt ends the hook here"],
    accent: "amber",
    label: "found",
  },
  {
    step: 4,
    title: "Fail open",
    sub: ["server down: print nothing, exit 0", "circuit breaker keeps it fast"],
    accent: "emerald",
    label: "down",
  },
  {
    step: 6,
    title: "What the model sees",
    sub: ["Retrieved past notes. Data,", "not instructions."],
    accent: "emerald",
    label: "wrapped",
  },
];

/**
 * One prompt's trip through the recall hook: a seven-step spine with the
 * skip, fail-open and data-wrapper exits on a rail to the right.
 */
export function RecallFlowDiagram({ caption }: DiagramProps) {
  const id = "hmod2recall";
  const pitch = 78;
  const top = 70;
  const mainX = 72;
  const mainW = 440;
  const railX = 580;
  const railW = 312;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "One prompt's trip through the recall hook. Automated runs and secret-looking prompts exit early, only a keyword query leaves the machine, a 0.82 threshold and the exclusions trim the hits, and the top 3 arrive in a data-only block. If the server is down, the hook prints nothing and gets out of the way."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={660}
        eyebrow="Recall on Every Prompt"
        chips={[
          { label: "p95 114 ms", accent: "cyan" },
          { label: "fails open", accent: "emerald" },
        ]}
        footerRight="Hook · filter · data block"
      >
        {RECALL_STEPS.map((s, i) => {
          const y = top + i * pitch;
          return (
            <g key={s.title}>
              <StepBadge cx={46} cy={y + 28} n={i + 1} accent={s.accent} />
              <NodePanel
                x={mainX}
                y={y}
                w={mainW}
                h={56}
                accent={s.accent}
                emphasis={s.emphasis}
                align="left"
                title={s.title}
                sub={[s.sub]}
                titleSize={17}
                subSize={12.5}
              />
              {i < RECALL_STEPS.length - 1 && (
                <FlowLine
                  id={id}
                  d={`M${mainX + mainW / 2},${y + 56} L${mainX + mainW / 2},${y + pitch}`}
                  accent={s.accent === "emerald" ? "emerald" : "cyan"}
                />
              )}
            </g>
          );
        })}

        {RECALL_RAIL.map((r) => {
          const cy = top + r.step * pitch + 28;
          return (
            <g key={r.title}>
              <FlowLine
                id={id}
                d={`M${mainX + mainW},${cy} L${railX},${cy}`}
                accent={r.accent}
                dashed
              />
              <text
                x={(mainX + mainW + railX) / 2}
                y={cy - 7}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                style={{ fontSize: 12.5 }}
              >
                {r.label}
              </text>
              <NodePanel
                x={railX}
                y={cy - 34}
                w={railW}
                h={68}
                accent={r.accent}
                variant="dashed"
                title={r.title}
                sub={r.sub}
                titleSize={17}
                subSize={12.5}
              />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Scripted cutover sequence                                        */
/* ------------------------------------------------------------------ */

interface CutoverStep {
  title: string;
  sub: string[];
  accent: DiagramAccent;
  emphasis?: boolean;
}

const CUTOVER_STEPS: readonly CutoverStep[] = [
  { title: "Preflight", sub: ["refuses to run if", "any session or", "memory job is up"], accent: "emerald" },
  { title: "Verified copy", sub: ["pre-migration", "backup, integrity", "check passed"], accent: "emerald" },
  { title: "Migration", sub: ["server upgrade,", "cannot be undone", "914 rows"], accent: "red", emphasis: true },
  { title: "Gates", sub: ["914 rows match", "867 embeddings", "smoke checks pass"], accent: "amber" },
  { title: "Hook swap", sub: ["recall in; nudge,", "checkpoint, old", "directive out"], accent: "amber" },
];

/**
 * The scripted cutover: two reversible steps, the one-way migration, then
 * the gates and the hook swap, all inside a dry-run-by-default runbook
 * that records state and a rollback for every step.
 */
export function CutoverSequenceDiagram({ caption }: DiagramProps) {
  const id = "hmod2cut";
  const x0 = 36;
  const pw = 150;
  const pitch = 180;
  const zoneY = 108;
  const panelY = zoneY + 48;
  const panelH = 124;
  const midY = panelY + panelH / 2;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The cutover runbook. Dry run is the default, every change needs --yes, and each step records its state and has a rollback. Preflight and a verified copy come before the one-way migration, and the lossless and smoke gates come after it, before the hooks are swapped."
      }
    >
      <EditorialFrame
        id={id}
        w={940}
        h={420}
        eyebrow="The Scripted Cutover"
        chips={[
          { label: "1 one-way step", accent: "red" },
          { label: "dry run by default", accent: "amber" },
        ]}
        footerRight="Preflight · migrate · gate · swap"
      >
        {/* Runbook container */}
        <rect
          x={14}
          y={62}
          width={912}
          height={310}
          rx={12}
          className="fill-foreground/[0.02] stroke-foreground/25"
          strokeWidth="1.25"
        />
        <SectionLabel x={28} y={88} label="cutover.sh runbook" accent="primary" />

        {/* Zones */}
        <rect
          x={26}
          y={zoneY}
          width={350}
          height={184}
          rx={10}
          className={`${DIAGRAM_ACCENTS.emerald.tintFill} ${DIAGRAM_ACCENTS.emerald.strokeSoft}`}
          strokeWidth="1"
        />
        <SectionLabel x={38} y={zoneY + 26} label="Reversible" accent="emerald" />
        <rect
          x={386}
          y={zoneY}
          width={170}
          height={184}
          rx={10}
          className={`${DIAGRAM_ACCENTS.red.softFill} ${DIAGRAM_ACCENTS.red.stroke}`}
          strokeWidth="1.5"
        />
        <SectionLabel x={398} y={zoneY + 26} label="No way back" accent="red" />
        <rect
          x={566}
          y={zoneY}
          width={350}
          height={184}
          rx={10}
          className={`${DIAGRAM_ACCENTS.amber.tintFill} ${DIAGRAM_ACCENTS.amber.strokeSoft}`}
          strokeWidth="1"
        />
        <SectionLabel x={578} y={zoneY + 26} label="Gates, then swap" accent="amber" />

        {/* Steps */}
        {CUTOVER_STEPS.map((s, i) => (
          <NodePanel
            key={s.title}
            x={x0 + i * pitch}
            y={panelY}
            w={pw}
            h={panelH}
            accent={s.accent}
            emphasis={s.emphasis}
            title={s.title}
            sub={s.sub}
            titleSize={17}
            subSize={12.5}
          />
        ))}
        {CUTOVER_STEPS.slice(0, -1).map((s, i) => (
          <FlowLine
            key={s.title}
            id={id}
            d={elbowPath(x0 + i * pitch + pw, midY, x0 + (i + 1) * pitch, midY)}
            accent={i === 1 ? "red" : i < 1 ? "emerald" : "amber"}
            width={2}
          />
        ))}
        {CUTOVER_STEPS.map((s, i) => (
          <StepBadge key={s.title} cx={x0 + i * pitch + pw / 2} cy={panelY} n={i + 1} accent={s.accent} />
        ))}

        {/* State ledger */}
        <NodePanel
          x={x0}
          y={zoneY + 196}
          w={868}
          h={56}
          accent="primary"
          align="left"
          title="State ledger and rollback"
          sub={["every step records its state first, so a rerun picks up where it stopped"]}
          titleSize={17}
          subSize={12.5}
        >
          <FitChip x={x0 + 868 - 14} y={zoneY + 196 + 16} label="order enforced" accent="emerald" filled anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}
