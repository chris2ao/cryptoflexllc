/** "OpenClaw Deployment Part 5: Is OpenClaw Still the One?": editorial SVG diagrams */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  DIAGRAM_ACCENTS,
  monoWidth,
  type DiagramAccent,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return <DiagramLightbox caption={caption}>{children}</DiagramLightbox>;
}

/* ------------------------------------------------------------------ */
/* 1. System map                                                       */
/* ------------------------------------------------------------------ */

const SERVICES: { title: string; sub: string; accent: DiagramAccent }[] = [
  { title: "ChatGPT Plus", sub: "Sol and Luna", accent: "violet" },
  { title: "Anthropic API", sub: "Sonnet, Haiku, Opus", accent: "violet" },
  { title: "Gmail + Calendar", sub: "via gws CLI", accent: "muted" },
  { title: "Jira Cloud", sub: "REST, no delete", accent: "muted" },
  { title: "Brave Search", sub: "Search API", accent: "muted" },
];

/**
 * One laptop process hosts the whole agent: a phone message arrives over a
 * long-polled bot, the agent works with its own memory, skills, schedules
 * and Keychain secrets, reaches out to five services, and backs its
 * memory up to the machine still running OpenClaw.
 */
export function MellieMelSystemMapDiagram({ caption }: DiagramProps) {
  const svcY = (i: number) => 104 + i * 78;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The whole trial is one background process on the MacBook Pro. Telegram is polled outward, so nothing listens on the laptop, and the Mac mini only ever receives memory backups."
      }
    >
      <EditorialFrame
        id="mm5-map"
        w={920}
        h={580}
        eyebrow="Mellie Mel System Map"
        chips={[
          { label: "one process", accent: "violet" },
          { label: "no open port", accent: "emerald" },
        ]}
        footerRight="Telegram · launchd · letta server"
      >
        {/* Left rail: phone, bot API */}
        <NodePanel
          x={24}
          y={104}
          w={156}
          h={76}
          accent="cyan"
          title="iPhone"
          sub={["Telegram app"]}
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id="mm5-map" d="M102,180 L102,214" accent="cyan" />
        <NodePanel
          x={24}
          y={214}
          w={156}
          h={92}
          accent="cyan"
          title="Telegram Bot API"
          sub={["long-polled", "no open port"]}
          titleSize={15}
          subSize={12.5}
        />

        {/* MacBook container */}
        <NodePanel x={214} y={64} w={480} h={446} accent="muted" title="">
          <SectionLabel x={232} y={90} label="MacBook Pro" accent="primary" />
          <Chip x={678} y={74} label="M5 Pro · 48 GB" accent="muted" fontSize={11} anchor="end" />
        </NodePanel>

        {/* Process chain */}
        <NodePanel
          x={232}
          y={106}
          w={120}
          h={54}
          title="launchd"
          sub={["keeps it up"]}
          titleSize={15}
          subSize={12.5}
        />
        <FlowLine id="mm5-map" d="M352,133 L379,133" accent="muted" />
        <NodePanel
          x={379}
          y={106}
          w={120}
          h={54}
          title="caffeinate"
          sub={["-s, no sleep"]}
          titleSize={15}
          subSize={12.5}
        />
        <FlowLine id="mm5-map" d="M499,133 L526,133" accent="muted" />
        <NodePanel
          x={526}
          y={106}
          w={150}
          h={54}
          accent="violet"
          emphasis
          title="letta server"
          sub={["--backend local"]}
          titleSize={15}
          subSize={12.5}
        />
        <FlowLine id="mm5-map" d="M601,160 L601,186" accent="violet" />

        {/* Mellie Mel container */}
        <NodePanel x={232} y={186} w={444} h={312} accent="primary" emphasis title="">
          <text
            x={248}
            y={216}
            className="fill-primary font-heading font-semibold"
            style={{ fontSize: 18 }}
          >
            Mellie Mel
          </text>
          <Chip x={660} y={198} label="Letta agent" accent="primary" fontSize={11} anchor="end" />
        </NodePanel>
        <NodePanel
          x={246}
          y={232}
          w={202}
          h={76}
          title="Skills"
          sub={["15 agent-scoped", "gmail, jira, wizdom"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={460}
          y={232}
          w={202}
          h={76}
          title="Schedules"
          sub={["3 cron schedules", "beat, brief, reminder"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={246}
          y={318}
          w={202}
          h={76}
          accent="emerald"
          title="Secrets"
          sub={["macOS Keychain", "never shown to model"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={460}
          y={318}
          w={202}
          h={76}
          title="Workspace"
          sub={["~/MellieMel", "bin/, ops/, tasks/"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={246}
          y={404}
          w={416}
          h={80}
          accent="cyan"
          emphasis
          align="left"
          title="Memory"
          sub={["git repo on disk (MemFS)", "dreaming on, pushed daily at 21:30"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={646} y={419} label="git-tracked" accent="cyan" fontSize={11} anchor="end" />
        </NodePanel>

        <FlowLine id="mm5-map" d="M180,260 L230,260" accent="cyan" />

        {/* Backup line to the Mac mini */}
        <FlowLine id="mm5-map" d="M246,444 L180,444" accent="cyan" dashed />
        <NodePanel
          x={24}
          y={398}
          w={156}
          h={92}
          variant="dashed"
          title="Mac mini"
          sub={["still runs OpenClaw", "memory backups only"]}
          titleSize={16}
          subSize={12}
        />

        {/* Outside services */}
        <SectionLabel x={730} y={86} label="Outside" accent="violet" />
        <path d="M676,292 L712,292" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M712,136 L712,448" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        {SERVICES.map((s, i) => (
          <g key={s.title}>
            <FlowLine
              id="mm5-map"
              d={`M712,${svcY(i) + 32} L728,${svcY(i) + 32}`}
              accent="muted"
            />
            <NodePanel
              x={730}
              y={svcY(i)}
              w={166}
              h={64}
              accent={s.accent}
              title={s.title}
              sub={[s.sub]}
              titleSize={15}
              subSize={12.5}
            />
          </g>
        ))}
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Daily rhythm                                                     */
/* ------------------------------------------------------------------ */

const hourX = (h: number) => 60 + (h - 6) * 50;
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
const BEATS = Array.from({ length: 14 }, (_, i) => i + 8);

/**
 * One shared hour axis, four lanes: the 14 heartbeats, the morning brief,
 * the weekly Google renewal reminder and the nightly memory push.
 */
export function MellieMelDailyRhythmDiagram({ caption }: DiagramProps) {
  const laneTop = { beat: 98, brief: 202, renew: 294, backup: 386 };
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Fourteen quiet heartbeats, one brief, one weekly nudge, one nightly backup. The heartbeat is the busiest schedule and the one most likely to eat the ChatGPT Plus allowance."
      }
    >
      <EditorialFrame
        id="mm5-rhythm"
        w={920}
        h={520}
        eyebrow="The Daily Rhythm"
        chips={[
          { label: "Eastern time", accent: "muted" },
          { label: "14 heartbeats", accent: "primary" },
        ]}
        footerRight="06:00 to 22:00 · three cron lines"
      >
        {/* Hour axis */}
        {HOURS.map((h) => (
          <text
            key={h}
            x={hourX(h)}
            y={82}
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            style={{ fontSize: 12.5 }}
          >
            {String(h).padStart(2, "0")}
          </text>
        ))}

        {/* Lanes */}
        <NodePanel x={24} y={laneTop.beat} w={872} h={92} accent="primary" title="" />
        <NodePanel x={24} y={laneTop.brief} w={872} h={80} accent="amber" title="" />
        <NodePanel x={24} y={laneTop.renew} w={872} h={80} accent="amber" title="" />
        <NodePanel x={24} y={laneTop.backup} w={872} h={80} accent="emerald" title="" />

        {/* Hour gridlines */}
        {HOURS.map((h) => (
          <line
            key={h}
            x1={hourX(h)}
            y1={90}
            x2={hourX(h)}
            y2={laneTop.backup + 80}
            className="stroke-foreground/[0.12]"
            strokeWidth="1"
          />
        ))}

        {/* Lane 1: heartbeat */}
        <SectionLabel x={40} y={laneTop.beat + 26} label="Heartbeat" accent="primary" />
        <text
          x={880}
          y={laneTop.beat + 26}
          textAnchor="end"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          0 8-21 * * *  ·  replies HEARTBEAT_OK when nothing is new
        </text>
        <line
          x1={hourX(8)}
          y1={laneTop.beat + 62}
          x2={hourX(21)}
          y2={laneTop.beat + 62}
          className="stroke-primary/40"
          strokeWidth="2"
        />
        {BEATS.map((h) => (
          <circle
            key={h}
            cx={hourX(h)}
            cy={laneTop.beat + 62}
            r={10}
            className="fill-primary/25 stroke-primary"
            strokeWidth="2"
          />
        ))}

        {/* Lane 2: morning brief */}
        <SectionLabel x={40} y={laneTop.brief + 26} label="Morning brief" accent="amber" />
        <path
          d={`M${hourX(8.5)},${laneTop.brief + 44} L${hourX(8.5) + 11},${laneTop.brief + 56} L${hourX(8.5)},${laneTop.brief + 68} L${hourX(8.5) - 11},${laneTop.brief + 56} Z`}
          className="fill-amber-500/30 stroke-amber-500"
          strokeWidth="2"
        />
        <text
          x={hourX(8.5) + 24}
          y={laneTop.brief + 54}
          className="fill-foreground font-heading font-semibold"
          style={{ fontSize: 17 }}
        >
          08:30 brief
        </text>
        <text
          x={hourX(8.5) + 24}
          y={laneTop.brief + 72}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          30 8 * * *  ·  morning-brief skill
        </text>
        <text
          x={880}
          y={laneTop.brief + 26}
          textAnchor="end"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          also says if the Google sign-in has lapsed
        </text>

        {/* Lane 3: weekly renewal */}
        <SectionLabel x={40} y={laneTop.renew + 26} label="Weekly reminder" accent="amber" />
        <path
          d={`M${hourX(9)},${laneTop.renew + 44} L${hourX(9) + 11},${laneTop.renew + 56} L${hourX(9)},${laneTop.renew + 68} L${hourX(9) - 11},${laneTop.renew + 56} Z`}
          className="fill-amber-500/30 stroke-amber-500"
          strokeWidth="2"
        />
        <text
          x={hourX(9) + 24}
          y={laneTop.renew + 54}
          className="fill-foreground font-heading font-semibold"
          style={{ fontSize: 17 }}
        >
          Wednesday 09:00
        </text>
        <text
          x={hourX(9) + 24}
          y={laneTop.renew + 72}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          0 9 * * 3  ·  Google sign-in renewal on Telegram
        </text>
        <text
          x={880}
          y={laneTop.renew + 26}
          textAnchor="end"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          7-day token expiry · renewed with mmauth
        </text>

        {/* Lane 4: backup push */}
        <SectionLabel x={40} y={laneTop.backup + 26} label="Memory backup" accent="emerald" />
        <text
          x={880}
          y={laneTop.backup + 26}
          textAnchor="end"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          launchd, not letta cron
        </text>
        <path
          d={`M${hourX(21.5)},${laneTop.backup + 44} L${hourX(21.5) + 11},${laneTop.backup + 56} L${hourX(21.5)},${laneTop.backup + 68} L${hourX(21.5) - 11},${laneTop.backup + 56} Z`}
          className="fill-emerald-500/30 stroke-emerald-500"
          strokeWidth="2"
        />
        <text
          x={hourX(21.5) - 24}
          y={laneTop.backup + 54}
          textAnchor="end"
          className="fill-foreground font-heading font-semibold"
          style={{ fontSize: 17 }}
        >
          21:30 push to the Mac mini
        </text>
        <text
          x={hourX(21.5) - 24}
          y={laneTop.backup + 72}
          textAnchor="end"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          a missed run fires on wake
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Memory layout                                                    */
/* ------------------------------------------------------------------ */

function PillRow({
  x,
  y,
  labels,
  accent = "muted",
}: {
  x: number;
  y: number;
  labels: string[];
  accent?: DiagramAccent;
}) {
  const a = DIAGRAM_ACCENTS[accent];
  const widths = labels.map((label) => monoWidth(label, 12.5) + 18);
  return (
    <g>
      {labels.map((label, idx) => {
        const w = widths[idx];
        const px = x + widths.slice(0, idx).reduce((sum, v) => sum + v + 8, 0);
        return (
          <g key={label}>
            <rect
              x={px}
              y={y}
              width={w}
              height={26}
              rx={6}
              className={`fill-surface-1/80 ${a.strokeSoft}`}
              strokeWidth="1.25"
            />
            <text
              x={px + w / 2}
              y={y + 17.5}
              textAnchor="middle"
              className="fill-foreground font-mono"
              style={{ fontSize: 12.5 }}
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function GroupLabel({
  x,
  y,
  label,
  accent,
}: {
  x: number;
  y: number;
  label: string;
  accent: DiagramAccent;
}) {
  return (
    <text
      x={x}
      y={y}
      className={`${DIAGRAM_ACCENTS[accent].text} font-mono font-bold uppercase`}
      style={{ fontSize: 12, letterSpacing: "0.08em" }}
    >
      {label}
    </text>
  );
}

/**
 * The memory folder as a tree: root files that load every turn, one
 * reference file on demand, fifteen skills in three groups, and the git
 * hooks that feed the daily push to the Mac mini.
 */
export function MellieMelMemoryLayoutDiagram({ caption }: DiagramProps) {
  const rowX = 250;
  const rowW = 646;
  const textX = rowX + 18;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Letta 0.34.15 starts memory at the repo root, not in a system folder. Five files load every turn, one loads on demand, and the whole folder is a git repo you can read with git log."
      }
    >
      <EditorialFrame
        id="mm5-memory"
        w={920}
        h={640}
        eyebrow="The Memory Layout"
        chips={[
          { label: "plain git repo", accent: "cyan" },
          { label: "15 skills", accent: "primary" },
        ]}
        footerRight="Root files · reference · skills · hooks"
      >
        {/* Root */}
        <NodePanel x={24} y={64} w={180} h={514} accent="cyan" emphasis title="">
          <text
            x={114}
            y={98}
            textAnchor="middle"
            className="fill-cyan-600 font-heading font-semibold"
            style={{ fontSize: 18 }}
          >
            Memory repo
          </text>
          <text
            x={114}
            y={120}
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            style={{ fontSize: 12.5 }}
          >
            plain git, MemFS
          </text>
          {[
            { n: "5", c: "load every turn", y: 198 },
            { n: "1", c: "loads on demand", y: 292 },
            { n: "15", c: "skills", y: 386 },
            { n: "2", c: "git hooks", y: 480 },
          ].map((stat) => (
            <g key={stat.c}>
              <text
                x={114}
                y={stat.y}
                textAnchor="middle"
                className="fill-foreground font-heading font-bold"
                style={{ fontSize: 40 }}
              >
                {stat.n}
              </text>
              <text
                x={114}
                y={stat.y + 24}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                style={{ fontSize: 12.5 }}
              >
                {stat.c}
              </text>
            </g>
          ))}
        </NodePanel>
        <FlowLine id="mm5-memory" d="M204,321 L232,321" accent="cyan" arrow={false} />
        <path d="M232,108 L232,534" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        {[108, 208, 372, 534].map((cy) => (
          <FlowLine key={cy} id="mm5-memory" d={`M232,${cy} L248,${cy}`} accent="cyan" />
        ))}

        {/* Row 1: root files */}
        <NodePanel x={rowX} y={64} w={rowW} h={88} accent="primary" emphasis title="">
          <text
            x={textX}
            y={94}
            className="fill-primary font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            Root files
          </text>
          <Chip x={880} y={76} label="every turn" accent="primary" filled fontSize={11} anchor="end" />
          <PillRow
            x={textX}
            y={110}
            labels={["persona.md", "human.md", "operating-manual.md", "MEMORY.md", "shortcuts.md"]}
            accent="primary"
          />
        </NodePanel>

        {/* Row 2: reference */}
        <NodePanel x={rowX} y={164} w={rowW} h={88} title="">
          <text
            x={textX}
            y={194}
            className="fill-foreground font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            reference/
          </text>
          <Chip x={880} y={176} label="on demand" accent="amber" filled fontSize={11} anchor="end" />
          <PillRow x={textX} y={210} labels={["integrations.md"]} accent="muted" />
        </NodePanel>

        {/* Row 3: skills */}
        <NodePanel x={rowX} y={264} w={rowW} h={216} title="">
          <text
            x={textX}
            y={294}
            className="fill-foreground font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            skills/
          </text>
          <Chip x={880} y={276} label="15 agent-scoped" accent="muted" fontSize={11} anchor="end" />

          <GroupLabel x={textX} y={332} label="Kit · 7" accent="cyan" />
          <PillRow
            x={372}
            y={314}
            labels={["gmail", "calendar", "jira", "web-search", "mellie-heartbeat"]}
            accent="cyan"
          />
          <PillRow x={372} y={346} labels={["morning-brief", "mellie-workflows"]} accent="cyan" />

          <GroupLabel x={textX} y={396} label="Copied · 7" accent="muted" />
          <PillRow
            x={372}
            y={378}
            labels={["kb-authoring", "Deep Research", "code-review", "DevOps", "Sysadmin"]}
            accent="muted"
          />
          <PillRow x={372} y={410} labels={["security-audit", "frontend-design"]} accent="muted" />

          <GroupLabel x={textX} y={460} label="Adapted · 1" accent="amber" />
          <PillRow x={372} y={442} labels={["wizdom"]} accent="amber" />
        </NodePanel>

        {/* Row 4: git hooks and the push */}
        <NodePanel x={rowX} y={490} w={346} h={88} title="">
          <text
            x={textX}
            y={520}
            className="fill-foreground font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            Git hooks
          </text>
          <Chip x={580} y={502} label="added by Letta" accent="muted" fontSize={11} anchor="end" />
          <PillRow x={textX} y={538} labels={["pre-commit", "post-commit"]} accent="muted" />
        </NodePanel>
        <FlowLine id="mm5-memory" d="M596,534 L650,534" accent="cyan" dashed />
        <text
          x={623}
          y={524}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          21:30
        </text>
        <NodePanel
          x={650}
          y={490}
          w={246}
          h={88}
          variant="dashed"
          title="Mac mini"
          sub={["bare repo, backups only"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Guardrail layers, before and after                               */
/* ------------------------------------------------------------------ */

type Verdict = "REFUSED" | "WRITTEN" | "BLOCKED";

const VERDICT_ACCENT: Record<Verdict, DiagramAccent> = {
  REFUSED: "emerald",
  WRITTEN: "red",
  BLOCKED: "emerald",
};

interface AttemptRow {
  title: string;
  sub: string;
  verdict: Verdict;
}

const BEFORE_ROWS: AttemptRow[] = [
  { title: "Shell: security", sub: "rule Bash(security:*)", verdict: "REFUSED" },
  { title: "Shell: mmauth", sub: "rule Bash(mmauth:*)", verdict: "REFUSED" },
  { title: "ApplyPatch: bin/mm-gmail", sub: "Edit/Write rules never match", verdict: "WRITTEN" },
  { title: "ApplyPatch: settings.json", sub: "Edit/Write rules never match", verdict: "WRITTEN" },
];

const AFTER_ROWS: AttemptRow[] = [
  { title: "ApplyPatch: bin/mm-gmail", sub: "Failed to write file", verdict: "BLOCKED" },
  { title: "ApplyPatch: settings.json", sub: "Failed to write file", verdict: "BLOCKED" },
  { title: "Shell append: ops/gmail.py", sub: "operation not permitted", verdict: "BLOCKED" },
  { title: "Shell mv: bin/mm-jira", sub: "Operation not permitted", verdict: "BLOCKED" },
];

function AttemptColumn({ x, rows }: { x: number; rows: AttemptRow[] }) {
  return (
    <g>
      {rows.map((row, i) => {
        const y = 108 + i * 84;
        const accent = VERDICT_ACCENT[row.verdict];
        return (
          <NodePanel
            key={row.title}
            x={x}
            y={y}
            w={408}
            h={72}
            accent={row.verdict === "WRITTEN" ? "red" : "muted"}
            emphasis={row.verdict === "WRITTEN"}
            align="left"
            title={row.title}
            sub={[row.sub]}
            titleSize={16}
            subSize={12.5}
          >
            <Chip
              x={x + 392}
              y={y + 25}
              label={row.verdict}
              accent={accent}
              filled
              fontSize={11}
              anchor="end"
            />
          </NodePanel>
        );
      })}
    </g>
  );
}

/**
 * The same kind of write attempt, tested twice. Deny rules held against
 * the shell but missed ApplyPatch entirely; the system-immutable flag
 * blocked all four attempts regardless of which tool asked.
 */
export function MellieMelGuardrailLayersDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Round one used the tools a deny rule knew about. Round two used the tool she actually had. Locking the files at the filesystem level closed the gap for every tool at once."
      }
    >
      <EditorialFrame
        id="mm5-guard"
        w={920}
        h={566}
        eyebrow="The Deny Rules That Did Not Deny"
        eyebrowAccent="amber"
        chips={[{ label: "8 test attempts", accent: "primary" }]}
        footerRight="Deny rules · schg locks"
      >
        {/* Lane headers */}
        <SectionLabel x={24} y={90} label="Before · 37 deny rules" accent="amber" />
        <SectionLabel x={488} y={90} label="After · schg locks" accent="emerald" />
        <Chip x={896} y={72} label="sudo chflags schg" accent="emerald" fontSize={11} anchor="end" />

        <AttemptColumn x={24} rows={BEFORE_ROWS} />
        <AttemptColumn x={488} rows={AFTER_ROWS} />

        {/* Hand-off arrow */}
        <FlowLine id="mm5-guard" d="M436,270 L484,270" accent="amber" width={2} />

        {/* Why panels */}
        <NodePanel
          x={24}
          y={452}
          w={408}
          h={66}
          accent="amber"
          title="Why the rules leaked"
          sub={["ApplyPatch is in no tool family,", "so Edit and Write rules never match"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={488}
          y={452}
          w={408}
          h={66}
          accent="emerald"
          emphasis
          title="Why the lock holds"
          sub={["the kernel refuses the write,", "whichever tool asks"]}
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id="mm5-guard" d="M436,485 L484,485" accent="amber" width={2} />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Model routing and cost ladder                                    */
/* ------------------------------------------------------------------ */

interface ModelRow {
  title: string;
  role: string;
  payer: string;
  payerAccent: DiagramAccent;
  cost: string;
  /** Output price per million tokens; 0 for subscription-covered rows. */
  out: number;
  emphasis?: boolean;
}

const MODEL_ROWS: ModelRow[] = [
  {
    title: "GPT-6 Sol",
    role: "default: chat, email, Jira, briefs",
    payer: "ChatGPT Plus",
    payerAccent: "emerald",
    cost: "$0 · about 15 to 150 msgs / 5 h (reported)",
    out: 0,
    emphasis: true,
  },
  {
    title: "GPT-6 Luna",
    role: "cheap mode if Sol limits bite",
    payer: "ChatGPT Plus",
    payerAccent: "emerald",
    cost: "$0 · about 350 to 3,000 / 5 h (reported)",
    out: 0,
  },
  {
    title: "Claude Haiku 5.5",
    role: "background subagents",
    payer: "Max API credit",
    payerAccent: "amber",
    cost: "$0.10 in / $0.50 out per M tokens",
    out: 0.5,
  },
  {
    title: "Claude Sonnet 5.5",
    role: "overflow and long writing",
    payer: "Max API credit",
    payerAccent: "amber",
    cost: "$2 in / $10 out per M tokens",
    out: 10,
  },
  {
    title: "Claude Opus 5.5",
    role: "rare deep work",
    payer: "Max API credit",
    payerAccent: "amber",
    cost: "$4 in / $20 out per M tokens",
    out: 20,
  },
];

const BAR_X = 520;
const BAR_W = 376;

/**
 * Five models ordered by price: the two covered by the ChatGPT Plus
 * subscription first, then the three Claude models paid from the Max
 * plan's monthly API credit, with bars scaled to output price.
 */
export function MellieMelModelLadderDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The cheapest rung does the daily work. Claude only gets called when a Plus limit bites or the job is worth the money, and it is always the Console API key, never a Pro or Max login."
      }
    >
      <EditorialFrame
        id="mm5-models"
        w={920}
        h={562}
        eyebrow="Models and Money"
        chips={[
          { label: "5 models", accent: "primary" },
          { label: "2 payers", accent: "amber" },
        ]}
        footerRight="Routing by price · prices read 2026-10-15"
      >
        <SectionLabel x={24} y={88} label="Model and role" accent="primary" fontSize={11.5} />
        <SectionLabel x={372} y={88} label="Paid by" accent="primary" fontSize={11.5} />
        <SectionLabel x={BAR_X} y={88} label="Cost or limit" accent="primary" fontSize={11.5} />

        {MODEL_ROWS.map((row, i) => {
          const y = 104 + i * 76;
          const barW = (row.out / 20) * BAR_W;
          return (
            <g key={row.title}>
              <NodePanel
                x={24}
                y={y}
                w={330}
                h={66}
                accent={row.payerAccent}
                emphasis={row.emphasis}
                align="left"
                title={row.title}
                sub={[row.role]}
                titleSize={17}
                subSize={12.5}
              />
              <Chip
                x={372}
                y={y + 22}
                label={row.payer}
                accent={row.payerAccent}
                filled
                fontSize={11}
              />
              <text
                x={BAR_X}
                y={y + 26}
                className="fill-foreground font-mono"
                style={{ fontSize: 12.5 }}
              >
                {row.cost}
              </text>
              <rect
                x={BAR_X}
                y={y + 38}
                width={BAR_W}
                height={12}
                rx={3}
                className="fill-foreground/5"
              />
              {row.out > 0 && (
                <rect
                  x={BAR_X}
                  y={y + 38}
                  width={barW}
                  height={12}
                  rx={3}
                  className="fill-amber-500/70"
                />
              )}
              {row.out === 0 && (
                <rect
                  x={BAR_X}
                  y={y + 38}
                  width={6}
                  height={12}
                  rx={3}
                  className="fill-emerald-500"
                />
              )}
            </g>
          );
        })}

        <text
          x={24}
          y={502}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          Bars show output price per million tokens. Plus rows are covered by the subscription.
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}
