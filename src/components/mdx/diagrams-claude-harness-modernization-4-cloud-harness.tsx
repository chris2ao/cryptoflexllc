/** "Claude Harness Modernization, Part 4": editorial SVG diagrams for the portable cloud harness */

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

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return <DiagramLightbox caption={caption}>{children}</DiagramLightbox>;
}

/* ------------------------------------------------------------------ */
/* 1. Before and after                                                 */
/* ------------------------------------------------------------------ */

export function CloudHarnessBeforeAfterDiagram({ caption }: DiagramProps) {
  const id = "chm4a";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Before: a phone session ran on a cloud VM that never saw the Mac's ~/.claude, so it was stock Claude Code with the repo cloned in. After: the same VM receives two generated streams, one synced automatically and one uploaded once."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={440}
        eyebrow="Phone Session: Before and After"
        chips={[
          { label: "stock Claude Code", accent: "red" },
          { label: "2 streams", accent: "emerald" },
        ]}
        footerRight="Mac harness · cloud VM"
      >
        {/* BEFORE */}
        <SectionLabel x={24} y={84} label="Before" accent="red" />
        <NodePanel
          x={24}
          y={98}
          w={230}
          h={104}
          accent="primary"
          title="Mac ~/.claude"
          titleSize={17}
          subSize={12.5}
          sub={["rules · skills · agents", "hooks · learnings"]}
        />
        <FlowLine id={id} d="M254,150 L626,150" accent="red" dashed arrow={false} />
        <FitChip x={440} y={139} label="nothing crosses" accent="red" filled anchor="center" />
        <NodePanel
          x={626}
          y={98}
          w={230}
          h={104}
          accent="red"
          variant="dashed"
          title="Cloud VM"
          titleSize={17}
          subSize={12.5}
          sub={["stock Claude Code", "repo cloned, nothing else"]}
        />

        {/* AFTER */}
        <SectionLabel x={24} y={246} label="After" accent="emerald" />
        <NodePanel
          x={24}
          y={260}
          w={230}
          h={136}
          accent="primary"
          title="Mac ~/.claude"
          titleSize={17}
          subSize={12.5}
          sub={["read-only source", "built into two", "generated streams"]}
        />

        {/* Mac -> two streams */}
        <FlowLine id={id} d="M254,328 L294,328" accent="cyan" arrow={false} />
        <path d="M294,292 L294,364" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M294,292 L334,292" accent="cyan" />
        <FlowLine id={id} d="M294,364 L334,364" accent="amber" />

        <NodePanel
          x={336}
          y={260}
          w={212}
          h={64}
          accent="cyan"
          title="Plugin stream"
          titleSize={17}
          subSize={12.5}
          sub={["skills · agents · hooks"]}
        />
        <NodePanel
          x={336}
          y={332}
          w={212}
          h={64}
          accent="amber"
          title="Setup script"
          titleSize={17}
          subSize={12.5}
          sub={["rules · file-guard"]}
        />

        {/* streams -> VM */}
        <FlowLine id={id} d="M548,292 L586,292" accent="cyan" arrow={false} />
        <FlowLine id={id} d="M548,364 L586,364" accent="amber" arrow={false} />
        <path d="M586,292 L586,364" fill="none" className="stroke-emerald-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M586,328 L626,328" accent="emerald" />

        <NodePanel
          x={626}
          y={260}
          w={230}
          h={136}
          accent="emerald"
          emphasis
          terminal
          title="Cloud VM"
          titleSize={17}
          subSize={12.5}
          sub={["same harness", "as the Mac, minus", "the local-only parts"]}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Canary results matrix                                            */
/* ------------------------------------------------------------------ */

type Outcome = "startup" | "resume" | "partial" | "failed" | "none";

interface CanaryRow {
  id: string;
  label: string;
  outcome: Outcome;
  /** Also loaded at startup in the second session (ring marker). */
  ring?: boolean;
}

const CANARY_ROWS: CanaryRow[] = [
  { id: "H1", label: "CLAUDE.md appended by setup script", outcome: "startup" },
  { id: "H2", label: "Rules file written by setup script", outcome: "startup" },
  { id: "H3", label: "Skill written by setup script", outcome: "startup" },
  { id: "H4", label: "Agent written by setup script", outcome: "startup" },
  { id: "H5", label: "SessionStart hook merged by setup", outcome: "startup" },
  { id: "H6", label: "Skill uploaded to the account", outcome: "resume", ring: true },
  { id: "H7", label: "Plugin uploaded (skill, agent, hook)", outcome: "resume", ring: true },
  { id: "H8", label: "Skill committed in the repo", outcome: "none" },
  { id: "H9", label: "Setup script clones a private repo", outcome: "failed" },
  { id: "H10", label: "Second session keeps setup files", outcome: "partial" },
];

const CANARY_LANES: { key: Outcome; label: string; accent: DiagramAccent }[] = [
  { key: "startup", label: "Startup", accent: "emerald" },
  { key: "resume", label: "Resume", accent: "amber" },
  { key: "partial", label: "Partial", accent: "amber" },
  { key: "failed", label: "Failed", accent: "red" },
  { key: "none", label: "No report", accent: "muted" },
];

const LANE_X0 = 404;
const LANE_W = 92;

function laneCenter(index: number): number {
  return LANE_X0 + LANE_W * index + LANE_W / 2;
}

function CanaryMarker({ cx, cy, outcome }: { cx: number; cy: number; outcome: Outcome }) {
  if (outcome === "startup") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={9} className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="1.5" />
        <path
          d={`M${cx - 4},${cy} L${cx - 1},${cy + 3.5} L${cx + 4.5},${cy - 3.5}`}
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="2"
        />
      </g>
    );
  }
  if (outcome === "resume") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={9} className="fill-amber-500/20 stroke-amber-500" strokeWidth="1.5" />
        <path
          d={`M${cx - 4},${cy} L${cx - 1},${cy + 3.5} L${cx + 4.5},${cy - 3.5}`}
          fill="none"
          className="stroke-amber-500"
          strokeWidth="2"
        />
      </g>
    );
  }
  if (outcome === "partial") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={9} className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
        <path d={`M${cx},${cy - 9} A9,9 0 0 1 ${cx},${cy + 9} Z`} className="fill-amber-500" />
      </g>
    );
  }
  if (outcome === "failed") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={9} className="fill-red-500/20 stroke-red-500" strokeWidth="1.5" />
        <path
          d={`M${cx - 3.5},${cy - 3.5} L${cx + 3.5},${cy + 3.5} M${cx + 3.5},${cy - 3.5} L${cx - 3.5},${cy + 3.5}`}
          fill="none"
          className="stroke-red-500"
          strokeWidth="2"
        />
      </g>
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={9}
      fill="none"
      className="stroke-foreground/40"
      strokeWidth="1.5"
      strokeDasharray="3 3"
    />
  );
}

