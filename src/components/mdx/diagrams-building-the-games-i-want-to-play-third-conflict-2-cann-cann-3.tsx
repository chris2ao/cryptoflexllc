/** "Building the Games I Want to Play: Third Conflict 2.0 and Cann-Cann 3.0": editorial SVG diagrams */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  StepBadge,
  DIAGRAM_ACCENTS,
  elbowPath,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/**
 * Third Conflict 2.0 plan map: M0 hotfix merged forward, M1 foundations,
 * then three parallel tracks (rules and AI, presentation, identity) with
 * two owner gates, all merging into the M8 ship milestone.
 */
export function ThirdConflictTrackMapDiagram({ caption }: DiagramProps) {
  const id = "bgp1";
  const laneY = { r: 190, p: 290, i: 395 } as const;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The 2.0 plan as three tracks between foundations and ship. Rules and AI, presentation, and identity ran in parallel, and two owner gates (rules freeze on 2026-10-31, art sign-off on 2026-11-01) decided when downstream work could start."
      }
    >
      <EditorialFrame
        id={id}
        w={940}
        h={520}
        eyebrow="Third Conflict 2.0 Plan"
        chips={[
          { label: "3 tracks", accent: "primary" },
          { label: "2 owner gates", accent: "amber" },
        ]}
        footerRight="Approved 2026-10-16 · merged 2026-11-09"
      >
        {/* M0 hotfix, merged forward to M8 */}
        <NodePanel
          x={20}
          y={62}
          w={210}
          h={50}
          title="M0 Hotfix"
          sub={["on main"]}
          variant="dashed"
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id={id} d={elbowPath(230, 87, 833, 235, "h")} accent="muted" dashed />
        <Chip x={470} y={76} label="merged forward" accent="muted" fontSize={10.5} />

        {/* M1 and the fan-out to tracks R and P */}
        <NodePanel
          x={20}
          y={258}
          w={96}
          h={64}
          title="M1"
          sub={["Foundations"]}
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id={id} d="M116,290 L146,290" accent="primary" />
        <path d="M131,190 L131,290" fill="none" className="stroke-primary/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M131,190 L146,190" accent="primary" />

        {/* Track R: rules, then AI */}
        <SectionLabel x={146} y={150} label="Track R · Rules" accent="violet" />
        <NodePanel x={146} y={158} w={114} h={64} accent="violet" title="M2 Gameplay" sub={["rules"]} titleSize={16} subSize={12.5} />
        <FlowLine id={id} d="M260,190 L282,190" accent="violet" />
        <NodePanel x={282} y={158} w={108} h={64} accent="amber" emphasis title="Rules freeze" sub={["2026-10-31"]} titleSize={15} subSize={12.5} />
        <FlowLine id={id} d="M390,190 L412,190" accent="violet" />
        <NodePanel x={412} y={158} w={298} h={64} accent="violet" title="M3 AI 2.0" sub={["fair AI, harness gates in CI"]} titleSize={16} subSize={12.5} />

        {/* Track P: presentation */}
        <SectionLabel x={146} y={250} label="Track P · Presentation" accent="cyan" />
        <NodePanel x={146} y={258} w={114} h={64} accent="cyan" title="U1 / U2" sub={["look slice"]} titleSize={16} subSize={12.5} />
        <FlowLine id={id} d="M260,290 L282,290" accent="cyan" />
        <NodePanel x={282} y={258} w={108} h={64} accent="amber" emphasis title="Art sign-off" sub={["2026-11-01"]} titleSize={15} subSize={12.5} />
        <FlowLine id={id} d="M390,290 L412,290" accent="cyan" />
        <NodePanel x={412} y={258} w={76} h={64} accent="cyan" title="M4 UX" sub={["UI kit"]} titleSize={16} subSize={12.5} />
        <FlowLine id={id} d="M488,290 L510,290" accent="cyan" />
        <NodePanel x={510} y={258} w={76} h={64} accent="cyan" title="M5 Map" sub={["PixiJS"]} titleSize={16} subSize={12.5} />
        <FlowLine id={id} d="M586,290 L608,290" accent="cyan" />
        <NodePanel x={608} y={258} w={102} h={64} accent="cyan" title="M6 Theater" sub={["battle log"]} titleSize={16} subSize={12.5} />

        {/* Track I: identity, after the art sign-off slice */}
        <SectionLabel x={282} y={355} label="Track I · Identity" accent="primary" />
        <FlowLine id={id} d={elbowPath(203, 322, 282, laneY.i, "v")} accent="primary" />
        <NodePanel
          x={282}
          y={363}
          w={428}
          h={64}
          accent="primary"
          title="M7 Identity, audio, tutorial"
          sub={["lore, voice lines, music, 5 tutorial missions"]}
          titleSize={16}
          subSize={12.5}
        />

        {/* Merge bus into M8 */}
        <path d={`M710,${laneY.r} L728,${laneY.r}`} fill="none" className="stroke-emerald-500/50" strokeWidth="1.5" />
        <path d={`M710,${laneY.i} L728,${laneY.i}`} fill="none" className="stroke-emerald-500/50" strokeWidth="1.5" />
        <path d={`M710,${laneY.p} L728,${laneY.p}`} fill="none" className="stroke-emerald-500/50" strokeWidth="1.5" />
        <path d={`M728,${laneY.r} L728,${laneY.i}`} fill="none" className="stroke-emerald-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M728,290 L746,290" accent="emerald" width={2} />
        <NodePanel
          x={746}
          y={235}
          w={174}
          h={110}
          accent="emerald"
          emphasis
          title="M8 Ship"
          sub={["Definition of Done", "merged to main", "2026-11-09"]}
          titleSize={18}
          subSize={12.5}
        />

        {/* Legend */}
        <Chip x={20} y={452} label="amber = owner gate" accent="amber" fontSize={10.5} />
        <Chip x={206} y={452} label="dashed = merged forward" accent="muted" fontSize={10.5} />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * The wave loop both upgrades shared: a foundation commit first, parallel
 * agents in separate file areas, one merge owner, review, QA playthrough,
 * fixes, then the owner gate.
 */
