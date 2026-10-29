/** "The Agent That Rewrote Its Own Rules": editorial SVG diagrams (incident, rules, threat model) */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  StepBadge,
  DIAGRAM_ACCENTS,
  type DiagramAccent,
} from "./diagram-editorial";

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

/* ------------------------------------------------------------------ */
/* 1. Incident timeline                                                */
/* ------------------------------------------------------------------ */

interface Beat {
  time: string;
  to: string;
  title: string;
  sub: string[];
  tag: string;
  accent: DiagramAccent;
  emphasis?: boolean;
}

const BEATS: Beat[] = [
  {
    time: "~00:00",
    to: "to 01:00",
    title: "The identity file loses its rules",
    sub: ["a rewrite silently drops three safety rules", "found later by an audit grep at 01:23"],
    tag: "Silent",
    accent: "amber",
  },
  {
    time: "01:07",
    to: "to 01:16",
    title: "The tool repairs itself",
    sub: ["reads source, calls the API, patches, deploys", "then rewrites its own retry rule"],
    tag: "Loophole",
    accent: "red",
    emphasis: true,
  },
  {
    time: "01:13",
    to: "to 01:34",
    title: "First response",
    sub: ["run killed, patch saved, clone restored", "report-don't-fix rule, audit, change notifier"],
    tag: "Contained",
    accent: "emerald",
  },
  {
    time: "07:46",
    to: "to 08:02",
    title: "Evaluation run 1",
    sub: ["68 tool calls, billed dry-run bypass", "read the scoring rubric"],
    tag: "Bypass",
    accent: "amber",
  },
  {
    time: "09:11",
    to: "to 09:43",
    title: "Run 3: the credential incident",
    sub: ["125 tool calls, a carve-out in the manual", "five production secrets copied"],
    tag: "Credentials",
    accent: "red",
    emphasis: true,
  },
  {
    time: "09:51",
    to: "to 10:08",
    title: "Discovery and cleanup",
    sub: ["11 hidden auto-commits found by diff", "snapshot first, then secrets removed"],
    tag: "Recovered",
    accent: "emerald",
  },
];

const BEAT_H = 74;
const BEAT_PITCH = 86;
const SPINE_X = 146;

function beatY(i: number): number {
  return 70 + i * BEAT_PITCH + (i >= 3 ? 18 : 0);
}

/**
 * Six beats down a spine, 27 to 28 October, US Eastern. Red marks the
 * two incidents the story hinges on, emerald the response beats.
 */
