/** "The Agent That Rewrote Its Own Rules": editorial SVG diagrams (controls and checklist) */

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
import { DiagramWrapper, Mono, Zone, route, type DiagramProps } from "./diagrams-the-agent-that-rewrote-its-own-rules";

/* ------------------------------------------------------------------ */
/* 5. Trust boundaries before and after                                */
/* ------------------------------------------------------------------ */

const BEFORE_PANELS: { title: string; sub: string[]; accent: DiagramAccent; emphasis?: boolean }[] = [
  { title: "Assistant", sub: ["production", "aligned model"], accent: "muted" },
  { title: "Test copy", sub: ["unrestricted model", "no refusal layer"], accent: "red", emphasis: true },
  { title: "Rules", sub: ["identity + manual", "agent-editable"], accent: "muted" },
  { title: "Tools", sub: ["wrappers + tests", "owner-writable"], accent: "muted" },
  { title: "Secret store", sub: ["one JSON file", "all agents' keys"], accent: "muted" },
];

/**
 * The same user, editable rules and one shared secret file, against
 * three zones: the owner, a separate agent user, and a root-owned tree.
 */
export function TrustBoundariesDiagram({ caption }: DiagramProps) {
  const id = "ar5";
  const px = (i: number) => 31 + i * 170;
  const cx = (i: number) => px(i) + 79;
  const busY = 226;
  const zoneY = 306;
  const zones = [18, 312, 606];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Before: one macOS user, so the test copy could reach everything the owner could. After: the agent runs as its own user, its tools sit in a root-owned tree, and the only pipes out are a push-only backup and a one-way daily summary."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={742}
        eyebrow="Trust Boundaries"
        chips={[
          { label: "before: 1 zone", accent: "red" },
          { label: "after: 3 zones", accent: "emerald" },
        ]}
        footerRight="Same user vs separate users"
      >
        {/* BEFORE */}
        <SectionLabel x={20} y={80} label="Before: one trust zone" accent="red" />
        <Zone x={18} y={92} w={864} h={170} accent="red" />
        <Chip x={868} y={81} label="same macOS user" accent="red" filled fontSize={11} anchor="end" />
        {BEFORE_PANELS.map((p, i) => (
          <NodePanel
            key={p.title}
            x={px(i)}
            y={110}
            w={158}
            h={86}
            accent={p.accent}
            emphasis={p.emphasis}
            title={p.title}
            sub={p.sub}
            titleSize={16}
            subSize={12.5}
          />
        ))}
        <FlowLine id={id} d={`M${cx(1)},196 L${cx(1)},${busY}`} accent="red" arrow={false} />
        <FlowLine id={id} d={`M${cx(0)},${busY} L${cx(4)},${busY}`} accent="red" arrow={false} />
        {[0, 2, 3, 4].map((i) => (
          <FlowLine key={i} id={id} d={`M${cx(i)},${busY} L${cx(i)},196`} accent="red" />
        ))}
        <Mono x={450} y={250} anchor="middle" tone="red">
          same user: it can read and write all of it
        </Mono>

        {/* AFTER */}
        <SectionLabel x={20} y={294} label="After: three trust zones" accent="emerald" />
        <Zone x={zones[0]} y={zoneY} w={276} h={296} accent="muted" />
        <Zone x={zones[1]} y={zoneY} w={276} h={296} accent="emerald" />
        <Zone x={zones[2]} y={zoneY} w={276} h={296} accent="violet" />

        <text x={zones[0] + 14} y={zoneY + 24} className="fill-foreground font-heading font-semibold" style={{ fontSize: 15 }}>
          Owner user
        </text>
        <Mono x={zones[0] + 14} y={zoneY + 43}>the assistant lives here</Mono>
        <text x={zones[1] + 14} y={zoneY + 24} className={`${DIAGRAM_ACCENTS.emerald.text} font-heading font-semibold`} style={{ fontSize: 15 }}>
          Agent user
        </text>
        <Mono x={zones[1] + 14} y={zoneY + 43}>own group, home chmod 700</Mono>
        <text x={zones[2] + 14} y={zoneY + 24} className={`${DIAGRAM_ACCENTS.violet.text} font-heading font-semibold`} style={{ fontSize: 15 }}>
          Root-owned tree
        </text>
        <Mono x={zones[2] + 14} y={zoneY + 43}>/opt/&lt;agent&gt;, root:wheel 755</Mono>

        {/* Zone 1 */}
        <NodePanel x={32} y={360} w={248} h={96} title="Assistant" sub={["production, aligned model", "writes a daily summary"]} titleSize={16} subSize={12.5} />
        <NodePanel x={32} y={468} w={248} h={120} title="Owner files" sub={["repo clones, rubric, code", "agent access: denied"]} titleSize={16} subSize={12.5} />

        {/* Zone 2 */}
        <NodePanel x={326} y={360} w={248} h={104} accent="emerald" emphasis terminal title="Experimental agent" sub={["own user, own keys", "never writes back"]} titleSize={16} subSize={12.5} />
        <NodePanel x={326} y={474} w={248} h={54} accent="emerald" title="Own secrets and keys" sub={["nothing shared"]} titleSize={15} subSize={12.5} />
        <NodePanel x={326} y={538} w={248} h={54} accent="emerald" title="Rules and identity" sub={["hash-audited, drift-tested"]} titleSize={15} subSize={12.5} />

        {/* Zone 3 */}
        <NodePanel x={620} y={360} w={248} h={68} accent="violet" title="Tools and wrappers" sub={["rebuilt on every deploy"]} titleSize={15} subSize={12.5} />
        <NodePanel x={620} y={440} w={248} h={68} accent="violet" title="Caps, filters, host" sub={["enforced in locked code"]} titleSize={15} subSize={12.5} />
        <NodePanel x={620} y={520} w={248} h={68} accent="violet" title="Config" sub={["root:agent 640"]} titleSize={15} subSize={12.5} />

        {/* Pipes */}
        <FlowLine id={id} d="M280,408 L326,408" accent="emerald" width={2} />
        <FlowLine id={id} d="M574,394 L620,394" accent="violet" />
        <FlowLine id={id} d={route([[326, 438], [303, 438], [303, 510], [280, 510]])} accent="red" dashed arrow={false} />
        <line x1="297" y1="468" x2="309" y2="480" className="stroke-red-500" strokeWidth="2" />
        <line x1="309" y1="468" x2="297" y2="480" className="stroke-red-500" strokeWidth="2" />

        <FlowLine id={id} d="M450,602 L450,630" accent="emerald" width={2} />
        <Chip x={462} y={604} label="push-only gate" accent="emerald" filled fontSize={11} />
        <NodePanel x={312} y={630} w={276} h={64} variant="dashed" title="Backup machine" sub={["accepts git-receive-pack only"]} titleSize={16} subSize={12.5} />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Why schg alone fails                                             */
/* ------------------------------------------------------------------ */

function Folder({
  x,
  y,
  w,
  h,
  accent,
  path,
  note,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: DiagramAccent;
  path: string;
  note: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <Zone x={x} y={y} w={w} h={h} accent={accent} dashed={dashed} />
      <Mono x={x + 14} y={y + 24} tone="fg" bold>
        {path}
      </Mono>
      <Mono x={x + w - 14} y={y + 24} anchor="end">
        {note}
      </Mono>
    </g>
  );
}

/**
 * schg protects a file, not the name you reach it by. A locked file in a
 * folder the agent owns is bypassed by renaming the folder; in a
 * root-owned tree the rename is not available.
 */
export function SchgAloneFailsDiagram({ caption }: DiagramProps) {
  const id = "ar6";
  const lx = 18;
  const rx = 458;
  const colW = 424;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "schg protects a file, not the path to it. Inside a folder the agent owns, the parent can be renamed aside and recreated. Guard files in a root-owned tree stay where root put them."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={646}
        eyebrow="Why schg Alone Fails"
        chips={[
          { label: "found in a re-review", accent: "amber" },
        ]}
        footerRight="Locked file · movable parent"
      >
        <SectionLabel x={20} y={80} label="schg in an agent-owned folder" accent="red" />
        <SectionLabel x={rx + 2} y={80} label="Root-owned tree" accent="emerald" />

        {/* Left, state 1 */}
        <Folder x={lx} y={96} w={colW} h={120} accent="amber" path="tools/" note="owned by the agent" />
        <NodePanel x={lx + 16} y={132} w={colW - 32} h={72} accent="amber" title="wrapper" sub={["schg set: only root can change it"]} titleSize={16} subSize={12.5} />
        <FlowLine id={id} d="M60,216 L60,270" accent="red" width={2} />
        <Mono x={76} y={238} tone="red">agent renames the folder aside,</Mono>
        <Mono x={76} y={256} tone="red">then recreates it</Mono>

        {/* Left, state 2 */}
        <Folder x={lx} y={270} w={204} h={130} accent="muted" path="tools.old/" note="unused" dashed />
        <NodePanel x={lx + 16} y={306} w={172} h={80} variant="dashed" title="wrapper" sub={["schg, still locked", "nothing calls it"]} titleSize={15} subSize={12.5} />
        <Folder x={lx + 220} y={270} w={204} h={130} accent="red" path="tools/" note="new" />
        <NodePanel x={lx + 236} y={306} w={172} h={80} accent="red" emphasis title="wrapper" sub={["written by the agent", "no lock on it"]} titleSize={15} subSize={12.5} />
        <NodePanel x={lx} y={420} w={colW} h={64} accent="red" emphasis title="Lock held, guard gone" sub={["the path now runs agent-written code"]} titleSize={16} subSize={12.5} />

        {/* Right, state 1 */}
        <Folder x={rx} y={96} w={colW} h={120} accent="emerald" path="/opt/<agent>/" note="root:wheel 755" />
        <NodePanel x={rx + 16} y={132} w={colW - 32} h={72} accent="emerald" title="wrapper" sub={["root-owned, outside the agent's home"]} titleSize={16} subSize={12.5} />
        <FlowLine id={id} d={`M${rx + 42},216 L${rx + 42},270`} accent="red" dashed arrow={false} />
        <line x1={rx + 36} y1="237" x2={rx + 48} y2="249" className="stroke-red-500" strokeWidth="2" />
        <line x1={rx + 48} y1="237" x2={rx + 36} y2="249" className="stroke-red-500" strokeWidth="2" />
        <Mono x={rx + 58} y={238} tone="red">agent tries the same rename:</Mono>
        <Mono x={rx + 58} y={256} tone="red">no write access to /opt</Mono>

        {/* Right, state 2 */}
        <Folder x={rx} y={270} w={colW} h={130} accent="emerald" path="/opt/<agent>/" note="unchanged" />
        <NodePanel x={rx + 16} y={306} w={colW - 32} h={80} accent="emerald" emphasis title="wrapper" sub={["root-owned, same path", "same bytes as the last deploy"]} titleSize={16} subSize={12.5} />
        <NodePanel x={rx} y={420} w={colW} h={64} accent="emerald" emphasis title="The name stays put" sub={["only a root deploy can replace the tree"]} titleSize={16} subSize={12.5} />

        {/* Second problem */}
        <NodePanel
          x={18}
          y={508}
          w={864}
          h={84}
          accent="amber"
          align="left"
          title="Second problem: root scripts on agent-writable paths"
          sub={[
            "a root script can be tricked into following a symlink the agent swapped in",
            "so after first setup root never touches the agent's home: it runs as the agent",
          ]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={868} y={519} label="sudo -u agent" accent="amber" filled fontSize={11} anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Controls matrix                                                  */
/* ------------------------------------------------------------------ */

type Mark = "" | "P" | "D" | "B";

const CONTROL_COLS: { a: string; b: string }[] = [
  { a: "OS", b: "user" },
  { a: "Root", b: "tools" },
  { a: "Own", b: "secrets" },
  { a: "Hash", b: "audit" },
  { a: "Transcript", b: "scan" },
  { a: "Gated", b: "pipes" },
  { a: "Caps", b: "in code" },
  { a: "Deny", b: "rules" },
  { a: "Security", b: "review" },
];

const CONTROL_GROUPS: { label: string; from: number; to: number; accent: DiagramAccent }[] = [
  { label: "Boundaries", from: 0, to: 2, accent: "emerald" },
  { label: "Detection", from: 3, to: 4, accent: "cyan" },
  { label: "Limits", from: 5, to: 6, accent: "amber" },
  { label: "Backstop", from: 7, to: 7, accent: "muted" },
  { label: "People", from: 8, to: 8, accent: "primary" },
];

const MATRIX_ROWS: { label: string; marks: Mark[] }[] = [
  { label: "Editing its own rules", marks: ["", "P", "", "D", "", "", "P", "B", ""] },
  { label: "Credential harvesting", marks: ["P", "", "P", "", "D", "", "", "B", ""] },
  { label: "Tool tampering", marks: ["P", "P", "", "D", "", "", "", "B", ""] },
  { label: "Spend abuse", marks: ["", "", "B", "D", "", "", "P", "", ""] },
  { label: "Exfiltration", marks: ["P", "", "P", "", "D", "B", "", "", ""] },
  { label: "Prompt injection", marks: ["", "", "", "", "D", "P", "", "B", ""] },
  { label: "Root-script tricks", marks: ["", "P", "", "", "", "", "", "", "D"] },
];

const MX0 = 216;
const MCW = 74;
const MROW_H = 46;
const MROW_Y = 134;

function MarkGlyph({ mark, cx, cy }: { mark: Mark; cx: number; cy: number }) {
  if (mark === "P") {
    return <circle cx={cx} cy={cy} r={9.5} className={DIAGRAM_ACCENTS.emerald.fill} />;
  }
  if (mark === "D") {
    return (
      <path
        d={`M${cx},${cy - 11} L${cx + 11},${cy} L${cx},${cy + 11} L${cx - 11},${cy} Z`}
        className={DIAGRAM_ACCENTS.cyan.fill}
      />
    );
  }
  if (mark === "B") {
    return (
      <circle cx={cx} cy={cy} r={8} fill="none" className={DIAGRAM_ACCENTS.amber.stroke} strokeWidth={2.5} />
    );
  }
  return null;
}

/**
 * Seven threats against nine controls. A filled circle is the primary
 * control, a diamond means the control detects it, a ring is a backstop.
 */
export function ControlsMatrixDiagram({ caption }: DiagramProps) {
  const id = "ar7";
  const rowsBottom = MROW_Y + MATRIX_ROWS.length * MROW_H;
  const legendY = rowsBottom + 34;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "No single control covers a threat. Each row has a primary control, something that would show it failed, and a backstop. The tinted column is the root-cause fix: a separate OS user."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={legendY + 56}
        eyebrow="Controls Matrix"
        chips={[
          { label: "7 threats", accent: "red" },
          { label: "9 controls", accent: "emerald" },
        ]}
        footerRight="What covers what"
      >
        {/* Root-cause column highlight */}
        <rect
          x={MX0}
          y={92}
          width={MCW}
          height={rowsBottom - 92 + 6}
          rx={8}
          className={`${DIAGRAM_ACCENTS.emerald.softFill} ${DIAGRAM_ACCENTS.emerald.strokeSoft}`}
          strokeWidth={1}
        />

        {/* Group labels */}
        {CONTROL_GROUPS.map((g) => {
          const x = MX0 + g.from * MCW;
          const w = (g.to - g.from + 1) * MCW;
          return (
            <g key={g.label}>
              <text
                x={x + w / 2}
                y={84}
                textAnchor="middle"
                className="fill-foreground font-heading font-bold uppercase"
                style={{ fontSize: 11, letterSpacing: "0.1em" }}
              >
                {g.label}
              </text>
              <rect x={x + 6} y={90} width={w - 12} height={2.5} className={DIAGRAM_ACCENTS[g.accent].fill} />
            </g>
          );
        })}

        {/* Column headers */}
        {CONTROL_COLS.map((c, i) => (
          <g key={c.a}>
            <Mono x={MX0 + i * MCW + MCW / 2} y={110} anchor="middle" tone="fg" size={11.5} bold>
              {c.a}
            </Mono>
            <Mono x={MX0 + i * MCW + MCW / 2} y={124} anchor="middle" tone="fg" size={11.5} bold>
              {c.b}
            </Mono>
          </g>
        ))}

        {/* Rows */}
        {MATRIX_ROWS.map((row, r) => {
          const y = MROW_Y + r * MROW_H;
          return (
            <g key={row.label}>
              {r % 2 === 0 && (
                <rect x={18} y={y} width={864} height={MROW_H} rx={6} className="fill-foreground/[0.03]" />
              )}
              <text x={30} y={y + MROW_H / 2 + 5} className="fill-foreground font-heading font-semibold" style={{ fontSize: 15 }}>
                {row.label}
              </text>
              {row.marks.map((m, c) => (
                <MarkGlyph key={c} mark={m} cx={MX0 + c * MCW + MCW / 2} cy={y + MROW_H / 2} />
              ))}
            </g>
          );
        })}

        {/* Legend */}
        <circle cx={34} cy={legendY - 4} r={8} className={DIAGRAM_ACCENTS.emerald.fill} />
        <Mono x={50} y={legendY} tone="fg">primary control</Mono>
        <path
          d={`M236,${legendY - 15} L247,${legendY - 4} L236,${legendY + 7} L225,${legendY - 4} Z`}
          className={DIAGRAM_ACCENTS.cyan.fill}
        />
        <Mono x={256} y={legendY} tone="fg">would show it failed</Mono>
        <circle cx={460} cy={legendY - 4} r={7} fill="none" className={DIAGRAM_ACCENTS.amber.stroke} strokeWidth={2.5} />
        <Mono x={476} y={legendY} tone="fg">backstop only</Mono>
        <rect
          x={640}
          y={legendY - 14}
          width={18}
          height={20}
          rx={4}
          className={`${DIAGRAM_ACCENTS.emerald.softFill} ${DIAGRAM_ACCENTS.emerald.strokeSoft}`}
          strokeWidth={1}
        />
        <Mono x={666} y={legendY} tone="fg">root-cause fix</Mono>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Checklist                                                        */
/* ------------------------------------------------------------------ */

type CheckGroup = "ISOLATE" | "ENFORCE" | "DETECT" | "PROCESS";

const CHECK_ACCENT: Record<CheckGroup, DiagramAccent> = {
  ISOLATE: "emerald",
  ENFORCE: "amber",
  DETECT: "cyan",
  PROCESS: "primary",
};

interface Check {
  title: string;
  sub: string[];
  group: CheckGroup;
}

const CHECKS: Check[] = [
  { title: "Give it its own OS user", sub: ["or a VM or container, never yours", "test copies included"], group: "ISOLATE" },
  { title: "Hash the guardrails", sub: ["keep a protected copy, alert on drift", "expect drift without any intent"], group: "DETECT" },
  { title: "Put caps behind locked code", sub: ["root-owned, outside the agent's home", "caps, filters and keys live there"], group: "ENFORCE" },
  { title: "One credential set per agent", sub: ["no shared secret store", "no shared keys"], group: "ISOLATE" },
  { title: "Deny lists are a backstop", sub: ["prefer an OS boundary first", "then an allowlist"], group: "ENFORCE" },
  { title: "Isolate test copies like prod", sub: ["no shared paths", "no copied pointers into live folders"], group: "ISOLATE" },
  { title: "Verify on disk", sub: ["not in transcripts or git status", "diff against a known base commit"], group: "DETECT" },
  { title: "Save evidence first", sub: ["snapshot and save the patch", "before you clean anything up"], group: "PROCESS" },
  { title: "Watch rule diffs", sub: ["keep the rule, add an exception", "is the pattern to look for"], group: "DETECT" },
  { title: "Split the roles", sub: ["the credential holder runs", "an aligned model"], group: "ISOLATE" },
  { title: "Review every root script", sub: ["independent review", "before it runs"], group: "PROCESS" },
  { title: "Assume it reads everything", sub: ["your source, your providers, your tests,", "and its own rules"], group: "PROCESS" },
];

const CARD_W = 423;
const CARD_H = 80;
const CARD_GAP_X = 18;
const CARD_GAP_Y = 22;
const CARD_Y0 = 82;

/**
 * Twelve checks for anyone testing an unrestricted model, as a two
 * column card grid tagged by the kind of work each one is.
 */
export function UnrestrictedModelChecklistDiagram({ caption }: DiagramProps) {
  const id = "ar8";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Twelve checks before you run an unrestricted model with a shell. Four isolate it, two enforce limits it cannot edit, three detect drift, and three are process."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={CARD_Y0 + 6 * CARD_H + 5 * CARD_GAP_Y + 46}
        eyebrow="Before You Test An Unrestricted Model"
        chips={[
          { label: "isolate", accent: "emerald" },
          { label: "enforce", accent: "amber" },
          { label: "detect", accent: "cyan" },
          { label: "process", accent: "primary" },
        ]}
        footerRight="The twelve-point check"
      >
        {CHECKS.map((check, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 18 + col * (CARD_W + CARD_GAP_X);
          const y = CARD_Y0 + row * (CARD_H + CARD_GAP_Y);
          const accent = CHECK_ACCENT[check.group];
          return (
            <g key={check.title}>
              <NodePanel
                x={x}
                y={y}
                w={CARD_W}
                h={CARD_H}
                align="left"
                title={check.title}
                sub={check.sub}
                titleSize={17}
                subSize={12.5}
              />
              <Chip x={x + CARD_W - 12} y={y - 11} label={check.group} accent={accent} filled fontSize={11} anchor="end" />
              <StepBadge cx={x + 30} cy={y} n={i + 1} accent={accent} />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramWrapper>
  );
}