export function CloudCanaryMatrixDiagram({ caption }: DiagramProps) {
  const id = "chm4b";
  const rowH = 31;
  const top = 106;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Ten delivery paths, one planted token each. Everything the setup script wrote loaded at startup. The account skill and plugin arrived only after a resume in the first session, one path failed outright, and one came back partial."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={484}
        eyebrow="Canary Results: H1 to H10"
        chips={[
          { label: "10 hypotheses", accent: "primary" },
          { label: "1 hard fail", accent: "red" },
        ]}
        footerRight="One token per delivery path"
      >
        {/* Lane headers */}
        <rect x={24} y={62} width={832} height={32} rx={8} className="fill-foreground/[0.05]" />
        <text
          x={40}
          y={83}
          className="fill-muted-foreground font-mono font-semibold uppercase"
          style={{ fontSize: 12, letterSpacing: "0.1em" }}
        >
          Delivery path
        </text>
        {CANARY_LANES.map((lane, i) => (
          <text
            key={lane.key}
            x={laneCenter(i)}
            y={83}
            textAnchor="middle"
            className={`${DIAGRAM_ACCENTS[lane.accent].text} font-mono font-bold uppercase`}
            style={{ fontSize: 11.5, letterSpacing: "0.06em" }}
          >
            {lane.label}
          </text>
        ))}

        {/* Rows */}
        {CANARY_ROWS.map((row, i) => {
          const y = top + i * rowH;
          const cy = y + rowH / 2;
          const laneIndex = CANARY_LANES.findIndex((l) => l.key === row.outcome);
          return (
            <g key={row.id}>
              {i % 2 === 0 && (
                <rect x={24} y={y} width={832} height={rowH} rx={6} className="fill-foreground/[0.035]" />
              )}
              <text
                x={40}
                y={cy + 4.5}
                className="fill-primary font-mono font-bold"
                style={{ fontSize: 12.5 }}
              >
                {row.id}
              </text>
              <text
                x={84}
                y={cy + 4.5}
                className="fill-foreground font-mono"
                style={{ fontSize: 12.5 }}
              >
                {row.label}
              </text>
              {row.ring && (
                <circle
                  cx={laneCenter(0)}
                  cy={cy}
                  r={9}
                  fill="none"
                  className="stroke-emerald-500/70"
                  strokeWidth="1.5"
                  strokeDasharray="3 2.5"
                />
              )}
              <CanaryMarker cx={laneCenter(laneIndex)} cy={cy} outcome={row.outcome} />
            </g>
          );
        })}

        {/* Legend */}
        <circle
          cx={34}
          cy={top + CANARY_ROWS.length * rowH + 20}
          r={7}
          fill="none"
          className="stroke-emerald-500/70"
          strokeWidth="1.5"
          strokeDasharray="3 2.5"
        />
        <text
          x={50}
          y={top + CANARY_ROWS.length * rowH + 24.5}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12 }}
        >
          Dashed ring: also present at startup in the second session. H9: no git credentials in the setup script.
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Architecture                                                     */
/* ------------------------------------------------------------------ */

