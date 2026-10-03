/** "What 202 Subagents Taught Me About Code Review": editorial SVG diagrams */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
  StepBadge,
  elbowPath,
  type DiagramAccent,
} from "./diagram-editorial";

/**
 * Chip with uppercase letter spacing accounted for. The base Chip sizes
 * its pill from the plain mono advance, so long labels spill past the
 * border; this one adds a letter-spacing allowance.
 */
function Chip(props: {
  x: number;
  y: number;
  label: string;
  accent?: DiagramAccent;
  filled?: boolean;
  fontSize?: number;
  anchor?: "start" | "end";
}) {
  const fs = props.fontSize ?? 10;
  const w = props.label.length * fs * 0.7 + 22;
  const h = fs + 11;
  const a = props.accent ?? "primary";
  const rx = props.anchor === "end" ? props.x - w : props.x;
  return (
    <g>
      <rect
        x={rx}
        y={props.y}
        width={w}
        height={h}
        rx={5}
        className={CHIP_RECT[a][props.filled ? 1 : 0]}
        strokeWidth="1"
      />
      <text
        x={rx + w / 2}
        y={props.y + h / 2 + fs * 0.36}
        textAnchor="middle"
        className={`${CHIP_TEXT[a]} font-mono font-semibold uppercase`}
        style={{ fontSize: fs, letterSpacing: "0.08em" }}
      >
        {props.label}
      </text>
    </g>
  );
}

const CHIP_RECT: Record<DiagramAccent, [string, string]> = {
  primary: ["fill-surface-1/80 stroke-primary/50", "fill-primary/10 stroke-primary"],
  cyan: ["fill-surface-1/80 stroke-cyan-500/50", "fill-cyan-500/10 stroke-cyan-500"],
  emerald: ["fill-surface-1/80 stroke-emerald-500/50", "fill-emerald-500/10 stroke-emerald-500"],
  amber: ["fill-surface-1/80 stroke-amber-500/50", "fill-amber-500/10 stroke-amber-500"],
  red: ["fill-surface-1/80 stroke-red-500/50", "fill-red-500/10 stroke-red-500"],
  violet: ["fill-surface-1/80 stroke-violet-500/50", "fill-violet-500/10 stroke-violet-500"],
  muted: ["fill-surface-1/80 stroke-foreground/25", "fill-foreground/5 stroke-foreground/40"],
};

const CHIP_TEXT: Record<DiagramAccent, string> = {
  primary: "fill-primary",
  cyan: "fill-cyan-600",
  emerald: "fill-success",
  amber: "fill-warning",
  red: "fill-destructive",
  violet: "fill-violet-500",
  muted: "fill-muted-foreground",
};


interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return <DiagramLightbox caption={caption}>{children}</DiagramLightbox>;
}

/** A tinted lane that groups one phase of the pipeline. */
function Lane({ y, h }: { y: number; h: number }) {
  return (
    <rect
      x={16}
      y={y}
      width={868}
      height={h}
      rx={12}
      className="fill-foreground/[0.025] stroke-foreground/15"
      strokeWidth={1}
    />
  );
}

/**
 * The whole build as one snake. Lane 1 (left to right): owner, controller,
 * plan head, two plan writers. Lane 2 (right to left): implementer and
 * reviewer in a fix loop capped at five rounds, parked items to the
 * backlog. Lane 3 (left to right): two parallel final reviews, one fix
 * wave, a controller-only deploy. Rails on the left and right edges carry
 * the hand-offs between lanes.
 */