export function AgentWaveLoopDiagram({ caption }: DiagramProps) {
  const id = "bgp2";
  const agentRows = [
    { y: 94, title: "Engine" },
    { y: 162, title: "Modes" },
    { y: 230, title: "Tutorial" },
    { y: 298, title: "Menus + settings" },
  ];
  return (
    <DiagramLightbox
      caption={
        caption ??
        "One wave: a foundation commit merges first, agents work in separate file areas, only the main session merges (one branch at a time, type check after each), then review, a QA playthrough, fixes, and the owner gate. The agent names shown are Cann-Cann's wave 3 streams."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={520}
        eyebrow="The Wave Loop"
        chips={[
          { label: "1 merge owner", accent: "primary" },
          { label: "7 steps", accent: "violet" },
        ]}
        footerRight="Third Conflict + Cann-Cann · one loop"
      >
        {/* 1 Foundation */}
        <NodePanel
          x={20}
          y={174}
          w={110}
          h={100}
          accent="cyan"
          title="Foundation"
          sub={["shared types", "and helpers"]}
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id={id} d="M130,224 L148,224" accent="cyan" arrow={false} />
        <path d="M148,122 L148,326" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />

        {/* 2 Parallel agents */}
        <SectionLabel x={166} y={78} label="Parallel agents" accent="violet" />
        {agentRows.map((row) => (
          <g key={row.title}>
            <FlowLine id={id} d={`M148,${row.y + 28} L166,${row.y + 28}`} accent="cyan" />
            <NodePanel
              x={166}
              y={row.y}
              w={176}
              h={56}
              accent="violet"
              title={row.title}
              sub={["own worktree"]}
              titleSize={16}
              subSize={12.5}
            />
            <path d={`M342,${row.y + 28} L362,${row.y + 28}`} fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
          </g>
        ))}
        <path d="M362,122 L362,326" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id={id} d="M362,224 L384,224" accent="muted" />

        {/* 3 Merge owner */}
        <NodePanel
          x={384}
          y={164}
          w={140}
          h={120}
          accent="primary"
          emphasis
          title="Merge owner"
          sub={["--no-ff merges", "type check after", "each branch"]}
          titleSize={16}
          subSize={12.5}
        />

        {/* 4 Reviews */}
        <path d="M524,224 L544,224" fill="none" className="stroke-primary/50" strokeWidth="1.5" />
        <path d="M544,188 L544,260" fill="none" className="stroke-primary/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M544,188 L566,188" accent="primary" />
        <FlowLine id={id} d="M544,260 L566,260" accent="primary" />
        <NodePanel x={566} y={160} w={140} h={56} accent="primary" title="Code review" sub={["combined diff"]} titleSize={16} subSize={12.5} />
        <NodePanel x={566} y={232} w={140} h={56} accent="red" title="Security review" sub={["in parallel"]} titleSize={16} subSize={12.5} />
        <path d="M706,188 L726,188" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M706,260 L726,260" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M726,131 L726,260" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id={id} d="M726,131 L748,131" accent="muted" />

        {/* 5 QA, 6 Fix, 7 Owner gate */}
        <NodePanel x={748} y={96} w={152} h={70} accent="cyan" title="QA playthrough" sub={["production build"]} titleSize={16} subSize={12.5} />
        <FlowLine id={id} d="M824,166 L824,206" accent="muted" />
        <NodePanel
          x={748}
          y={206}
          w={152}
          h={70}
          accent="amber"
          variant="dashed"
          title="Fix + bundle"
          sub={["CRITICAL and HIGH", "rest in one ticket"]}
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id={id} d="M824,276 L824,316" accent="muted" />
        <NodePanel
          x={748}
          y={316}
          w={152}
          h={70}
          accent="emerald"
          emphasis
          title="Owner gate"
          sub={["I play it, then OK"]}
          titleSize={16}
          subSize={12.5}
        />

        {/* Step badges */}
        <StepBadge cx={20} cy={174} n={1} accent="cyan" />
        <StepBadge cx={166} cy={94} n={2} accent="violet" />
        <StepBadge cx={384} cy={164} n={3} accent="primary" />
        <StepBadge cx={566} cy={160} n={4} accent="primary" />
        <StepBadge cx={748} cy={96} n={5} accent="cyan" />
        <StepBadge cx={748} cy={206} n={6} accent="amber" />
        <StepBadge cx={748} cy={316} n={7} accent="emerald" />

        {/* The referee note */}
        <NodePanel
          x={20}
          y={410}
          w={880}
          h={62}
          accent="amber"
          variant="dashed"
          align="left"
          title="Parallel work needs a referee"
          sub={["Separate file areas stop merge conflicts, not behavior conflicts."]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={886} y={430} label="mind the seam" accent="amber" filled anchor="end" fontSize={10.5} />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/** One column of the commits-per-day strip. */
function DayCard({
  x,
  date,
  lines,
  count,
  barH,
  accent,
}: {
  x: number;
  date: string;
  lines: string[];
  count: string;
  barH: number;
  accent: "primary" | "muted" | "emerald";
}) {
  const a = DIAGRAM_ACCENTS[accent];
  const baseline = 398;
  const barX = x + 206;
  return (
    <g>
      <rect x={x} y={250} width={280} height={172} rx={10} className="fill-surface-2/80 stroke-foreground/25" strokeWidth="1.25" />
      <text x={x + 18} y={284} className="fill-foreground font-heading font-semibold" style={{ fontSize: 18 }}>
        {date}
      </text>
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + 18}
          y={310 + i * 20}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 12.5 }}
        >
          {line}
        </text>
      ))}
      <rect x={barX} y={baseline - barH} width={50} height={barH} rx={3} className={`${a.softFill} ${a.stroke}`} strokeWidth="1.5" />
      <line x1={x + 190} y1={baseline} x2={x + 266} y2={baseline} className="stroke-foreground/30" strokeWidth="1.5" />
      <text x={barX + 25} y={baseline - barH - 8} textAnchor="middle" className={`${a.text} font-heading font-bold`} style={{ fontSize: 17 }}>
        {count}
      </text>
      <text x={barX + 25} y={baseline + 20} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
        commits
      </text>
    </g>
  );
}