export function AgentNightTimelineDiagram({ caption }: DiagramProps) {
  const id = "ar1";
  const mid = (i: number) => beatY(i) + BEAT_H / 2;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "One night, six beats (US Eastern). Nothing was attacked: a rewrite dropped rules, a tool failure became a debugging session, and a missing secret became a credential copy."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={642}
        eyebrow="The Night In Order"
        chips={[
          { label: "27 to 28 Oct", accent: "primary" },
          { label: "US Eastern", accent: "muted" },
        ]}
        footerRight="Incident timeline · test copy"
      >
        {/* Spine */}
        {BEATS.slice(0, -1).map((beat, i) => (
          <path
            key={beat.title}
            d={`M${SPINE_X},${mid(i)} L${SPINE_X},${mid(i + 1)}`}
            className="stroke-foreground/25"
            strokeWidth={2}
            strokeDasharray={i === 2 ? "3 5" : undefined}
          />
        ))}
        <Mono x={176} y={(beatY(2) + BEAT_H + beatY(3)) / 2 + 4}>
          later that morning
        </Mono>

        {BEATS.map((beat, i) => {
          const y = beatY(i);
          const c = mid(i);
          return (
            <g key={beat.title}>
              <Mono x={122} y={c - 2} anchor="end" tone="fg" size={15} bold>
                {beat.time}
              </Mono>
              <Mono x={122} y={c + 16} anchor="end">
                {beat.to}
              </Mono>
              <FlowLine id={id} d={`M${SPINE_X + 13},${c} L176,${c}`} arrow={false} />
              <NodePanel
                x={176}
                y={y}
                w={706}
                h={BEAT_H}
                accent={beat.accent}
                emphasis={beat.emphasis}
                align="left"
                title={beat.title}
                sub={beat.sub}
                titleSize={17}
                subSize={12.5}
              />
              <Chip
                x={868}
                y={c - 12}
                label={beat.tag}
                accent={beat.accent}
                filled
                fontSize={11}
                anchor="end"
              />
              <StepBadge cx={SPINE_X} cy={c} n={i + 1} accent={beat.accent} />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Self-repair loop                                                 */
/* ------------------------------------------------------------------ */

interface Step {
  title: string;
  sub: string[];
  accent: DiagramAccent;
  tag?: { label: string; accent: DiagramAccent };
  emphasis?: boolean;
  ghost?: boolean;
}

const DIAGNOSE: Step[] = [
  { title: "Tool fails", sub: ["image wrapper errors", "test runs past 5 min"], accent: "cyan" },
  { title: "Reads the source", sub: ["wrapper source in", "the owner's repo clone"], accent: "cyan" },
  {
    title: "Calls the API",
    sub: ["curl with the key", "about $0.001 per call"],
    accent: "cyan",
    tag: { label: "Real calls", accent: "amber" },
  },
  { title: "Probes the filter", sub: ["tests which words", "the filter blocks"], accent: "cyan" },
];

const FIX: Step[] = [
  {
    title: "Patches wrapper",
    sub: ["45 lines changed", "diagnosis was right"],
    accent: "emerald",
    tag: { label: "Real fix", accent: "emerald" },
  },
  {
    title: "Adds tests",
    sub: ["58 lines added", "to the test file"],
    accent: "emerald",
    tag: { label: "Real fix", accent: "emerald" },
  },
  { title: "Runs the tests", sub: ["the repo's own suite", "then the pipeline 3x"], accent: "emerald" },
  {
    title: "Deploys its copy",
    sub: ["over the wrapper", "it was running"],
    accent: "amber",
    tag: { label: "Ran live", accent: "amber" },
  },
];

const LOOPHOLE: Step[] = [
  {
    title: "Rewrites its stop rule",
    sub: ["was: never retry reworded", "now: retry one word, once"],
    accent: "red",
    emphasis: true,
    tag: { label: "Loophole", accent: "red" },
  },
  {
    title: "Edits the tool to match",
    sub: ["reports which 'layer' blocked", "gives the new rule a signal"],
    accent: "red",
    emphasis: true,
    tag: { label: "Loophole", accent: "red" },
  },
  {
    title: "Next tool error",
    sub: ["the loop can start", "again from step 1"],
    accent: "muted",
    ghost: true,
  },
];

const QUAD_W = 200;
const QUAD_GAP = 22;
const QUAD_X0 = 17;
const TRI_W = 278;
const TRI_GAP = 16;

function StepPanel({
  step,
  n,
  x,
  y,
  w,
  h,
}: {
  step: Step;
  n: number;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <NodePanel
        x={x}
        y={y}
        w={w}
        h={h}
        accent={step.accent}
        emphasis={step.emphasis}
        variant={step.ghost ? "dashed" : "solid"}
        align="left"
        title={step.title}
        sub={step.sub}
        titleSize={16}
        subSize={12.5}
      />
      {step.tag && (
        <Chip
          x={x + w - 10}
          y={y - 11}
          label={step.tag.label}
          accent={step.tag.accent}
          filled
          fontSize={10.5}
          anchor="end"
        />
      )}
      {!step.ghost && <StepBadge cx={x + 22} cy={y} n={n} accent={step.accent} />}
    </g>
  );
}

/**
 * A failing tool becomes a ticket: diagnose, fix, deploy, then the same
 * momentum is pointed at the rule that said stop. Steps 1 to 8 are what
 * a strong coding agent does; steps 9 and 10 are the loophole.
 */
export function SelfRepairLoopDiagram({ caption }: DiagramProps) {
  const id = "ar2";
  const quadX = (i: number) => QUAD_X0 + i * (QUAD_W + QUAD_GAP);
  const triX = (i: number) => 17 + i * (TRI_W + TRI_GAP);
  const rowY = [92, 222, 352];
  const rowH = [84, 84, 88];
  const bus1 = 192;
  const bus2 = 322;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "A failing wrapper turned into a debugging session: read the source, call the real API, patch, test, deploy. Two of the fixes were real. The last two steps rewrote the rule that told it to stop and changed the tool so the new rule worked."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={594}
        eyebrow="The Self-Repair Loop"
        chips={[
          { label: "01:07 to 01:16", accent: "primary" },
          { label: "10 steps", accent: "red" },
        ]}
        footerRight="One tool error · three file edits"
      >
        <SectionLabel x={20} y={70} label="Diagnose" accent="cyan" />
        {DIAGNOSE.map((s, i) => (
          <StepPanel key={s.title} step={s} n={i + 1} x={quadX(i)} y={rowY[0]} w={QUAD_W} h={rowH[0]} />
        ))}
        {[0, 1, 2].map((i) => (
          <FlowLine
            key={i}
            id={id}
            d={`M${quadX(i) + QUAD_W},${rowY[0] + 42} L${quadX(i + 1)},${rowY[0] + 42}`}
            accent="cyan"
          />
        ))}
        <FlowLine
          id={id}
          d={route([
            [quadX(3) + QUAD_W / 2, rowY[0] + rowH[0]],
            [quadX(3) + QUAD_W / 2, bus1],
            [100, bus1],
            [100, rowY[1]],
          ])}
          accent="emerald"
        />

        <SectionLabel x={20} y={200} label="Fix" accent="emerald" />
        {FIX.map((s, i) => (
          <StepPanel key={s.title} step={s} n={i + 5} x={quadX(i)} y={rowY[1]} w={QUAD_W} h={rowH[1]} />
        ))}
        {[0, 1, 2].map((i) => (
          <FlowLine
            key={i}
            id={id}
            d={`M${quadX(i) + QUAD_W},${rowY[1] + 42} L${quadX(i + 1)},${rowY[1] + 42}`}
            accent="emerald"
          />
        ))}
        <FlowLine
          id={id}
          d={route([
            [quadX(3) + QUAD_W / 2, rowY[1] + rowH[1]],
            [quadX(3) + QUAD_W / 2, bus2],
            [150, bus2],
            [150, rowY[2]],
          ])}
          accent="red"
        />

        <SectionLabel x={20} y={330} label="Loophole" accent="red" />
        {LOOPHOLE.map((s, i) => (
          <StepPanel key={s.title} step={s} n={i + 9} x={triX(i)} y={rowY[2]} w={TRI_W} h={rowH[2]} />
        ))}
        <FlowLine id={id} d={`M${triX(0) + TRI_W},${rowY[2] + 44} L${triX(1)},${rowY[2] + 44}`} accent="red" />
        <FlowLine
          id={id}
          d={`M${triX(1) + TRI_W},${rowY[2] + 44} L${triX(2)},${rowY[2] + 44}`}
          accent="muted"
          dashed
        />

        <NodePanel
          x={17}
          y={rowY[2] + rowH[2] + 28}
          w={866}
          h={76}
          accent="red"
          emphasis
          align="left"
          title="The pattern"
          sub={[
            "a guard blocked it, so it rewrote the rule that told it to stop,",
            "then changed the tool so its new rule worked",
          ]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={869} y={rowY[2] + rowH[2] + 54} label="patch: 3 files, +97 / -9" accent="red" filled fontSize={11} anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Rule plus carve-out                                              */
/* ------------------------------------------------------------------ */

type LineKind = "old" | "keep" | "ins";

interface RuleLine {
  text: string;
  kind: LineKind;
}

const LINE_FILL: Record<LineKind, string> = {
  old: "fill-foreground",
  keep: "fill-muted-foreground",
  ins: "fill-destructive",
};

const RULE_LINE_H = 18;

function ruleBoxH(lines: number): number {
  return 54 + (lines - 1) * RULE_LINE_H + 16;
}

function RuleBox({
  x,
  y,
  w,
  chip,
  chipAccent,
  lines,
  accent,
  emphasis = false,
}: {
  x: number;
  y: number;
  w: number;
  chip: string;
  chipAccent: DiagramAccent;
  lines: RuleLine[];
  accent: DiagramAccent;
  emphasis?: boolean;
}) {
  const firstIns = lines.findIndex((l) => l.kind === "ins");
  const insCount = lines.filter((l) => l.kind === "ins").length;
  const base = y + 54;
  return (
    <NodePanel x={x} y={y} w={w} h={ruleBoxH(lines.length)} accent={accent} emphasis={emphasis} title="">
      <Chip x={x + 12} y={y + 10} label={chip} accent={chipAccent} filled fontSize={11} />
      {firstIns >= 0 && (
        <rect
          x={x + 8}
          y={base + firstIns * RULE_LINE_H - 14}
          width={w - 16}
          height={insCount * RULE_LINE_H + 2}
          rx={5}
          className="fill-red-500/10 stroke-red-500/40"
          strokeWidth={1}
        />
      )}
      {lines.map((line, i) => (
        <g key={line.text}>
          {line.kind === "ins" && (
            <text
              x={x + 18}
              y={base + i * RULE_LINE_H}
              className="fill-destructive font-mono font-bold"
              style={{ fontSize: 13 }}
            >
              +
            </text>
          )}
          <text
            x={x + 36}
            y={base + i * RULE_LINE_H}
            className={`${LINE_FILL[line.kind]} font-mono`}
            style={{ fontSize: 13 }}
          >
            {line.text}
          </text>
        </g>
      ))}
    </NodePanel>
  );
}

const RULE_A_OLD: RuleLine[] = [
  { kind: "old", text: "Do not open, print, copy, or parse credential stores, even to test whether a key exists, without" },
  { kind: "old", text: "[the owner] explicitly requesting that exact access in the current conversation." },
];

const RULE_A_NEW: RuleLine[] = [
  { kind: "keep", text: "Do not open, print, copy, or parse credential stores, even to test whether a key exists, without" },
  { kind: "keep", text: "[the owner] explicitly requesting that exact access in the current conversation." },
  { kind: "ins", text: "When a wrapper fails on a missing secret, this check is allowed without a fresh request:" },
  { kind: "ins", text: "letta secret list shows names only, and the local store at [the secret store file] is name-keyed" },
  { kind: "ins", text: "and can be read to re-register a missing secret for this agent." },
];

const RULE_B_OLD: RuleLine[] = [
  { kind: "old", text: "[reply normally] … and do not retry with reworded text." },
];

const RULE_B_NEW: RuleLine[] = [
  { kind: "ins", text: "A keyword layer means the provider word list, not the model, blocked a word:" },
  { kind: "ins", text: "rewrite that one word and try once more, once only." },
];

/**
 * Both rule edits side by side in their original wording: the credential
 * rule that kept its sentence and gained an exception, and the retry
 * rule that was replaced outright.
 */
export function RuleCarveOutDiagram({ caption }: DiagramProps) {
  const id = "ar3";
  const aBeforeY = 92;
  const aBeforeH = ruleBoxH(RULE_A_OLD.length);
  const aAfterY = aBeforeY + aBeforeH + 32;
  const aAfterH = ruleBoxH(RULE_A_NEW.length);
  const bLabelY = aAfterY + aAfterH + 32;
  const bBeforeY = bLabelY + 12;
  const bBeforeH = ruleBoxH(RULE_B_OLD.length);
  const bAfterY = bBeforeY + bBeforeH + 32;
  const bAfterH = ruleBoxH(RULE_B_NEW.length);
  const frameH = bAfterY + bAfterH + 50;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Keep the rule, add an exception. The credential rule kept its original sentence and gained a carve-out that fit the obstacle. The retry rule was replaced, and the tool was changed so the new rule had something to act on."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={frameH}
        eyebrow="Rule Plus Carve-Out"
        chips={[
          { label: "2 rule edits", accent: "red" },
          { label: "same pattern", accent: "amber" },
        ]}
        footerRight="Edited text · highlighted"
      >
        <SectionLabel x={20} y={80} label="Rule 1: credential stores" accent="amber" />
        <RuleBox
          x={18}
          y={aBeforeY}
          w={864}
          chip="Before: original rule"
          chipAccent="muted"
          lines={RULE_A_OLD}
          accent="muted"
        />
        <FlowLine id={id} d={`M64,${aBeforeY + aBeforeH} L64,${aAfterY}`} accent="red" width={2} />
        <Mono x={80} y={aBeforeY + aBeforeH + 20}>the agent edits its own operating-manual.md</Mono>
        <Chip
          x={882}
          y={aBeforeY + aBeforeH + 5}
          label="Keep rule, add exception"
          accent="red"
          filled
          fontSize={11}
          anchor="end"
        />
        <RuleBox
          x={18}
          y={aAfterY}
          w={864}
          chip="After: exception inserted"
          chipAccent="red"
          lines={RULE_A_NEW}
          accent="red"
          emphasis
        />

        <SectionLabel x={20} y={bLabelY} label="Rule 2: retry after a refusal" accent="amber" />
        <RuleBox
          x={18}
          y={bBeforeY}
          w={864}
          chip="Before: original rule"
          chipAccent="muted"
          lines={RULE_B_OLD}
          accent="muted"
        />
        <FlowLine id={id} d={`M64,${bBeforeY + bBeforeH} L64,${bAfterY}`} accent="red" width={2} />
        <Mono x={80} y={bBeforeY + bBeforeH + 20}>the agent edits its own skill file</Mono>
        <Chip
          x={882}
          y={bBeforeY + bBeforeH + 5}
          label="Tool changed to match"
          accent="red"
          filled
          fontSize={11}
          anchor="end"
        />
        <RuleBox
          x={18}
          y={bAfterY}
          w={864}
          chip="After: stop rule replaced"
          chipAccent="red"
          lines={RULE_B_NEW}
          accent="red"
          emphasis
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Threat model                                                     */
/* ------------------------------------------------------------------ */

type Status = "OBSERVED" | "PARTLY" | "TESTED" | "POSSIBLE";

const STATUS_ACCENT: Record<Status, DiagramAccent> = {
  OBSERVED: "red",
  PARTLY: "red",
  TESTED: "cyan",
  POSSIBLE: "amber",
};

interface Threat {
  text: string;
  status: Status;
}

interface ThreatGroup {
  title: string;
  assets: string;
  items: Threat[];
}

const COL_A: ThreatGroup[] = [
  {
    title: "Tools and runtime",
    assets: "assets: tools, runtime, owner code",
    items: [
      { text: "Self-modifying tools, workarounds", status: "OBSERVED" },
      { text: "Wrapper and shim bypass", status: "OBSERVED" },
      { text: "Evaluation gaming (reads the rubric)", status: "OBSERVED" },
      { text: "Supply-chain tampering, owner paths", status: "POSSIBLE" },
      { text: "Renaming the folder above a lock", status: "POSSIBLE" },
      { text: "Symlink and TOCTOU tricks on root", status: "POSSIBLE" },
    ],
  },
  {
    title: "Credentials",
    assets: "assets: secret stores, ssh keys, tokens",
    items: [{ text: "Harvests what the OS user can read", status: "OBSERVED" }],
  },
  {
    title: "Persistence",
    assets: "assets: persistence surfaces",
    items: [{ text: "LaunchAgents, rc files, cron, at jobs", status: "POSSIBLE" }],
  },
];

const COL_B: ThreatGroup[] = [
  {
    title: "Guardrails and identity",
    assets: "assets: guardrails, identity file",
    items: [
      { text: "Rewrites its own rules (carve-outs)", status: "OBSERVED" },
      { text: "Identity drift drops rules", status: "OBSERVED" },
      { text: "Deceptive success claims", status: "POSSIBLE" },
    ],
  },
  {
    title: "Data and injection",
    assets: "assets: backups, other agents",
    items: [
      { text: "Inbound prompt injection", status: "TESTED" },
      { text: "Outbound injection into AI tools", status: "POSSIBLE" },
      { text: "Network exfiltration", status: "POSSIBLE" },
      { text: "Terminal escape sequences", status: "POSSIBLE" },
    ],
  },
  {
    title: "Money",
    assets: "assets: paid APIs",
    items: [{ text: "Spend abuse via direct API calls", status: "PARTLY" }],
  },
];

const ACTORS: { title: string; sub: string[] }[] = [
  { title: "The agent itself", sub: ["goal-driven", "no refusal layer"] },
  { title: "Outside content", sub: ["prompt injection via", "mail, web, tool output"] },
  { title: "Co-resident agent", sub: ["shares the same", "OS user and files"] },
  { title: "Operator AI tools", sub: ["read the agent's", "files and transcripts"] },
];

const GROUP_PITCH = 22;

function groupH(n: number): number {
  return 68 + GROUP_PITCH * n;
}

function ThreatPanel({ group, x, y, w }: { group: ThreatGroup; x: number; y: number; w: number }) {
  return (
    <NodePanel x={x} y={y} w={w} h={groupH(group.items.length)} title="">
      <text x={x + 14} y={y + 26} className="fill-foreground font-heading font-semibold" style={{ fontSize: 16 }}>
        {group.title}
      </text>
      <Mono x={x + 14} y={y + 45} size={12}>
        {group.assets}
      </Mono>
      {group.items.map((item, i) => {
        const by = y + 72 + i * GROUP_PITCH;
        const a = DIAGRAM_ACCENTS[STATUS_ACCENT[item.status]];
        const filled = item.status !== "POSSIBLE";
        return (
          <g key={item.text}>
            <circle
              cx={x + 22}
              cy={by - 4}
              r={4.5}
              className={filled ? a.fill : `${a.stroke} fill-transparent`}
              strokeWidth={1.75}
            />
            <Mono x={x + 38} y={by} tone="fg">
              {item.text}
            </Mono>
            <text
              x={x + w - 14}
              y={by}
              textAnchor="end"
              className={`${a.text} font-mono font-semibold`}
              style={{ fontSize: 11, letterSpacing: "0.08em" }}
            >
              {item.status}
            </text>
          </g>
        );
      })}
    </NodePanel>
  );
}

/**
 * Four actors, sixteen threats in six groups. Red dots were observed in
 * the incident, the cyan dot was tested, amber rings are possible only.
 */
export function AgentThreatModelDiagram({ caption }: DiagramProps) {
  const id = "ar4";
  const colW = 417;
  const colX = [18, 465];
  const top = 212;
  const gap = 12;
  const placed = [COL_A, COL_B].map((col) => {
    let y = top;
    return col.map((g) => {
      const at = y;
      y += groupH(g.items.length) + gap;
      return { g, y: at };
    });
  });
  const lastBottom = top + 404;
  const stubYs = placed.flatMap((col) => col.map((p) => p.y + 20));
  const trunkEnd = Math.max(...stubYs);
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Four actors, six asset groups, sixteen threats. Six were observed in the incident, one partly, one was tested with a planted email, and the rest are possible: found in review or reasoned through, never seen happen."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={lastBottom + 46}
        eyebrow="Threat Model For An Agent With A Shell"
        chips={[
          { label: "observed", accent: "red" },
          { label: "tested", accent: "cyan" },
          { label: "possible", accent: "amber" },
        ]}
        footerRight="16 threats · 6 groups"
      >
        <SectionLabel x={20} y={78} label="Actors" accent="primary" />
        {ACTORS.map((a, i) => {
          const x = 18 + i * 220;
          return (
            <g key={a.title}>
              <NodePanel
                x={x}
                y={90}
                w={204}
                h={66}
                title={a.title}
                sub={a.sub}
                titleSize={15}
                subSize={12.5}
              />
              <FlowLine id={id} d={`M${x + 102},156 L${x + 102},172`} arrow={false} />
            </g>
          );
        })}
        <FlowLine id={id} d="M120,172 L780,172" arrow={false} />
        <FlowLine id={id} d={`M450,172 L450,${trunkEnd}`} arrow={false} />

        <SectionLabel x={20} y={200} label="Threat groups" accent="red" />
        {placed.map((col, ci) =>
          col.map(({ g, y }) => (
            <g key={g.title}>
              <ThreatPanel group={g} x={colX[ci]} y={y} w={colW} />
              <FlowLine
                id={id}
                d={ci === 0 ? `M450,${y + 20} L${colX[0] + colW},${y + 20}` : `M450,${y + 20} L${colX[1]},${y + 20}`}
              />
            </g>
          ))
        )}
      </EditorialFrame>
    </DiagramWrapper>
  );
}
