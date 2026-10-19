/** "Claude Harness Modernization, Part 3": editorial SVG diagrams for retiring Homunculus and building Plasticity */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
  StepBadge,
  DIAGRAM_ACCENTS,
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

/** A tinted band that groups a lane of panels, with its own border tone. */
function Band({
  y,
  h,
  tone,
}: {
  y: number;
  h: number;
  tone: "neutral" | "red" | "emerald";
}) {
  const stroke =
    tone === "red"
      ? "stroke-red-500/30"
      : tone === "emerald"
        ? "stroke-emerald-500/30"
        : "stroke-foreground/25";
  return (
    <rect
      x={14}
      y={y}
      width={892}
      height={h}
      rx={12}
      className={`fill-foreground/[0.02] ${stroke}`}
      strokeWidth="1.25"
    />
  );
}

/* ------------------------------------------------------------------ */
/* 1. The shape of Plasticity                                          */
/* ------------------------------------------------------------------ */

const STAGES = ["Learn", "Tune", "Grow", "Insights", "Health"] as const;

/**
 * The whole pipeline in three bands: per machine capture, the weekly hub
 * job and digest, then loading approved learnings back into sessions.
 * Band 2 runs right to left so every hand-off is a straight drop.
 */
export function PlasticityPipelineDiagram({ caption }: DiagramProps) {
  const id = "hmod3pipe";
  const b2y = 322;
  const b3y = 508;
  const loaderYs = [550, 612, 674] as const;
  const loaders = [
    { title: "Always-on block", sub: "session start, capped at 2,000 characters" },
    { title: "Situational", sub: "keywords and project, at most 3 per prompt" },
    { title: "Subagents", sub: "SubagentStart hook, same block as the parent" },
  ] as const;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The Plasticity pipeline. On each machine the SessionEnd hook archives transcripts and the 30-minute sweep makes one Haiku call per finished session, producing lessons, candidates and a lean log built in code. Spokes sync to the Mac hub through Syncthing, the weekly job runs five stages into a digest page, /learn apply writes approved learnings, and the recall hook loads them into sessions and subagents."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={790}
        eyebrow="The Shape of Plasticity"
        chips={[
          { label: "no per-call hooks", accent: "cyan" },
          { label: "owner approves", accent: "amber" },
        ]}
        footerRight="Capture · digest · apply · recall"
      >
        {/* BAND 1: every machine */}
        <Band y={62} h={244} tone="neutral" />
        <SectionLabel x={28} y={88} label="On every machine" accent="cyan" />
        <FitChip x={892} y={72} label="Mac · PC · MacBook Pro" accent="muted" anchor="end" />

        <NodePanel
          x={34}
          y={139}
          w={200}
          h={130}
          accent="cyan"
          title="SessionEnd archive"
          sub={["archives interactive", "session transcripts"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={282}
          y={139}
          w={250}
          h={130}
          accent="violet"
          emphasis
          terminal
          title="Extractor sweep"
          sub={["every 30 minutes", "one Haiku call per", "finished session"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M234,204 L282,204" accent="cyan" width={2} />
        <FlowLine id={id} d="M532,204 L564,204" accent="violet" arrow={false} />
        <FlowLine id={id} d="M564,140 L564,268" accent="violet" arrow={false} />
        <FlowLine id={id} d="M564,140 L596,140" accent="violet" />
        <FlowLine id={id} d="M564,204 L596,204" accent="violet" />
        <FlowLine id={id} d="M564,268 L596,268" accent="violet" />

        <NodePanel x={596} y={112} w={290} h={56} accent="cyan" title="Lessons" sub={["into vector memory, unchanged"]} titleSize={17} subSize={12.5} />
        <NodePanel x={596} y={176} w={290} h={56} accent="muted" title="Lean log" sub={["built in code, no model call"]} titleSize={17} subSize={12.5} />
        <NodePanel x={596} y={240} w={290} h={56} accent="amber" emphasis title="Candidates" sub={["correction, habit, gotcha, workflow"]} titleSize={17} subSize={12.5} />

        {/* Hand-off: candidates drop into the hub */}
        <FlowLine id={id} d={`M815,296 L815,${b2y + 50}`} accent="amber" width={2} />

        {/* BAND 2: Mac hub, weekly (runs right to left) */}
        <Band y={b2y} h={170} tone="neutral" />
        <SectionLabel x={28} y={b2y + 26} label="Mac hub, weekly" accent="violet" />
        <FitChip x={214} y={b2y + 10} label="Sundays 17:00" accent="violet" />

        <NodePanel
          x={726}
          y={b2y + 50}
          w={160}
          h={100}
          accent="cyan"
          title="Hub ingest"
          sub={["spokes send via", "Syncthing outbox", "acks flow back"]}
          titleSize={17}
          subSize={12.5}
        />
        <rect
          x={260}
          y={b2y + 50}
          width={440}
          height={100}
          rx={10}
          className={`${DIAGRAM_ACCENTS.violet.tintFill} ${DIAGRAM_ACCENTS.violet.strokeSoft}`}
          strokeWidth="1.25"
        />
        <SectionLabel x={272} y={b2y + 70} label="Five weekly stages" accent="violet" fontSize={11} />
        {STAGES.map((s, i) => (
          <NodePanel
            key={s}
            x={269 + i * 86}
            y={b2y + 84}
            w={78}
            h={52}
            accent="violet"
            title={s}
            titleSize={16}
          />
        ))}
        <NodePanel
          x={34}
          y={b2y + 50}
          w={200}
          h={100}
          accent="amber"
          emphasis
          title="Digest page"
          sub={["private artifact", "Approve, Reject,", "Defer, Edit"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d={`M726,${b2y + 100} L700,${b2y + 100}`} accent="violet" width={2} />
        <FlowLine id={id} d={`M260,${b2y + 100} L234,${b2y + 100}`} accent="violet" width={2} />

        {/* Hand-off: digest drops into apply */}
        <FlowLine id={id} d={`M170,${b2y + 150} L170,${b3y + 68}`} accent="amber" width={2} />

        {/* BAND 3: loading */}
        <Band y={b3y} h={236} tone="emerald" />
        <SectionLabel x={28} y={b3y + 26} label="Loading" accent="emerald" />
        <FitChip x={892} y={b3y + 10} label="604 of 2,000 chars in use" accent="emerald" anchor="end" />

        <NodePanel
          x={34}
          y={589}
          w={200}
          h={100}
          accent="amber"
          title="/learn apply"
          sub={["next interactive", "Mac session exports", "and applies decisions"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={262}
          y={589}
          w={170}
          h={100}
          accent="emerald"
          emphasis
          title="Learnings"
          sub={["owner-approved", "files in ~/.claude"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M234,639 L262,639" accent="amber" width={2} />
        <FlowLine id={id} d="M432,639 L452,639" accent="emerald" arrow={false} />
        <FlowLine id={id} d={`M452,${loaderYs[0] + 27} L452,${loaderYs[2] + 27}`} accent="emerald" arrow={false} />
        {loaderYs.map((y) => (
          <FlowLine key={y} id={id} d={`M452,${y + 27} L474,${y + 27}`} accent="emerald" />
        ))}
        {loaders.map((l, i) => (
          <NodePanel
            key={l.title}
            x={474}
            y={loaderYs[i]}
            w={412}
            h={54}
            accent="emerald"
            align="left"
            title={l.title}
            sub={[l.sub]}
            titleSize={17}
            subSize={12.5}
          />
        ))}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Homunculus before, Plasticity after                              */
/* ------------------------------------------------------------------ */

/**
 * Before: three barely connected parts and no path to a session. After:
 * one rectangular loop that ends with approved learnings in a session.
 */
export function HomunculusVsPlasticityDiagram({ caption }: DiagramProps) {
  const id = "hmod3loop";
  const beforeY = 116;
  const beforeH = 108;
  const midY = beforeY + beforeH / 2;
  const topY = 316;
  const botY = 460;
  const rowH = 84;
  const colX = [40, 350, 660] as const;
  const colW = 220;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Before, Homunculus was an observation hook, a pile of instinct files and an /evolve command that barely connected, with no path into a session. After, Plasticity is one closed loop: sessions feed an extractor, candidates go into a weekly digest, the owner approves, and the approved learnings are loaded back into sessions."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={604}
        eyebrow="Homunculus Before, Plasticity After"
        chips={[
          { label: "3 parts, 0 paths", accent: "red" },
          { label: "1 closed loop", accent: "emerald" },
        ]}
        footerRight="Observe · instincts · evolve → loop"
      >
        {/* BEFORE */}
        <Band y={62} h={188} tone="red" />
        <SectionLabel x={28} y={88} label="Before: Homunculus" accent="red" />

        <NodePanel x={30} y={beforeY} w={190} h={beforeH} accent="amber" title="Observation hook" sub={["209 MB on disk,", "nothing read it"]} titleSize={17} subSize={12.5} />
        <NodePanel x={242} y={beforeY} w={190} h={beforeH} accent="amber" title="79 instincts" sub={["no hook or rule", "ever loaded them"]} titleSize={17} subSize={12.5} />
        <NodePanel x={454} y={beforeY} w={190} h={beforeH} accent="amber" title="/evolve" sub={["4 runs, 7 skills,", "5 later archived"]} titleSize={17} subSize={12.5} />
        <NodePanel x={736} y={beforeY} w={154} h={beforeH} accent="muted" variant="dashed" title="A session" sub={["learns nothing", "from any of it"]} titleSize={17} subSize={12.5} />

        <FlowLine id={id} d={`M220,${midY} L242,${midY}`} accent="muted" dashed />
        <FlowLine id={id} d={`M432,${midY} L454,${midY}`} accent="muted" dashed />
        <FlowLine id={id} d={`M644,${midY} L736,${midY}`} accent="red" dashed />
        <FitChip x={690} y={midY - 38} label="no path" accent="red" filled anchor="center" />

        {/* AFTER */}
        <Band y={266} h={292} tone="emerald" />
        <SectionLabel x={28} y={292} label="After: Plasticity" accent="emerald" />

        <NodePanel x={colX[0]} y={topY} w={colW} h={rowH} accent="cyan" title="Sessions" sub={["Mac, PC, MacBook Pro", "SessionEnd archive"]} titleSize={17} subSize={12.5} />
        <NodePanel x={colX[1]} y={topY} w={colW} h={rowH} accent="violet" title="Extractor sweep" sub={["every 30 min, one", "Haiku call per session"]} titleSize={17} subSize={12.5} />
        <NodePanel x={colX[2]} y={topY} w={colW} h={rowH} accent="amber" title="Candidates" sub={["untrusted until", "you approve them"]} titleSize={17} subSize={12.5} />

        <NodePanel x={colX[2]} y={botY} w={colW} h={rowH} accent="violet" title="Weekly digest" sub={["Learn, Tune, Grow,", "Insights, Health"]} titleSize={17} subSize={12.5} />
        <NodePanel x={colX[1]} y={botY} w={colW} h={rowH} accent="amber" emphasis title="You approve" sub={["Approve, Reject,", "Defer, Edit"]} titleSize={17} subSize={12.5} />
        <NodePanel x={colX[0]} y={botY} w={colW} h={rowH} accent="emerald" emphasis title="Learnings loaded" sub={["always-on, situational,", "and into subagents"]} titleSize={17} subSize={12.5} />

        <FlowLine id={id} d={`M${colX[0] + colW},${topY + 42} L${colX[1]},${topY + 42}`} accent="cyan" width={2} />
        <FlowLine id={id} d={`M${colX[1] + colW},${topY + 42} L${colX[2]},${topY + 42}`} accent="violet" width={2} />
        <FlowLine id={id} d={`M${colX[2] + 110},${topY + rowH} L${colX[2] + 110},${botY}`} accent="amber" width={2} />
        <FlowLine id={id} d={`M${colX[2]},${botY + 42} L${colX[1] + colW},${botY + 42}`} accent="violet" width={2} />
        <FlowLine id={id} d={`M${colX[1]},${botY + 42} L${colX[0] + colW},${botY + 42}`} accent="amber" width={2} />
        <FlowLine id={id} d={`M${colX[0] + 110},${botY} L${colX[0] + 110},${topY + rowH}`} accent="emerald" width={2} />

        <FitChip x={460} y={topY + rowH + 16} label="the loop closes" accent="emerald" filled anchor="center" />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 3. The triage funnel                                                */
/* ------------------------------------------------------------------ */

interface Outcome {
  n: string;
  sub: string[];
  accent: DiagramAccent;
  emphasis?: boolean;
}

const OUTCOMES: readonly Outcome[] = [
  { n: "45", sub: ["learning changes", "3 always-on"], accent: "emerald", emphasis: true },
  { n: "274", sub: ["rejected", "means not now"], accent: "muted" },
  { n: "2", sub: ["deferred", "back every digest"], accent: "amber" },
  { n: "1", sub: ["failed", "unsafe-content"], accent: "red" },
  { n: "2", sub: ["tune edits", "to existing skills"], accent: "violet" },
];

/**
 * 324 proposals, one human-sized pass down to 15 themed decisions, then
 * the five outcomes of the apply step.
 */
export function ProposalFunnelDiagram({ caption }: DiagramProps) {
  const id = "hmod3funnel";
  const tileW = 160;
  const tilePitch = 172;
  const tileX0 = 36;
  const tileY = 352;
  const tileH = 100;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The first digest produced 324 proposals. After the owner refused to review that many, Claude grouped them into 15 themed decisions, the owner approved all 15, and all 324 decisions were applied: 45 learning changes, 274 rejected, 2 deferred, 1 failed and 2 tune edits."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={580}
        eyebrow="From 324 Proposals to 45 Changes"
        chips={[
          { label: "digest 2026-W42", accent: "cyan" },
          { label: "15 decisions", accent: "emerald" },
        ]}
        footerRight="Proposals · themes · apply"
      >
        <NodePanel
          x={70}
          y={84}
          w={780}
          h={84}
          accent="cyan"
          align="left"
          title="324 proposals"
          sub={["the first digest, from sessions and old instincts"]}
          titleSize={22}
          subSize={12.5}
        >
          <text
            x={520}
            y={104}
            className="fill-muted-foreground font-mono uppercase"
            style={{ fontSize: 11, letterSpacing: "0.12em" }}
          >
            pipeline recommended
          </text>
          <FitChip x={520} y={116} label="approve 66" accent="emerald" fontSize={12} />
          <FitChip x={632} y={116} label="reject 80" accent="muted" fontSize={12} />
          <FitChip x={734} y={116} label="defer 178" accent="amber" fontSize={12} />
        </NodePanel>

        <FlowLine id={id} d="M460,168 L460,212" accent="cyan" width={2} />
        <text x={476} y={196} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          owner: 15 at most, by theme
        </text>

        <NodePanel
          x={170}
          y={212}
          w={580}
          h={84}
          accent="emerald"
          emphasis
          align="left"
          title="15 themed decisions"
          sub={["Claude read every card and grouped them"]}
          titleSize={22}
          subSize={12.5}
        >
          <FitChip x={736} y={238} label="approved all 15" accent="emerald" filled anchor="end" />
        </NodePanel>

        {/* Bus to the outcomes */}
        <text x={476} y={322} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          apply: 324 decisions kept
        </text>
        <FlowLine id={id} d="M460,296 L460,332" accent="emerald" arrow={false} width={2} />
        <FlowLine
          id={id}
          d={`M${tileX0 + tileW / 2},332 L${tileX0 + 4 * tilePitch + tileW / 2},332`}
          accent="emerald"
          arrow={false}
          width={2}
        />
        {OUTCOMES.map((o, i) => (
          <FlowLine
            key={`${o.n}-${o.sub[0]}`}
            id={id}
            d={`M${tileX0 + i * tilePitch + tileW / 2},332 L${tileX0 + i * tilePitch + tileW / 2},${tileY}`}
            accent={o.accent === "muted" ? "emerald" : o.accent}
          />
        ))}
        {OUTCOMES.map((o, i) => (
          <NodePanel
            key={`${o.n}-${o.sub[0]}`}
            x={tileX0 + i * tilePitch}
            y={tileY}
            w={tileW}
            h={tileH}
            accent={o.accent}
            emphasis={o.emphasis}
            title={o.n}
            sub={o.sub}
            titleSize={30}
            subSize={12.5}
          />
        ))}

        <NodePanel
          x={36}
          y={474}
          w={848}
          h={56}
          accent="muted"
          variant="dashed"
          align="left"
          title="Rejected means not now"
          sub={["a rejected proposal returns only if new evidence appears"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Instinct review waffle                                           */
/* ------------------------------------------------------------------ */

interface Verdict {
  name: string;
  count: number;
  desc: string;
  accent: DiagramAccent;
}

const VERDICTS: readonly Verdict[] = [
  { name: "KEEP", count: 22, desc: "worth carrying forward", accent: "emerald" },
  { name: "KEEP-PROJECT", count: 10, desc: "kept for a specific project", accent: "cyan" },
  { name: "ENCODED", count: 16, desc: "already covered elsewhere", accent: "violet" },
  { name: "MERGE", count: 2, desc: "duplicates of another", accent: "primary" },
  { name: "STALE", count: 21, desc: "retired systems, outdated, fixed", accent: "amber" },
  { name: "WEAK", count: 8, desc: "too vague to act on", accent: "muted" },
];

const HARMFUL = [
  "settings-override-not-merge",
  "gmail-api-full-format",
  "imessage-storage-setting",
  "udmpro-doubled-hostname",
] as const;

/** One square per instinct, coloured by verdict, with a legend and the four harmful ones. */
export function InstinctReviewDiagram({ caption }: DiagramProps) {
  const id = "hmod3waffle";
  const cols = 10;
  const pitch = 36;
  const cell = 30;
  const x0 = 44;
  const y0 = 92;
  const legendX = 440;
  const rowPitch = 47;
  const cells = VERDICTS.flatMap((v) => Array.from({ length: v.count }, () => v.accent));
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The read-only review of all 79 instincts: 22 keep, 10 keep for a project, 16 already encoded elsewhere, 2 merges, 21 stale and 8 too weak. Four were wrong enough to cause harm if loaded into a session."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={568}
        eyebrow="79 Instincts, Read One by One"
        chips={[
          { label: "read-only review", accent: "cyan" },
          { label: "4 would harm", accent: "red" },
        ]}
        footerRight="Verdicts · 2026-10-17"
      >
        {cells.map((accent, i) => (
          <rect
            key={i}
            x={x0 + (i % cols) * pitch}
            y={y0 + Math.floor(i / cols) * pitch}
            width={cell}
            height={cell}
            rx={4}
            className={DIAGRAM_ACCENTS[accent].fill}
            opacity={0.85}
          />
        ))}
        <rect
          x={x0 + (cells.length % cols) * pitch}
          y={y0 + Math.floor(cells.length / cols) * pitch}
          width={cell}
          height={cell}
          rx={4}
          className="stroke-foreground/25"
          strokeWidth="1.25"
          strokeDasharray="4 3"
        />
        <text x={x0} y={y0 + 8 * pitch + 12} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          one square per instinct, 79 in all
        </text>

        {VERDICTS.map((v, i) => {
          const a = DIAGRAM_ACCENTS[v.accent];
          const ry = y0 + i * rowPitch;
          return (
            <g key={v.name}>
              <rect x={legendX} y={ry + 3} width={16} height={16} rx={3} className={a.fill} opacity={0.85} />
              <text x={legendX + 28} y={ry + 18} className={`${a.text} font-heading font-semibold`} style={{ fontSize: 17 }}>
                {v.name}
              </text>
              <text x={886} y={ry + 20} textAnchor="end" className={`${a.text} font-heading font-bold`} style={{ fontSize: 24 }}>
                {v.count}
              </text>
              <text x={legendX + 28} y={ry + 37} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
                {v.desc}
              </text>
              {i < VERDICTS.length - 1 && (
                <line x1={legendX} y1={ry + 44} x2={886} y2={ry + 44} className="stroke-border" strokeWidth="1" />
              )}
            </g>
          );
        })}

        <NodePanel
          x={30}
          y={418}
          w={860}
          h={104}
          accent="red"
          emphasis
          align="left"
          title="Four were wrong enough to cause harm"
          sub={["if they had been loaded into a session"]}
          titleSize={17}
          subSize={12.5}
        >
          {HARMFUL.map((name, i) => (
            <text
              key={name}
              x={i % 2 === 0 ? 470 : 690}
              y={i < 2 ? 460 : 492}
              className="fill-foreground font-mono"
              style={{ fontSize: 12.5 }}
            >
              {name}
            </text>
          ))}
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/* ------------------------------------------------------------------ */
/* 5. The canary check                                                 */
/* ------------------------------------------------------------------ */

interface CanaryMessage {
  from: number;
  to: number;
  label: string;
  sub: string;
  accent: DiagramAccent;
}

const LIFE_X = [150, 460, 770] as const;

const CANARY_MESSAGES: readonly CanaryMessage[] = [
  { from: 0, to: 1, label: "spawn Explore with the Agent tool", sub: "", accent: "cyan" },
  { from: 1, to: 2, label: "SubagentStart fires, 22 ms", sub: "payload has no task text", accent: "violet" },
  { from: 2, to: 1, label: "always-on block, learned 1", sub: "same block as the parent", accent: "emerald" },
  { from: 1, to: 0, label: "reply quotes the block", sub: "no PARENT-CANARY-7731 anywhere", accent: "amber" },
];

/** The M3 canary check as a three-lifeline sequence plus the verdict strip. */
export function SubagentCanaryDiagram({ caption }: DiagramProps) {
  const id = "hmod3canary";
  const rowY = (i: number) => 270 + i * 60;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The M3 canary check in a fresh session. The parent holds the always-on block and a canary string. A real Explore subagent triggers the SubagentStart hook, receives the always-on block, and reports that the parent's canary is nowhere in its context."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={604}
        eyebrow="The Canary Check"
        chips={[
          { label: "hook 22 ms", accent: "cyan" },
          { label: "no leak", accent: "emerald" },
        ]}
        footerRight="Parent · hook · subagent"
      >
        <NodePanel x={30} y={68} w={240} h={64} accent="cyan" title="Parent session" sub={["fresh, id 043deaa3"]} titleSize={17} subSize={12.5} />
        <NodePanel x={340} y={68} w={240} h={64} accent="violet" title="Subagent" sub={["Explore, entrypoint cli"]} titleSize={17} subSize={12.5} />
        <NodePanel x={650} y={68} w={240} h={64} accent="emerald" title="Recall hook" sub={["SubagentStart, timeout 3"]} titleSize={17} subSize={12.5} />

        {LIFE_X.map((x) => (
          <line
            key={x}
            x1={x}
            y1={132}
            x2={x}
            y2={476}
            className="stroke-foreground/25"
            strokeWidth="1.25"
            strokeDasharray="4 5"
          />
        ))}

        <NodePanel
          x={30}
          y={148}
          w={240}
          h={76}
          accent="amber"
          emphasis
          title="Parent holds both"
          sub={["always-on block, 208 ms", "PARENT-CANARY-7731"]}
          titleSize={17}
          subSize={12.5}
        />

        {CANARY_MESSAGES.map((m, i) => {
          const y = rowY(i);
          const x1 = LIFE_X[m.from];
          const x2 = LIFE_X[m.to];
          const dir = x2 > x1 ? 1 : -1;
          return (
            <g key={m.label}>
              <FlowLine id={id} d={`M${x1 + dir * 13},${y} L${x2},${y}`} accent={m.accent} width={2} />
              <text
                x={(x1 + x2) / 2 + dir * 6}
                y={y - 9}
                textAnchor="middle"
                className="fill-foreground font-mono"
                style={{ fontSize: 12.5 }}
              >
                {m.label}
              </text>
              {m.sub && (
                <text
                  x={(x1 + x2) / 2 + dir * 6}
                  y={y + 20}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono"
                  style={{ fontSize: 12.5 }}
                >
                  {m.sub}
                </text>
              )}
              <StepBadge cx={x1} cy={y} n={i + 1} accent={m.accent} />
            </g>
          );
        })}

        <NodePanel x={36} y={494} w={272} h={70} accent="emerald" emphasis title="Subagent got the block" sub={["same text as the parent"]} titleSize={17} subSize={12.5} />
        <NodePanel x={324} y={494} w={272} h={70} accent="emerald" title="No canary leak" sub={["subagent never saw", "PARENT-CANARY-7731"]} titleSize={17} subSize={12.5} />
        <NodePanel x={612} y={494} w={272} h={70} accent="cyan" title="Status line intact" sub={["recall: 3 after", "the Agent call"]} titleSize={17} subSize={12.5} />
      </EditorialFrame>
    </DiagramLightbox>
  );
}