/**
 * Cann-Cann 3.0 in four waves, with the Wave 0 look gate in front, and
 * the calendar underneath: 8, 115 and 10 commits on 11-13, 11-14, 11-15.
 */
export function CannThreeWavesDiagram({ caption }: DiagramProps) {
  const id = "bgp3";
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Four waves with a look gate in front. Wave 1 did not start until I wrote \"I approve the look\" on 2026-11-14. Underneath, the calendar: 8 commits on the 13th, 115 on the 14th, 10 on the 15th."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={466}
        eyebrow="Cann-Cann 3.0 in Four Waves"
        chips={[
          { label: "3 days", accent: "primary" },
          { label: "1 look gate", accent: "amber" },
        ]}
        footerRight="2026-11-13 to 2026-11-15"
      >
        <SectionLabel x={20} y={78} label="Four waves" accent="primary" />
        <NodePanel
          x={20}
          y={90}
          w={170}
          h={112}
          accent="cyan"
          title="Wave 0"
          sub={["/lab/look/ page", "Volcanic sunset", "avg frame 16.7 ms"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M190,146 L210,146" accent="cyan" />
        <NodePanel
          x={210}
          y={118}
          w={120}
          h={56}
          accent="amber"
          emphasis
          title="Look gate"
          sub={["I approve"]}
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id={id} d="M330,146 L350,146" accent="amber" />
        <NodePanel
          x={350}
          y={90}
          w={170}
          h={112}
          accent="primary"
          title="Wave 1"
          sub={["real game on Pixi", "mobile tanks", "materials"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M520,146 L540,146" accent="primary" />
        <NodePanel
          x={540}
          y={90}
          w={170}
          h={112}
          accent="primary"
          title="Wave 2"
          sub={["7 biomes differ", "weapon look + sound", "phone layout"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M710,146 L730,146" accent="primary" />
        <NodePanel
          x={730}
          y={90}
          w={170}
          h={112}
          accent="emerald"
          emphasis
          title="Wave 3"
          sub={["all modes on 3.0", "4 worktree streams", "then it ships"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* The gate is what the 11-14 card records */}
        <FlowLine id={id} d="M270,174 L270,218 Q270,226 278,226 L452,226 Q460,226 460,234 L460,250" accent="amber" dashed />

        <SectionLabel x={20} y={236} label="Commits per day" accent="muted" />
        <DayCard x={20} date="2026-11-13" lines={["design doc approved", "total redesign"]} count="8" barH={10} accent="muted" />
        <DayCard
          x={320}
          date="2026-11-14"
          lines={["I approve the look", "3.0.0 merged", "tag v3.0.0"]}
          count="115"
          barH={100}
          accent="primary"
        />
        <DayCard
          x={620}
          date="2026-11-15"
          lines={["3.0.1 small fixes", "/lab/look/ removed", "my playtest"]}
          count="10"
          barH={12}
          accent="emerald"
        />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * Simulate first, then play it back. Cann-Cann: one action log drives
 * local play, replay and online. Third Conflict: a small recipe is rebuilt
 * into the combat log that the Battle Theater plays. Both are pinned by
 * golden digests.
 */
export function SimulateFirstDeterminismDiagram({ caption }: DiagramProps) {
  const id = "bgp4";
  const consumers = [
    { y: 92, title: "Local play", sub: "plays back the shot it just simulated" },
    { y: 156, title: "Replay", sub: "same log, same match, every time" },
    { y: 220, title: "Online", sub: "7 test matches, both sides agreed every turn" },
  ];
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Both engines resolve the outcome first and animate it afterward. Cann-Cann feeds one seed and action log to local play, replays and online. Third Conflict keeps a small recipe in saves and rebuilds the full combat log for the Battle Theater."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={520}
        eyebrow="Simulate First, Then Play It Back"
        chips={[
          { label: "deterministic", accent: "violet" },
          { label: "2 engines", accent: "primary" },
        ]}
        footerRight="Seeded · replayable · pinned by digests"
      >
        <SectionLabel x={20} y={78} label="Cann-Cann" accent="primary" />
        <NodePanel
          x={20}
          y={134}
          w={190}
          h={100}
          accent="cyan"
          title="Seed + action log"
          sub={["same input", "everywhere"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M210,184 L250,184" accent="cyan" />
        <NodePanel
          x={250}
          y={124}
          w={190}
          h={120}
          accent="violet"
          emphasis
          terminal
          title="Simulate first"
          sub={["fixed 120 Hz step", "before any animation"]}
          titleSize={17}
          subSize={12.5}
        />
        <path d="M440,184 L460,184" fill="none" className="stroke-violet-500/50" strokeWidth="1.5" />
        <path d="M460,120 L460,248" fill="none" className="stroke-violet-500/50" strokeWidth="1.5" />
        {consumers.map((c) => (
          <g key={c.title}>
            <FlowLine id={id} d={`M460,${c.y + 28} L480,${c.y + 28}`} accent="violet" />
            <NodePanel
              x={480}
              y={c.y}
              w={420}
              h={56}
              accent="primary"
              align="left"
              title={c.title}
              sub={[c.sub]}
              titleSize={17}
              subSize={12.5}
            />
          </g>
        ))}

        <SectionLabel x={20} y={312} label="Third Conflict" accent="primary" />
        <NodePanel
          x={20}
          y={324}
          w={190}
          h={76}
          accent="emerald"
          title="Recipe"
          sub={["random state + inputs", "all a save keeps"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M210,362 L250,362" accent="emerald" />
        <NodePanel
          x={250}
          y={324}
          w={190}
          h={76}
          accent="violet"
          title="Resolve the fight"
          sub={["deterministic engine", "records a log"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M440,362 L480,362" accent="violet" />
        <NodePanel
          x={480}
          y={324}
          w={190}
          h={76}
          accent="muted"
          variant="dashed"
          title="Combat log"
          sub={["never saved", "rebuilt exactly"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M670,362 L710,362" accent="muted" />
        <NodePanel
          x={710}
          y={324}
          w={190}
          h={76}
          accent="primary"
          emphasis
          title="Battle Theater"
          sub={["plays the log", "1x to 4x, or Skip"]}
          titleSize={17}
          subSize={12.5}
        />

        <NodePanel
          x={20}
          y={420}
          w={880}
          h={54}
          accent="emerald"
          align="left"
          title="Golden digests"
          sub={["A hash of a seeded match. Change a rule on purpose, re-record on purpose."]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={886} y={437} label="6 of 7 changed" accent="emerald" filled anchor="end" fontSize={10.5} />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

interface NumberRow {
  y: number;
  title: string;
  sub: string;
  before: number;
  after: number;
  beforeLabel: string;
  afterLabel: string;
  chip: string;
}

const BAR_X = 250;
const BAR_MAX = 380;

function NumberRowPanel({ row }: { row: NumberRow }) {
  const m = DIAGRAM_ACCENTS.muted;
  const e = DIAGRAM_ACCENTS.emerald;
  const peak = Math.max(row.before, row.after);
  const bLen = Math.max(3, (row.before / peak) * BAR_MAX);
  const aLen = Math.max(3, (row.after / peak) * BAR_MAX);
  return (
    <NodePanel
      x={20}
      y={row.y}
      w={880}
      h={64}
      accent="muted"
      align="left"
      title={row.title}
      sub={[row.sub]}
      titleSize={17}
      subSize={12.5}
    >
      <rect x={BAR_X} y={row.y + 10} width={bLen} height={18} rx={3} className={`${m.softFill} ${m.stroke}`} strokeWidth="1.25" />
      <text x={BAR_X + bLen + 10} y={row.y + 24} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
        {row.beforeLabel}
      </text>
      <rect x={BAR_X} y={row.y + 36} width={aLen} height={18} rx={3} className={`${e.softFill} ${e.stroke}`} strokeWidth="1.5" />
      <text x={BAR_X + aLen + 10} y={row.y + 50} className="fill-success font-mono font-semibold" style={{ fontSize: 12.5 }}>
        {row.afterLabel}
      </text>
      <Chip x={886} y={row.y + 21} label={row.chip} accent="emerald" filled anchor="end" fontSize={10.5} />
    </NodePanel>
  );
}

/**
 * Before and after numbers: Cann-Cann movement (bars scaled per row so
 * the longer value fills the track) and Third Conflict draw calls.
 */
export function UpgradeBeforeAfterNumbersDiagram({ caption }: DiagramProps) {
  const id = "bgp5";
  const cann: NumberRow[] = [
    { y: 94, title: "Driving speed", sub: "level ground", before: 40, after: 140, beforeLabel: "40 px/s", afterLabel: "about 140 px/s", chip: "~3.5x faster" },
    { y: 166, title: "Range per round", sub: "on default fuel", before: 60, after: 200, beforeLabel: "about 60 px", afterLabel: "about 200 px", chip: "~3x further" },
    { y: 238, title: "Steepest climb", sub: "px per px", before: 1.2, after: 2, beforeLabel: "1.2", afterLabel: "about 2", chip: "steeper" },
    { y: 310, title: "Jumps per turn", sub: "new in 3.0", before: 0, after: 2, beforeLabel: "none", afterLabel: "up to 2", chip: "new" },
  ];
  const tc: NumberRow = {
    y: 418,
    title: "Draw calls",
    sub: "200 fleets on the map",
    before: 912,
    after: 79,
    beforeLabel: "912",
    afterLabel: "79",
    chip: "hulls baked",
  };
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Each pair of bars is scaled so the longer value fills the track, so read the labels for the real numbers. Cann-Cann got faster, farther and steeper. Third Conflict went the other way on draw calls, where lower is better."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={530}
        eyebrow="Before and After, in Numbers"
        chips={[
          { label: "2 games", accent: "primary" },
          { label: "5 measures", accent: "emerald" },
        ]}
        footerRight="Design targets and measured results"
      >
        <SectionLabel x={20} y={80} label="Cann-Cann 2.0 to 3.0" accent="primary" />
        <Chip x={900} y={62} label="3.0 after" accent="emerald" filled anchor="end" fontSize={10.5} />
        <Chip x={815} y={62} label="2.0 before" accent="muted" filled anchor="end" fontSize={10.5} />
        {cann.map((row) => (
          <NumberRowPanel key={row.title} row={row} />
        ))}

        <SectionLabel x={20} y={404} label="Third Conflict 1.x to 2.0" accent="primary" />
        <NumberRowPanel row={tc} />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * Ocean Cliffs: getting into the sea is easy, getting back to the start
 * height costs more fuel than a full tank holds, on every one of 40 maps.
 * The owner kept it on purpose.
 */
export function OceanCliffsFuelDiagram({ caption }: DiagramProps) {
  const id = "bgp6";
  const scale = 1.2;
  const x0 = 480;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Measured on 40 Ocean Cliffs maps: driving back up to the starting height costs 263 fuel on average (233 to 296), and a full tank is 200. It was reachable on none of them, and I kept it that way on purpose."
      }
    >
      <EditorialFrame
        id={id}
        w={920}
        h={484}
        eyebrow="The Sea You Couldn't Leave"
        chips={[
          { label: "0 of 40 maps", accent: "red" },
          { label: "kept on purpose", accent: "amber" },
        ]}
        footerRight="Ocean Cliffs · fuel to climb back"
      >
        {/* Side view */}
        <rect x={20} y={64} width={420} height={270} rx={10} className="fill-surface-2/80 stroke-foreground/25" strokeWidth="1.25" />
        <SectionLabel x={34} y={90} label="Side view" accent="cyan" />
        <path
          d="M34,150 L170,150 L170,290 L290,290 L290,170 L426,170 L426,320 L34,320 Z"
          className="fill-foreground/[0.06] stroke-foreground/40"
          strokeWidth="1.5"
        />
        <rect x={171} y={232} width={118} height={57} className="fill-cyan-500/20" />
        <line x1={171} y1={232} x2={289} y2={232} className="stroke-cyan-500" strokeWidth="1.5" />
        <text x={262} y={282} className="fill-cyan-600 font-mono font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.1em" }}>
          SEA
        </text>
        {/* Tanks */}
        <rect x={90} y={134} width={30} height={16} rx={3} className="fill-emerald-500/30 stroke-emerald-500" strokeWidth="1.5" />
        <text x={34} y={146} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          start
        </text>
        <rect x={210} y={266} width={30} height={16} rx={3} className="fill-red-500/30 stroke-red-500" strokeWidth="1.5" />
        {/* Drop in: easy */}
        <FlowLine id={id} d="M105,134 L105,130 Q105,122 113,122 L217,122 Q225,122 225,130 L225,262" accent="emerald" width={2} />
        <text x={124} y={112} className="fill-success font-mono" style={{ fontSize: 12.5 }}>
          drive or blast in
        </text>
        {/* Climb back: expensive */}
        <FlowLine id={id} d={elbowPath(210, 274, 192, 152, "h")} accent="red" width={2} dashed />
        <text x={44} y={206} className="fill-destructive font-mono font-semibold" style={{ fontSize: 12.5 }}>
          climb back:
        </text>
        <text x={44} y={224} className="fill-destructive font-mono font-semibold" style={{ fontSize: 12.5 }}>
          263 fuel avg
        </text>
        <Chip x={426} y={92} label="water hurts each turn" accent="red" fontSize={10.5} anchor="end" />
        <Chip x={426} y={122} label="jump to get out" accent="amber" fontSize={10.5} anchor="end" />

        {/* Fuel bars */}
        <rect x={460} y={64} width={440} height={270} rx={10} className="fill-surface-2/80 stroke-foreground/25" strokeWidth="1.25" />
        <SectionLabel x={474} y={90} label="Fuel needed" accent="amber" />
        <text x={x0} y={122} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          Full tank
        </text>
        <rect x={x0} y={130} width={200 * scale} height={28} rx={4} className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x={x0 + 200 * scale + 10} y={150} className="fill-success font-heading font-bold" style={{ fontSize: 18 }}>
          200
        </text>
        <text x={x0} y={188} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          Climb back, average
        </text>
        <rect x={x0} y={196} width={263 * scale} height={28} rx={4} className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x={x0 + 263 * scale + 10} y={216} className="fill-destructive font-heading font-bold" style={{ fontSize: 18 }}>
          263
        </text>
        {/* Range whisker */}
        <path
          d={`M${x0 + 233 * scale},234 L${x0 + 233 * scale},248 M${x0 + 296 * scale},234 L${x0 + 296 * scale},248 M${x0 + 233 * scale},241 L${x0 + 296 * scale},241`}
          className="stroke-red-500"
          strokeWidth="1.5"
          fill="none"
        />
        <text x={x0 + 264.5 * scale} y={266} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          range 233 to 296
        </text>
        {/* Tank limit marker */}
        <line x1={x0 + 200 * scale} y1={106} x2={x0 + 200 * scale} y2={274} className="stroke-amber-500" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={x0 + 200 * scale} y={292} textAnchor="middle" className="fill-warning font-mono font-semibold" style={{ fontSize: 12.5 }}>
          tank limit 200
        </text>
        <Chip x={474} y={301} label="63 short on average" accent="red" filled fontSize={10.5} />

        {/* Stat tiles */}
        <NodePanel
          x={20}
          y={356}
          w={280}
          h={80}
          accent="red"
          title="120 of 120"
          sub={["placements stuck by driving,", "full fuel, before the fix"]}
          titleSize={20}
          subSize={12.5}
        />
        <NodePanel
          x={320}
          y={356}
          w={280}
          h={80}
          accent="red"
          emphasis
          title="0 of 40"
          sub={["maps where a full tank", "climbs back to the start"]}
          titleSize={20}
          subSize={12.5}
        />
        <NodePanel
          x={620}
          y={356}
          w={280}
          h={80}
          accent="amber"
          title="Keep it as is"
          sub={["down is a one-way trip", "for that round, on purpose"]}
          titleSize={20}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramLightbox>
  );
}