export function CloudHarnessArchitectureDiagram({ caption }: DiagramProps) {
  const id = "chm4c";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The live ~/.claude is only ever read. cloudbuild filters it through four checks, then emits two generated outputs: a plugin that claude.ai syncs automatically and a setup script uploaded once. Both land in the VM's ~/.claude."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={522}
        eyebrow="Architecture: Two Streams, One VM"
        chips={[
          { label: "read-only source", accent: "primary" },
          { label: "22 generated files", accent: "cyan" },
        ]}
        footerRight="cloudbuild · plugin · setup script"
      >
        {/* Source -> cloudbuild */}
        <NodePanel
          x={24}
          y={66}
          w={300}
          h={124}
          accent="primary"
          title="Live ~/.claude"
          titleSize={17}
          subSize={12.5}
          sub={["read-only source", "rules · skills · agents · hooks"]}
        />
        <FlowLine id={id} d="M324,128 L380,128" accent="primary" width={2} />
        <NodePanel
          x={380}
          y={66}
          w={476}
          h={124}
          accent="violet"
          emphasis
          terminal
          title="cloudbuild"
          titleSize={17}
          subSize={12.5}
          sub={[
            "allowlist · dependency scan",
            "secret gate · size guard",
            "any failure writes nothing",
          ]}
        />

        {/* Fan-out */}
        <FlowLine id={id} d="M618,190 L618,219" accent="muted" arrow={false} />
        <path d="M230,219 L650,219" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id={id} d={elbowPath(230, 219, 230, 248, "v")} accent="cyan" />
        <FlowLine id={id} d={elbowPath(650, 219, 650, 248, "v")} accent="amber" />

        <NodePanel
          x={24}
          y={248}
          w={412}
          h={106}
          accent="cyan"
          title="cjclaudin plugin"
          titleSize={17}
          subSize={12.5}
          sub={[
            "CJClaudin_Cloud marketplace",
            "skills · agents · learnings hook",
            "synced automatically by claude.ai",
          ]}
        />
        <NodePanel
          x={444}
          y={248}
          w={412}
          h={106}
          accent="amber"
          title="environment/setup.sh"
          titleSize={17}
          subSize={12.5}
          sub={[
            "cjclaudin environment",
            "rules · cloud CLAUDE.md · file-guard",
            "uploaded once, 64 KB limit",
          ]}
        />

        {/* Fan-in */}
        <FlowLine id={id} d="M230,354 L230,384" accent="muted" arrow={false} />
        <FlowLine id={id} d="M650,354 L650,384" accent="muted" arrow={false} />
        <path d="M230,384 L650,384" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id={id} d="M440,384 L440,414" accent="emerald" width={2} />

        <NodePanel
          x={24}
          y={414}
          w={832}
          h={64}
          accent="emerald"
          emphasis
          align="left"
          title="Cloud VM ~/.claude"
          titleSize={17}
          subSize={12.5}
          sub={["skills and agents appear as cjclaudin:brainstorming and friends"]}
        >
          <FitChip x={836} y={434} label="11 of 11 checks" accent="emerald" filled anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Secret gate                                                      */
/* ------------------------------------------------------------------ */

const GATES: { title: string; sub: string; accent: DiagramAccent }[] = [
  { title: "File checks", sub: "no symlinks, dotfiles, key names, NUL bytes, non-UTF-8", accent: "primary" },
  { title: "publish_detect scan", sub: "the harness's existing publish gate on every line", accent: "primary" },
  { title: "Literal secret values", sub: "17 values from ~/.claude/secrets, never allowlistable", accent: "red" },
  { title: "Line allowlist", sub: "sha256 of one line, added only after owner review", accent: "amber" },
  { title: "Dependency scan", sub: "no Mac-only scripts, MCP servers, or paths", accent: "violet" },
  { title: "Size guard", sub: "setup.sh under 61,440 bytes (platform limit 64 KB)", accent: "violet" },
];

export function CloudSecretGateDiagram({ caption }: DiagramProps) {
  const id = "chm4d";
  const x = 60;
  const w = 516;
  const h = 52;
  const gap = 12;
  const top = 68;
  const cys = GATES.map((_, i) => top + i * (h + gap) + h / 2);
  const outY = top + GATES.length * (h + gap);
  const midY = (cys[0] + cys[cys.length - 1]) / 2;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Six gates run in order on everything the build would ship. A hit from any of them stops the whole build before a single file is written. The literal-values gate cannot be allowlisted at all."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={outY + 52 + 44}
        eyebrow="The Secret Gate"
        chips={[
          { label: "6 gates", accent: "primary" },
          { label: "fail closed", accent: "red" },
        ]}
        footerRight="Any failure writes nothing"
      >
        {GATES.map((gate, i) => {
          const y = top + i * (h + gap);
          return (
            <g key={gate.title}>
              <StepBadge cx={36} cy={cys[i]} n={i + 1} accent={gate.accent} />
              <NodePanel
                x={x}
                y={y}
                w={w}
                h={h}
                accent={gate.accent}
                align="left"
                title={gate.title}
                titleSize={17}
                subSize={12.5}
                sub={[gate.sub]}
              />
              {i < GATES.length - 1 && (
                <FlowLine id={id} d={`M${x + w / 2},${y + h} L${x + w / 2},${y + h + gap}`} accent="emerald" />
              )}
              <FlowLine id={id} d={`M${x + w},${cys[i]} L608,${cys[i]}`} accent="red" dashed arrow={false} />
            </g>
          );
        })}

        {/* Pass */}
        <FlowLine
          id={id}
          d={`M${x + w / 2},${top + 5 * (h + gap) + h} L${x + w / 2},${outY}`}
          accent="emerald"
          width={2}
        />
        <NodePanel
          x={x}
          y={outY}
          w={w}
          h={52}
          accent="emerald"
          emphasis
          align="left"
          title="All six clear: write 22 files"
          titleSize={17}
          subSize={12.5}
          sub={["plugin, setup.sh, BUILD.json with a sha256 per file"]}
        />

        {/* Refuse */}
        <path d={`M608,${cys[0]} L608,${cys[cys.length - 1]}`} fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d={`M608,${midY} L640,${midY}`} accent="red" />
        <NodePanel
          x={640}
          y={midY - 86}
          w={216}
          h={172}
          accent="red"
          emphasis
          title="Build refused"
          titleSize={17}
          subSize={12.5}
          sub={["prints path:line", "and detector type,", "never the secret text.", "Nothing is written."]}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Update flow                                                      */
/* ------------------------------------------------------------------ */

const COL_W = 122;
const COL_GAP = 20;

function colX(i: number): number {
  return 24 + i * (COL_W + COL_GAP);
}

function colCx(i: number): number {
  return colX(i) + COL_W / 2;
}

export function CloudUpdateFlowDiagram({ caption }: DiagramProps) {
  const id = "chm4e";
  const laneAY = 96;
  const laneBY = 256;
  const nodeH = 76;
  const staleY = laneBY + nodeH + 40;
  const steps = [
    { title: "/sync", sub: "on the Mac" },
    { title: "publish", sub: "cloudbuild" },
    { title: "push", sub: "cloud repo" },
    { title: "auto-sync", sub: "claude.ai" },
  ];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "A skill edit rides the plugin and reaches the next session with no upload. A rule edit lives in the setup script, so it needs one re-upload, and sessions print a stale warning until it happens."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={staleY + 70 + 44}
        eyebrow="Updates Without Uploading"
        chips={[
          { label: "skill: 0 uploads", accent: "emerald" },
          { label: "rule: 1 upload", accent: "amber" },
        ]}
        footerRight="Skill edit · rule edit"
      >
        {/* Lane A */}
        <SectionLabel x={24} y={laneAY - 12} label="Skill edit" accent="emerald" />
        {steps.map((s, i) => (
          <NodePanel
            key={`a-${s.title}`}
            x={colX(i)}
            y={laneAY}
            w={COL_W}
            h={nodeH}
            accent={i === 3 ? "cyan" : "primary"}
            title={s.title}
            titleSize={17}
            subSize={12.5}
            sub={[s.sub]}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <FlowLine
            key={`al-${i}`}
            id={id}
            d={`M${colX(i) + COL_W},${laneAY + nodeH / 2} L${colX(i + 1)},${laneAY + nodeH / 2}`}
            accent="primary"
          />
        ))}
        <FlowLine
          id={id}
          d={`M${colX(3) + COL_W},${laneAY + nodeH / 2} L${colX(4)},${laneAY + nodeH / 2}`}
          accent="emerald"
          dashed
          arrow={false}
        />
        <NodePanel
          x={colX(4)}
          y={laneAY}
          w={COL_W}
          h={nodeH}
          accent="muted"
          variant="ghost"
          title="no upload"
          titleSize={17}
          subSize={12.5}
          sub={["nothing to do"]}
        />
        <FlowLine
          id={id}
          d={`M${colX(4) + COL_W},${laneAY + nodeH / 2} L${colX(5)},${laneAY + nodeH / 2}`}
          accent="emerald"
          dashed
        />
        <NodePanel
          x={colX(5)}
          y={laneAY}
          w={COL_W}
          h={nodeH}
          accent="emerald"
          emphasis
          title="next session"
          titleSize={16}
          subSize={12.5}
          sub={["has the edit"]}
        />

        <line x1={24} y1={laneBY - 52} x2={856} y2={laneBY - 52} className="stroke-border" strokeWidth="1" />

        {/* Lane B */}
        <SectionLabel x={24} y={laneBY - 12} label="Rule edit" accent="amber" />
        {steps.map((s, i) => (
          <NodePanel
            key={`b-${s.title}`}
            x={colX(i)}
            y={laneBY}
            w={COL_W}
            h={nodeH}
            accent={i === 3 ? "cyan" : "primary"}
            title={s.title}
            titleSize={17}
            subSize={12.5}
            sub={[s.sub]}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <FlowLine
            key={`bl-${i}`}
            id={id}
            d={`M${colX(i) + COL_W},${laneBY + nodeH / 2} L${colX(i + 1)},${laneBY + nodeH / 2}`}
            accent="primary"
          />
        ))}
        <FlowLine
          id={id}
          d={`M${colX(3) + COL_W},${laneBY + nodeH / 2} L${colX(4)},${laneBY + nodeH / 2}`}
          accent="amber"
        />
        <NodePanel
          x={colX(4)}
          y={laneBY}
          w={COL_W}
          h={nodeH}
          accent="amber"
          emphasis
          title="re-upload"
          titleSize={17}
          subSize={12.5}
          sub={["setup.sh once"]}
        />
        <FlowLine
          id={id}
          d={`M${colX(4) + COL_W},${laneBY + nodeH / 2} L${colX(5)},${laneBY + nodeH / 2}`}
          accent="amber"
        />
        <NodePanel
          x={colX(5)}
          y={laneBY}
          w={COL_W}
          h={nodeH}
          accent="emerald"
          emphasis
          title="next session"
          titleSize={16}
          subSize={12.5}
          sub={["has the edit"]}
        />

        {/* Stale warning between push and re-upload */}
        <FlowLine
          id={id}
          d={`M${colCx(2)},${laneBY + nodeH} L${colCx(2)},${staleY}`}
          accent="red"
          dashed
        />
        <NodePanel
          x={colX(2)}
          y={staleY}
          w={colX(4) + COL_W - colX(2)}
          h={70}
          accent="red"
          variant="dashed"
          title="Until the upload, sessions warn"
          titleSize={17}
          subSize={12.5}
          sub={["Cloud rules are stale"]}
        />
        <FlowLine
          id={id}
          d={`M${colCx(4)},${staleY} L${colCx(4)},${laneBY + nodeH}`}
          accent="amber"
          dashed
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}