export function ControllerPipelineDiagram({ caption }: DiagramProps) {
  const id = "wsa1";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "One controller session ran the whole build. Plans were written and proven once per phase, every task went through an implementer and reviewer loop capped at five fix rounds, and each phase ended with two parallel reviews, one fix wave, and a deploy only the controller ran."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={684}
        eyebrow="The Build Pipeline"
        chips={[
          { label: "202 subagents", accent: "primary" },
          { label: "1 controller", accent: "cyan" },
        ]}
        footerRight="Plan · build · review · deploy"
      >
        {/* ---------- Lane 1: plan ---------- */}
        <Lane y={62} h={170} />
        <SectionLabel x={56} y={86} label="1 · Plan, once per phase" accent="cyan" fontSize={13} />
        <Chip x={844} y={68} label="Rulings carry cost if wrong" accent="cyan" fontSize={11} anchor="end" />

        <NodePanel
          x={56}
          y={112}
          w={120}
          h={92}
          title="Owner"
          titleSize={17}
          subSize={12.5}
          sub={["answers Q&A", "owner steps"]}
        />
        <FlowLine id={id} d="M176,158 L204,158" accent="muted" />
        <NodePanel
          x={206}
          y={112}
          w={170}
          h={92}
          accent="primary"
          emphasis
          title="Controller"
          titleSize={17}
          subSize={12.5}
          sub={["Opus 5.5 session", "plans, dispatches,", "reviews, deploys"]}
        />
        <FlowLine id={id} d="M376,158 L404,158" accent="primary" />
        <NodePanel
          x={406}
          y={112}
          w={180}
          h={92}
          accent="cyan"
          title="Plan head"
          titleSize={17}
          subSize={12.5}
          sub={["goal + constraints", "5 hostile inputs", "rulings + costs"]}
        />

        {/* Plan head -> two plan writers (bus fan-out) */}
        <path d="M586,158 L603,158" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <path d="M603,125 L603,191" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M603,125 L618,125" accent="cyan" />
        <FlowLine id={id} d="M603,191 L618,191" accent="cyan" />
        <NodePanel
          x={620}
          y={98}
          w={224}
          h={54}
          accent="cyan"
          title="Plan writer A"
          titleSize={17}
          subSize={12.5}
          sub={["Opus, proven in scratch"]}
        />
        <NodePanel
          x={620}
          y={164}
          w={224}
          h={54}
          accent="cyan"
          title="Plan writer B"
          titleSize={17}
          subSize={12.5}
          sub={["Opus, proven in scratch"]}
        />

        {/* Right rail: writers -> lane 2 */}
        <path d="M844,125 L864,125" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <path d="M844,191 L864,191" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d={elbowPath(864, 125, 846, 350, "v")} accent="cyan" />

        {/* ---------- Lane 2: build loop ---------- */}
        <Lane y={250} h={196} />
        <SectionLabel x={56} y={274} label="2 · Build, per task" accent="amber" fontSize={13} />
        <Chip x={844} y={256} label="Fix loop capped at 5" accent="amber" filled fontSize={11} anchor="end" />

        <NodePanel
          x={620}
          y={288}
          w={224}
          h={124}
          accent="violet"
          title="Sonnet implementer"
          titleSize={17}
          subSize={12.5}
          sub={["test-first task", "own git worktree", "one ledger per plan"]}
        />
        <NodePanel
          x={306}
          y={288}
          w={224}
          h={124}
          accent="amber"
          emphasis
          title="Reviewer"
          titleSize={17}
          subSize={12.5}
          sub={["Sonnet, Opus if risky", "re-review: fix diff only", "minors parked, not fixed"]}
        />

        {/* The loop between implementer and reviewer */}
        <FlowLine id={id} d="M620,326 L530,326" accent="violet" />
        <text
          x={575}
          y={318}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          diff
        </text>
        <FlowLine id={id} d="M530,374 L620,374" accent="amber" dashed />
        <text
          x={575}
          y={366}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          fix round
        </text>

        {/* Reviewer -> backlog / task closed (bus fan-out) */}
        <path d="M306,350 L276,350" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M276,316 L276,384" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id={id} d="M276,316 L248,316" accent="muted" dashed />
        <FlowLine id={id} d="M276,384 L248,384" accent="emerald" />
        <NodePanel
          x={56}
          y={288}
          w={190}
          h={56}
          variant="dashed"
          title="Backlog"
          titleSize={16}
          subSize={12.5}
          sub={["parked, with a target"]}
        />
        <NodePanel
          x={56}
          y={356}
          w={190}
          h={56}
          accent="emerald"
          title="Task closed"
          titleSize={16}
          subSize={12.5}
          sub={["review came back clean"]}
        />
        <text
          x={56}
          y={434}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          rounds 1-3 resume the implementer · 4-5 fresh, stronger model · round 5 open: controller rules
        </text>

        {/* Left rail: task closed -> lane 3 */}
        <FlowLine id={id} d={elbowPath(56, 384, 36, 596, "h")} accent="emerald" arrow={false} />
        <FlowLine id={id} d="M36,528 L54,528" accent="emerald" />
        <FlowLine id={id} d="M36,596 L54,596" accent="emerald" />

        {/* ---------- Lane 3: finish ---------- */}
        <Lane y={464} h={176} />
        <SectionLabel x={56} y={488} label="3 · Finish, per phase" accent="emerald" fontSize={13} />
        <Chip x={844} y={470} label="Two seats in parallel" accent="amber" filled fontSize={11} anchor="end" />

        <NodePanel
          x={56}
          y={500}
          w={240}
          h={56}
          accent="amber"
          title="Whole-branch review"
          titleSize={16}
          subSize={12.5}
          sub={["Opus, reads and probes"]}
        />
        <NodePanel
          x={56}
          y={568}
          w={240}
          h={56}
          accent="red"
          title="Security review"
          titleSize={16}
          subSize={12.5}
          sub={["Opus, separate seat"]}
        />

        {/* Reviews -> fix wave (bus fan-in) */}
        <path d="M296,528 L316,528" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M296,596 L316,596" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M316,528 L316,596" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id={id} d="M316,562 L334,562" accent="violet" />
        <NodePanel
          x={336}
          y={500}
          w={210}
          h={124}
          accent="violet"
          title="One fix wave"
          titleSize={17}
          subSize={12.5}
          sub={["findings fixed once", "rebase, then the gates", "fast-forward merge"]}
        />
        <FlowLine id={id} d="M546,562 L578,562" accent="emerald" />
        <NodePanel
          x={580}
          y={500}
          w={264}
          h={124}
          accent="emerald"
          emphasis
          terminal
          title="Controller-only deploy"
          titleSize={17}
          subSize={12.5}
          sub={["rollback copy first", "lost-row check after", "any migration"]}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * The same three Jellyfin bootstrap calls against the test fake and the
 * real server. The fake accepted everything; the real server answered 404,
 * worked, and 403. The fix, in order, sits beneath.
 */
export function FakeVsRealServerDiagram({ caption }: DiagramProps) {
  const id = "wsa2";
  const rows = [
    {
      y: 98,
      call: "First POST",
      callSub: "POST /Startup/User",
      fake: "Accepted",
      fakeSub: "accepts it unconditionally",
      real: "404",
      realSub: "until a GET has run",
      realAccent: "red" as const,
    },
    {
      y: 192,
      call: "GET, then POST",
      callSub: "GET /Startup/User, then POST",
      fake: "Accepted",
      fakeSub: "order is never checked",
      real: "Works",
      realSub: "the sequence the server wants",
      realAccent: "emerald" as const,
    },
    {
      y: 286,
      call: "POST again",
      callSub: "after an interrupted setup",
      fake: "Accepted",
      fakeSub: "no repeat rule modeled",
      real: "403",
      realSub: "setup dead-ends, no restart",
      realAccent: "red" as const,
    },
  ];
  const steps = [
    { n: 1, title: "GET first", sub: ["GET /Startup/User", "unlocks the POST"] },
    { n: 2, title: "Seal the password", sub: ["before the POST", "a re-run reuses it"] },
    { n: 3, title: "Then POST", sub: ["create the admin user", "on the real server"] },
    { n: 4, title: "403 on re-run only", sub: ["accepted only when", "re-running a setup"] },
  ];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The same three bootstrap calls against the test fake and the real Jellyfin 12.1.0. The fake accepted every one, the real server answered 404, worked, and then 403 on a repeat. The fix did the GET first, sealed the password, and accepted a 403 only on a re-run."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={624}
        eyebrow="The Fake That Was Kinder"
        chips={[
          { label: "Critical", accent: "red" },
          { label: "Phase 1b", accent: "muted" },
        ]}
        footerRight="Test fake vs real server"
      >
        {/* Column headers */}
        <SectionLabel x={24} y={84} label="Test fake" accent="emerald" />
        <Chip x={264} y={67} label="190/190 green" accent="emerald" fontSize={11} anchor="end" />
        <SectionLabel x={316} y={84} label="The call" accent="muted" />
        <SectionLabel x={636} y={84} label="Real Jellyfin 12.1.0" accent="red" />

        {rows.map((r) => {
          const mid = r.y + 39;
          return (
            <g key={r.call}>
              <NodePanel
                x={24}
                y={r.y}
                w={240}
                h={78}
                accent="emerald"
                title={r.fake}
                titleSize={18}
                subSize={12.5}
                sub={[r.fakeSub]}
              />
              <FlowLine id={id} d={`M314,${mid} L266,${mid}`} accent="emerald" />
              <NodePanel
                x={316}
                y={r.y}
                w={268}
                h={78}
                accent="primary"
                title={r.call}
                titleSize={17}
                subSize={12.5}
                sub={[r.callSub]}
              />
              <FlowLine id={id} d={`M586,${mid} L634,${mid}`} accent={r.realAccent} />
              <NodePanel
                x={636}
                y={r.y}
                w={240}
                h={78}
                accent={r.realAccent}
                emphasis={r.realAccent === "red"}
                title={r.real}
                titleSize={18}
                subSize={12.5}
                sub={[r.realSub]}
              />
            </g>
          );
        })}

        {/* Verdict strip */}
        <NodePanel
          x={24}
          y={386}
          w={852}
          h={56}
          accent="red"
          align="left"
          title="Green suite, dead first install"
          titleSize={17}
          subSize={12.5}
          sub={["found by a reviewer that started a real Jellyfin in a scratch directory"]}
        >
          <Chip x={862} y={403} label="95.2% coverage" accent="muted" fontSize={11} anchor="end" />
        </NodePanel>

        {/* The fix, in order */}
        <SectionLabel x={24} y={478} label="The fix, in order" accent="emerald" />
        <Chip x={876} y={462} label="acd843f" accent="emerald" fontSize={11} anchor="end" />
        {steps.map((s, i) => {
          const x = 24 + i * 219;
          return (
            <g key={s.title}>
              <NodePanel
                x={x}
                y={496}
                w={195}
                h={80}
                accent="emerald"
                title={s.title}
                titleSize={16}
                subSize={12.5}
                sub={s.sub}
              />
              <StepBadge cx={x + 14} cy={496} n={s.n} accent="emerald" />
              {i < steps.length - 1 && (
                <FlowLine id={id} d={`M${x + 195},536 L${x + 217},536`} accent="emerald" />
              )}
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * Commits per day across the six-day build, with the two owner messages
 * that changed the pace annotated.
 */
export function CommitsPerDayDiagram({ caption }: DiagramProps) {
  const id = "wsa3";
  const base = 360;
  const scale = 1.25;
  const bars = [
    { date: "09-27", n: 17 },
    { date: "09-28", n: 30 },
    { date: "09-29", n: 21 },
    { date: "09-30", n: 57 },
    { date: "10-01", n: 166 },
    { date: "10-02", n: 170 },
  ];
  const barX = (i: number) => 95 + i * 134;
  const barW = 84;
  const grid = [50, 100, 150];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Commits per day, 09-27 to 10-02. The jump follows the 10-01 message that gave the controller standing authority to plan, build, merge and deploy: 57 commits on 09-30, 166 on 10-01, 170 on 10-02."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={456}
        eyebrow="Commits Per Day"
        chips={[
          { label: "461 commits", accent: "primary" },
          { label: "6 days", accent: "muted" },
        ]}
        footerRight="git log · author dates"
      >
        {/* Gridlines and axis */}
        {grid.map((g) => (
          <g key={g}>
            <line
              x1={70}
              y1={base - g * scale}
              x2={876}
              y2={base - g * scale}
              className="stroke-foreground/15"
              strokeWidth={1}
              strokeDasharray="4 5"
            />
            <text
              x={60}
              y={base - g * scale + 4}
              textAnchor="end"
              className="fill-muted-foreground font-mono"
              style={{ fontSize: 12 }}
            >
              {g}
            </text>
          </g>
        ))}
        <line x1={70} y1={base} x2={876} y2={base} className="stroke-border" strokeWidth={1.5} />

        {/* Bars */}
        {bars.map((b, i) => {
          const hot = i === 4;
          const h = b.n * scale;
          return (
            <g key={b.date}>
              <rect
                x={barX(i)}
                y={base - h}
                width={barW}
                height={h}
                rx={6}
                className={
                  hot
                    ? "fill-amber-500/20 stroke-amber-500"
                    : "fill-cyan-500/10 stroke-cyan-500/60"
                }
                strokeWidth={hot ? 2 : 1.25}
              />
              <text
                x={barX(i) + barW / 2}
                y={base - h - 10}
                textAnchor="middle"
                className={`${hot ? "fill-warning" : "fill-foreground"} font-heading font-bold`}
                style={{ fontSize: 18 }}
              >
                {b.n}
              </text>
              <text
                x={barX(i) + barW / 2}
                y={base + 24}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                style={{ fontSize: 13 }}
              >
                {b.date}
              </text>
            </g>
          );
        })}

        {/* Annotation: the 10-01 message */}
        <NodePanel
          x={96}
          y={66}
          w={330}
          h={68}
          accent="amber"
          emphasis
          align="left"
          title="10-01, 02:23 EDT"
          titleSize={16}
          subSize={12.5}
          sub={['"Get me to production"', "standing authority (D-091)"]}
        />
        <FlowLine id={id} d={elbowPath(426, 100, barX(4) + barW / 2, 122, "h")} accent="amber" />

        {/* Annotation: the 09-29 slow-down */}
        <NodePanel
          x={255}
          y={182}
          w={300}
          h={62}
          accent="muted"
          align="left"
          title="09-29, 21:57 EDT"
          titleSize={16}
          subSize={12.5}
          sub={['"slow down, tell me exactly"', "owner steps, one part at a time"]}
        />
        <FlowLine id={id} d={`M${barX(2) + barW / 2},244 L${barX(2) + barW / 2},302`} accent="muted" />

        <text
          x={450}
          y={base + 52}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          commits per day on main, author dates
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * Ledger entries by the first review seat named, grouped into code-review
 * seats, the security seat, and the rest. Criticals sit on the code-review
 * seats, Highs on the security seat.
 */
export function WhoCaughtWhatDiagram({ caption }: DiagramProps) {
  const id = "wsa4";
  const barX = 290;
  const scale = 6.8;
  const barH = 30;
  const rows = [
    { y: 98, label: "Task reviews", n: 41, kind: "code" as const, chip: "3 Critical" },
    { y: 140, label: "Whole-branch reviews", n: 10, kind: "code" as const, chip: "1 Critical" },
    { y: 222, label: "Security reviews", n: 66, kind: "sec" as const, chip: "9 High" },
    { y: 304, label: "Re-reviews", n: 6, kind: "other" as const, chip: "" },
    { y: 346, label: "Other", n: 16, kind: "other" as const, chip: "" },
  ];
  const barClass = {
    code: "fill-cyan-500/15 stroke-cyan-500",
    sec: "fill-amber-500/15 stroke-amber-500",
    other: "fill-foreground/5 stroke-foreground/40",
  } as const;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The 139 ledger entries by the first seat named. All four Criticals came from the code-review seats (three task reviews, one final review) and all nine Highs from the security seat or its re-reviews. My inference from one project's ledger."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={504}
        eyebrow="Who Caught What"
        chips={[
          { label: "139 ledger entries", accent: "primary" },
          { label: "4 Critical · 9 High", accent: "red" },
        ]}
        footerRight="Security ledger · first seat named"
      >
        <SectionLabel x={24} y={84} label="Code-review seats" accent="cyan" />
        <SectionLabel x={24} y={208} label="Security seat" accent="amber" />
        <SectionLabel x={24} y={290} label="Re-reviews and other" accent="muted" />

        {rows.map((r) => (
          <g key={r.label}>
            <text
              x={24}
              y={r.y + barH / 2 + 5}
              className="fill-foreground font-heading font-semibold"
              style={{ fontSize: 16 }}
            >
              {r.label}
            </text>
            <rect
              x={barX}
              y={r.y}
              width={r.n * scale}
              height={barH}
              rx={5}
              className={barClass[r.kind]}
              strokeWidth={1.25}
            />
            <text
              x={barX + r.n * scale + 12}
              y={r.y + barH / 2 + 6}
              className="fill-foreground font-heading font-bold"
              style={{ fontSize: 18 }}
            >
              {r.n}
            </text>
            {r.chip && (
              <Chip
                x={barX + r.n * scale + 54}
                y={r.y + barH / 2 - 11.5}
                label={r.chip}
                accent={r.kind === "sec" ? "amber" : "red"}
                filled
                fontSize={12}
              />
            )}
          </g>
        ))}
        <line x1={barX} y1={92} x2={barX} y2={376} className="stroke-border" strokeWidth="1" />

        <NodePanel
          x={24}
          y={398}
          w={852}
          h={60}
          accent="primary"
          emphasis
          align="left"
          title="Two seats, two kinds of bug"
          titleSize={17}
          subSize={12.5}
          sub={["code-review seats found every Critical, the security seat found every High"]}
        >
          <Chip x={862} y={416} label="Inference, one project" accent="primary" fontSize={11} anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramWrapper>
  );
}
