/** "Claude Harness Modernization, Part 1": editorial SVG diagrams */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
  DIAGRAM_ACCENTS,
  type DiagramAccent,
} from "./diagram-editorial";

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
function Chip({
  x,
  y,
  label,
  accent = "primary",
  filled = false,
  fontSize = 11.5,
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

interface DiagramProps {
  caption?: string;
}

interface PanelSpec {
  title: string;
  sub: string[];
  accent: DiagramAccent;
}

const HARNESS_ROW_ONE: readonly PanelSpec[] = [
  { title: "18 Skills", sub: ["+44 duplicate notes"], accent: "primary" },
  { title: "9 Commands", sub: ["legacy .md files"], accent: "primary" },
  { title: "26 Agents", sub: ["agent definitions"], accent: "primary" },
  { title: "2 Workflows", sub: ["workflow files"], accent: "primary" },
  { title: "15 Rules", sub: ["global rule files"], accent: "muted" },
];

const HARNESS_ROW_TWO: readonly PanelSpec[] = [
  { title: "11 Hooks", sub: ["bash + PS twins"], accent: "amber" },
  { title: "47 Scripts", sub: ["operational glue"], accent: "violet" },
  { title: "10 MCP servers", sub: ["external tools"], accent: "violet" },
  { title: "5 Plugins", sub: ["Claude Code add-ons"], accent: "violet" },
  { title: "1 Mod", sub: ["hook-layer extra"], accent: "violet" },
];

const MEMORY_SYSTEMS: readonly PanelSpec[] = [
  { title: "Auto memory", sub: ["built into", "Claude Code"], accent: "amber" },
  { title: "Vector memory", sub: ["an MCP server", "with a database"], accent: "amber" },
  { title: "Homunculus", sub: ["observations", "and instincts"], accent: "amber" },
  { title: "Session archive", sub: ["transcript backups", "and an index"], accent: "amber" },
];

/**
 * The harness before the audit: ten component families, four memory
 * systems with no precedence rule, and a Mac that syncs one-way to a PC.
 */
export function HarnessMapDiagram({ caption }: DiagramProps) {
  const chipLabel = "no rule for which one wins";
  const rightLabel = "send-only from the Mac";
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The harness at the start: ten kinds of component, four memory systems with no rule for which one wins, and two machines kept in step by a Syncthing folder that only sends from the Mac."
      }
    >
      <EditorialFrame
        id="hmod1map"
        w={920}
        h={572}
        eyebrow="The Harness Before the Audit"
        chips={[
          { label: "4 memory systems", accent: "amber" },
          { label: "2 machines", accent: "cyan" },
        ]}
        footerRight="Components · memory · sync"
      >
        {/* Mac host container */}
        <rect
          x={14}
          y={64}
          width={892}
          height={356}
          rx={12}
          className="fill-foreground/[0.02] stroke-foreground/25"
          strokeWidth="1.25"
        />
        <SectionLabel x={28} y={92} label="Mac: ~/.claude" accent="primary" />

        {HARNESS_ROW_ONE.map((p, i) => (
          <NodePanel
            key={p.title}
            x={28 + i * 175}
            y={108}
            w={164}
            h={58}
            accent={p.accent}
            title={p.title}
            sub={p.sub}
            titleSize={17}
            subSize={12.5}
          />
        ))}
        {HARNESS_ROW_TWO.map((p, i) => (
          <NodePanel
            key={p.title}
            x={28 + i * 175}
            y={176}
            w={164}
            h={58}
            accent={p.accent}
            title={p.title}
            sub={p.sub}
            titleSize={17}
            subSize={12.5}
          />
        ))}

        <SectionLabel x={28} y={268} label="Four ways to remember" accent="amber" />
        {MEMORY_SYSTEMS.map((p, i) => (
          <NodePanel
            key={p.title}
            x={28 + i * 219}
            y={280}
            w={206}
            h={80}
            accent={p.accent}
            title={p.title}
            sub={p.sub}
            titleSize={17}
            subSize={12.5}
          />
        ))}

        {/* Memory bus -> missing precedence rule */}
        {[0, 1, 2, 3].map((i) => (
          <FlowLine
            key={i}
            id="hmod1map"
            d={`M${131 + i * 219},360 L${131 + i * 219},376`}
            accent="amber"
            arrow={false}
          />
        ))}
        <FlowLine id="hmod1map" d="M131,376 L788,376" accent="amber" arrow={false} />
        <FlowLine id="hmod1map" d="M459.5,376 L459.5,386" accent="amber" arrow={false} />
        <Chip x={459.5} y={386} label={chipLabel} accent="amber" filled anchor="center" />

        {/* Mac -> PC sync */}
        <FlowLine id="hmod1map" d="M459.5,420 L459.5,462" accent="cyan" width={2} />
        <Chip x={442} y={430} label="Syncthing, LAN-only" accent="cyan" fontSize={11.5} anchor="end" />
        <Chip x={478} y={430} label={rightLabel} accent="muted" fontSize={11.5} />

        {/* PC */}
        <NodePanel
          x={14}
          y={462}
          w={892}
          h={64}
          accent="cyan"
          align="left"
          title="Windows PC"
          sub={["same harness, hooks run through PowerShell twins"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={890} y={482} label="receives only" accent="muted" fontSize={11.5} anchor="end" />
          <Chip x={754} y={482} label="Python 3.13" accent="cyan" fontSize={11.5} anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

const ROADMAP_STEPS: readonly {
  title: string;
  sub: string[];
  status: string;
  statusAccent: DiagramAccent;
  accent: DiagramAccent;
}[] = [
  { title: "SP0", sub: ["audit +", "the doctor"], status: "merged", statusAccent: "emerald", accent: "emerald" },
  { title: "SP1", sub: ["memory"], status: "live", statusAccent: "cyan", accent: "primary" },
  { title: "SP2", sub: ["consolidate", "skills, cmds,", "agents"], status: "not started", statusAccent: "muted", accent: "primary" },
  { title: "SP3", sub: ["hooks,", "settings,", "rules"], status: "not started", statusAccent: "muted", accent: "primary" },
  { title: "SP4", sub: ["hygiene:", "sync, git,", "installer"], status: "not started", statusAccent: "muted", accent: "primary" },
];

/**
 * Approach A: the doctor is built first, then four sub-projects run in
 * order. A diamond gate sits between each pair, enforced by the doctor
 * passing on both hosts.
 */
export function HarnessRoadmapDiagram({ caption }: DiagramProps) {
  const panelW = 124;
  const pitch = 188;
  const x0 = 22;
  const panelY = 100;
  const panelH = 140;
  const midY = panelY + panelH / 2;
  const bandY = 314;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Approach A: build the doctor first, then run four sub-projects in order. Nothing moves to the next sub-project until the doctor passes on both the Mac and the PC."
      }
    >
      <EditorialFrame
        id="hmod1road"
        w={920}
        h={510}
        eyebrow="Approach A: Doctor First"
        chips={[
          { label: "5 sub-projects", accent: "primary" },
          { label: "4 gates", accent: "emerald" },
        ]}
        footerRight="SP0 to SP4 · one gate between each"
      >
        <SectionLabel x={20} y={84} label="Build the doctor, then use it as the gate" accent="emerald" />

        {ROADMAP_STEPS.map((s, i) => {
          const x = x0 + i * pitch;
          return (
            <g key={s.title}>
              <NodePanel
                x={x}
                y={panelY}
                w={panelW}
                h={panelH}
                accent={s.accent}
                emphasis={i === 0}
                title={s.title}
                sub={s.sub}
                titleSize={20}
                subSize={12.5}
              />
              <Chip
                x={x + panelW / 2}
                y={panelY + panelH + 10}
                label={s.status}
                accent={s.statusAccent}
                filled={i < 2}
                anchor="center"
                fontSize={11}
              />
            </g>
          );
        })}

        {/* Gates between sub-projects */}
        {[0, 1, 2, 3].map((i) => {
          const left = x0 + i * pitch + panelW;
          const cx = left + (pitch - panelW) / 2;
          return (
            <g key={i}>
              <FlowLine id="hmod1road" d={`M${left},${midY} L${cx - 15},${midY}`} accent="primary" arrow={false} />
              <FlowLine id="hmod1road" d={`M${cx + 15},${midY} L${left + (pitch - panelW)},${midY}`} accent="primary" />
              <path
                d={`M${cx - 15},${midY} L${cx},${midY - 15} L${cx + 15},${midY} L${cx},${midY + 15} Z`}
                className="fill-emerald-500/15 stroke-emerald-500"
                strokeWidth="1.75"
              />
              <path
                d={`M${cx - 6},${midY} L${cx - 2},${midY + 4} L${cx + 6},${midY - 4}`}
                fill="none"
                className="stroke-emerald-500"
                strokeWidth="2.25"
              />
              <FlowLine
                id="hmod1road"
                d={`M${cx},${bandY} L${cx},${midY + 16}`}
                accent="emerald"
                dashed
              />
            </g>
          );
        })}

        {/* Doctor gate band */}
        <NodePanel
          x={20}
          y={bandY}
          w={880}
          h={78}
          accent="emerald"
          emphasis
          align="left"
          title="/harness-doctor is the gate"
          sub={["green on both hosts before the next sub-project may start"]}
          titleSize={18}
          subSize={12.5}
        >
          <Chip x={884} y={bandY + 27} label="Windows PC" accent="cyan" filled fontSize={12} anchor="end" />
          <Chip x={884 - fitChipWidth("Windows PC", 12) - 10} y={bandY + 27} label="Mac" accent="primary" filled fontSize={12} anchor="end" />
        </NodePanel>

        {/* Standing rule */}
        <NodePanel
          x={20}
          y={410}
          w={880}
          h={58}
          accent="amber"
          variant="dashed"
          align="left"
          title="Standing rule"
          sub={["no git operations inside ~/.claude until SP4"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={884} y={427} label="snapshot, log, then commit elsewhere" accent="amber" fontSize={11} anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

const CHECK_COLUMNS: readonly {
  check: PanelSpec;
  guard: PanelSpec;
  emphasis: boolean;
  guardEmphasis: boolean;
}[] = [
  {
    check: {
      title: "Static checks",
      sub: ["skills, agents, hooks,", "settings, rules, more", "69 checks, 20 modules"],
      accent: "cyan",
    },
    guard: { title: "known_schema.json", sub: ["from 7 research tracks"], accent: "muted" },
    emphasis: false,
    guardEmphasis: false,
  },
  {
    check: {
      title: "Hook sandbox",
      sub: ["throwaway home", "allowlisted env", "no-op shims"],
      accent: "amber",
    },
    guard: { title: "Sentinel scan", sub: ["canary in live state?", "a hit is critical"], accent: "red" },
    emphasis: true,
    guardEmphasis: true,
  },
  {
    check: {
      title: "MCP probe",
      sub: ["spawn each server", "handshake + tool list", "never calls a tool"],
      accent: "amber",
    },
    guard: { title: "Temp-store proof", sub: ["vector probe gated", "until it was proven"], accent: "muted" },
    emphasis: false,
    guardEmphasis: false,
  },
  {
    check: {
      title: "Usage counter",
      sub: ["every transcript", "30d, 90d, all time", "skills, agents, MCP"],
      accent: "cyan",
    },
    guard: { title: "Incremental cache", sub: ["a rerun skips what", "is already parsed"], accent: "muted" },
    emphasis: false,
    guardEmphasis: false,
  },
];

const ROUTES = ["SP0", "SP1", "SP2", "SP3", "SP4"] as const;

/**
 * The harness-doctor pipeline: one package fans out to four kinds of
 * check, each paired with the guard that keeps it honest, merges into
 * one structured result, and fans out to a report, a review page and a
 * route per finding.
 */
export function HarnessDoctorPipelineDiagram({ caption }: DiagramProps) {
  const colW = 205;
  const colPitch = 225;
  const colX = (i: number) => 20 + i * colPitch;
  const colCx = (i: number) => colX(i) + colW / 2;
  const topY = 64;
  const row1Y = 156;
  const row1H = 104;
  const row2Y = 286;
  const row2H = 76;
  const busY = 384;
  const resultY = 404;
  const resultH = 64;
  const outBusY = 488;
  const outY = 508;
  const outH = 116;
  const outW = 280;
  const outX = (i: number) => 20 + i * 300;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "One stdlib Python package runs static checks, a sandboxed hook run guarded by a sentinel scan, a handshake-only MCP probe and a transcript usage counter. Every check returns the same structured result, which becomes a markdown report, a private review page and a route to the sub-project that owns the fix."
      }
    >
      <EditorialFrame
        id="hmod1pipe"
        w={920}
        h={668}
        eyebrow="Inside /harness-doctor"
        chips={[
          { label: "stdlib Python", accent: "cyan" },
          { label: "69 checks", accent: "primary" },
        ]}
        footerRight="Check · guard · result · report · route"
      >
        {/* Entry */}
        <NodePanel
          x={20}
          y={topY}
          w={880}
          h={56}
          accent="primary"
          emphasis
          align="left"
          title="/harness-doctor"
          sub={["one skill wraps the package, run on the Mac and on the PC"]}
          titleSize={18}
          subSize={12.5}
        >
          <Chip x={884} y={topY + 16} label="Python 3.9+" accent="cyan" fontSize={11.5} anchor="end" />
        </NodePanel>

        {CHECK_COLUMNS.map((col, i) => (
          <g key={col.check.title}>
            <FlowLine id="hmod1pipe" d={`M${colCx(i)},${topY + 56} L${colCx(i)},${row1Y}`} accent="primary" />
            <NodePanel
              x={colX(i)}
              y={row1Y}
              w={colW}
              h={row1H}
              accent={col.check.accent}
              emphasis={col.emphasis}
              title={col.check.title}
              sub={col.check.sub}
              titleSize={17}
              subSize={12.5}
            />
            <FlowLine
              id="hmod1pipe"
              d={`M${colCx(i)},${row1Y + row1H} L${colCx(i)},${row2Y}`}
              accent={col.guardEmphasis ? "red" : "muted"}
              dashed={!col.guardEmphasis}
            />
            <NodePanel
              x={colX(i)}
              y={row2Y}
              w={colW}
              h={row2H}
              accent={col.guard.accent}
              emphasis={col.guardEmphasis}
              variant={col.guardEmphasis ? "solid" : "dashed"}
              title={col.guard.title}
              sub={col.guard.sub}
              titleSize={16}
              subSize={12.5}
            />
            <FlowLine
              id="hmod1pipe"
              d={`M${colCx(i)},${row2Y + row2H} L${colCx(i)},${busY}`}
              accent="muted"
              arrow={false}
            />
          </g>
        ))}

        {/* Merge bus -> structured result */}
        <FlowLine id="hmod1pipe" d={`M${colCx(0)},${busY} L${colCx(3)},${busY}`} accent="muted" arrow={false} />
        <FlowLine id="hmod1pipe" d={`M460,${busY} L460,${resultY}`} accent="primary" />
        <NodePanel
          x={170}
          y={resultY}
          w={580}
          h={resultH}
          accent="primary"
          emphasis
          title="One structured result per check"
          sub={["id, severity, status, redacted evidence, fix hint, route"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Fan-out to outputs */}
        <FlowLine id="hmod1pipe" d={`M460,${resultY + resultH} L460,${outBusY}`} accent="muted" arrow={false} />
        <FlowLine id="hmod1pipe" d={`M${outX(0) + outW / 2},${outBusY} L${outX(2) + outW / 2},${outBusY}`} accent="muted" arrow={false} />
        {[0, 1, 2].map((i) => (
          <FlowLine
            key={i}
            id="hmod1pipe"
            d={`M${outX(i) + outW / 2},${outBusY} L${outX(i) + outW / 2},${outY}`}
            accent={i === 2 ? "amber" : "muted"}
          />
        ))}
        <NodePanel
          x={outX(0)}
          y={outY}
          w={outW}
          h={outH}
          title="Markdown report"
          sub={["the permanent record", "pass, warn, fail, skip"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={outX(1)}
          y={outY}
          w={outW}
          h={outH}
          accent="emerald"
          title="Private review page"
          sub={["keep, archive, decide later", "one click per finding"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={outX(2)}
          y={outY}
          w={outW}
          h={outH}
          accent="amber"
          emphasis
          title="Routing"
          sub={["the owner of each fix"]}
          titleSize={17}
          subSize={12.5}
        >
          {ROUTES.map((r, i) => (
            <Chip
              key={r}
              x={outX(2) + 20 + i * 49}
              y={outY + 83}
              label={r}
              accent="amber"
              filled
              fontSize={11}
            />
          ))}
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}
