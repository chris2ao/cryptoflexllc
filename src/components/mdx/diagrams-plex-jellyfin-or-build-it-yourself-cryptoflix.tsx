/** Plex, Jellyfin, or Build It Yourself? CryptoFlix post diagrams: editorial SVG, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  StepBadge,
  elbowPath,
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

/** Small mono text used for edge labels and inline notes. */
function Mono({
  x,
  y,
  children,
  anchor = "middle",
  size = 12.5,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="fill-muted-foreground font-mono"
      style={{ fontSize: size }}
    >
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Architecture                                                     */
/* ------------------------------------------------------------------ */

/**
 * Browsers reach the Mac Mini over plain HTTP. Inside it a launcher app
 * parents the CryptoFlix server and a hidden Jellyfin. The server reaches
 * the PC over read-only SMB and TMDb over HTTPS.
 */
export function CryptoFlixArchitectureDiagram({ caption }: DiagramProps) {
  const id = "cfx1";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Everything lives on the LAN. CryptoFlix owns the catalog, sign-in, and every playback session, while Jellyfin hides on localhost and only converts video the browser cannot play."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={600}
        eyebrow="CryptoFlix Architecture"
        chips={[
          { label: "LAN only", accent: "amber" },
          { label: "1 user", accent: "cyan" },
        ]}
        footerRight="Mac Mini · hidden Jellyfin · read-only PC"
      >
        {/* Browsers */}
        <NodePanel
          x={24}
          y={64}
          w={260}
          h={64}
          accent="cyan"
          title="iPhone"
          sub={["phone-first, HLS in Safari"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={310}
          y={64}
          w={260}
          h={64}
          accent="cyan"
          title="iPad"
          sub={["browser tab, HLS in Safari"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={596}
          y={64}
          w={260}
          h={64}
          accent="cyan"
          title="Mac"
          sub={["direct play when it can"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Browsers -> Mac Mini bus */}
        {[154, 440, 726].map((cx) => (
          <path
            key={cx}
            d={`M${cx},128 L${cx},146`}
            fill="none"
            className="stroke-cyan-500/50"
            strokeWidth="1.5"
          />
        ))}
        <path d="M154,146 L726,146" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M440,146 L440,184" accent="cyan" />
        <Chip x={428} y={153} label="LAN only" accent="amber" filled anchor="end" fontSize={11} />
        <Chip x={452} y={153} label="plain HTTP" accent="amber" filled fontSize={11} />

        {/* Mac Mini container */}
        <rect
          x={24}
          y={184}
          width={832}
          height={250}
          rx={12}
          strokeDasharray="6 4"
          className="fill-foreground/[0.03] stroke-foreground/30"
          strokeWidth="1.25"
        />
        <SectionLabel x={44} y={210} label="Mac Mini" accent="primary" fontSize={13} />
        <Mono x={836} y={210} anchor="end">
          always on · external drive
        </Mono>

        {/* Launcher */}
        <NodePanel
          x={44}
          y={222}
          w={792}
          h={60}
          accent="amber"
          align="left"
          title="Launcher app"
          sub={["signed Swift supervisor: one privacy grant covers every child"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M244,282 L244,316" accent="amber" />
        <FlowLine id={id} d="M698,282 L698,316" accent="amber" />

        {/* CryptoFlix server */}
        <NodePanel
          x={44}
          y={316}
          w={400}
          h={96}
          accent="primary"
          emphasis
          align="left"
          title=""
          titleSize={17}
        >
          <text
            x={58}
            y={340}
            className="fill-primary font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            CryptoFlix server
          </text>
          <Mono x={58} y={362} anchor="start" size={13}>
            catalog + TMDb
          </Mono>
          <Mono x={58} y={384} anchor="start" size={13}>
            sign-in, search
          </Mono>
          <Mono x={236} y={362} anchor="start" size={13}>
            PC monitor
          </Mono>
          <Mono x={236} y={384} anchor="start" size={13}>
            playback + HLS proxy
          </Mono>
        </NodePanel>

        {/* Jellyfin (hidden) */}
        <NodePanel
          x={560}
          y={316}
          w={276}
          h={96}
          accent="violet"
          variant="dashed"
          align="left"
          title="Jellyfin (hidden)"
          sub={["127.0.0.1 only, no web UI", "VideoToolbox transcode"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M444,352 L560,352" accent="violet" />
        <FlowLine id={id} d="M560,380 L444,380" accent="violet" />
        <Mono x={502} y={341} size={12}>
          HLS
        </Mono>

        {/* Server -> PC */}
        <FlowLine id={id} d="M234,412 L234,486" accent="muted" />
        <Mono x={222} y={466} anchor="end">
          read-only SMB 3
        </Mono>
        <NodePanel
          x={24}
          y={486}
          w={420}
          h={70}
          align="left"
          title="Windows PC"
          sub={["every drive shared read-only", "probed every 30 s, runs nothing"]}
          titleSize={17}
          subSize={12.5}
        />
        <Chip x={430} y={498} label="may be off" accent="amber" anchor="end" fontSize={11} />

        {/* Server -> TMDb */}
        <FlowLine
          id={id}
          d="M400,412 L400,452 Q400,460 408,460 L670,460 Q678,460 678,468 L678,486"
          accent="muted"
        />
        <Mono x={540} y={450}>
          HTTPS
        </Mono>
        <NodePanel
          x={500}
          y={486}
          w={356}
          h={70}
          align="left"
          title="TMDb"
          sub={["titles, cast, genres", "outbound lookups only"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Six-day timeline                                                 */
/* ------------------------------------------------------------------ */

const DAYS = [
  {
    day: "Sat",
    n: "DAY 1",
    accent: "muted" as const,
    lines: ["approach chosen", "design approved", "iPhone test ok"],
  },
  {
    day: "Sun",
    n: "DAY 2",
    accent: "muted" as const,
    lines: ["spike committed", "auth merged", "PC monitor", "setup scripts"],
  },
  {
    day: "Mon",
    n: "DAY 3",
    accent: "cyan" as const,
    lines: ["launcher app", "SMB mounter", "Jellyfin boot"],
  },
  {
    day: "Tue",
    n: "DAY 4",
    accent: "amber" as const,
    lines: ["catalog backend", "deployed"],
  },
  {
    day: "Wed",
    n: "DAY 5",
    accent: "muted" as const,
    lines: ["browse UI", "playback server", "web player", "search, people", "file browser"],
  },
  {
    day: "Thu",
    n: "DAY 6",
    accent: "emerald" as const,
    lines: ["2nd source type", "browse + binge", "redesign"],
  },
];

/** Six day-columns from the first message to the redesign, two milestones flagged. */
export function CryptoFlixSixDayTimelineDiagram({ caption }: DiagramProps) {
  const id = "cfx2";
  const colW = 132;
  const gap = 8;
  const x0 = 24;
  const top = 168;
  const colH = 176;
  const colX = (i: number) => x0 + i * (colW + gap);
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Six calendar days from first message to redesign. The app was live on an iPhone on day three with an empty library, and the second source type shipped on day six without losing a row."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={472}
        eyebrow="Six Days, Spike to Redesign"
        chips={[{ label: "200+ subagents", accent: "primary" }]}
        footerRight="Sat to Thu · MVP first"
      >
        {/* Milestone flags */}
        <NodePanel
          x={24}
          y={66}
          w={220}
          h={66}
          accent="muted"
          title="First message"
          sub={["Sat 20:54"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d={`M${colX(0) + colW / 2},132 L${colX(0) + colW / 2},${top}`} accent="muted" />
        <NodePanel
          x={260}
          y={66}
          w={220}
          h={66}
          accent="cyan"
          emphasis
          title="Live, empty library"
          sub={["iPhone, Mon 22:59"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d={`M${colX(2) + colW / 2},132 L${colX(2) + colW / 2},${top}`} accent="cyan" />
        <NodePanel
          x={636}
          y={66}
          w={220}
          h={66}
          accent="emerald"
          emphasis
          title="0 rows lost"
          sub={["second source type"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d={`M${colX(5) + colW / 2},132 L${colX(5) + colW / 2},${top}`} accent="emerald" />

        {/* Day columns */}
        {DAYS.map((d, i) => (
          <NodePanel
            key={d.day}
            x={colX(i)}
            y={top}
            w={colW}
            h={colH}
            accent={d.accent}
            emphasis={d.accent === "cyan" || d.accent === "emerald"}
            title={d.day}
            sub={d.lines}
            titleSize={18}
            subSize={13}
          />
        ))}

        {/* Rail */}
        <path d="M24,390 L850,390" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M842,384 L856,390 L842,396 Z" className="fill-muted-foreground" />
        {DAYS.map((d, i) => (
          <g key={d.n}>
            <circle
              cx={colX(i) + colW / 2}
              cy={390}
              r={5}
              className={
                d.accent === "cyan"
                  ? "fill-cyan-500"
                  : d.accent === "emerald"
                    ? "fill-emerald-500"
                    : d.accent === "amber"
                      ? "fill-amber-500"
                      : "fill-muted-foreground"
              }
            />
            <text
              x={colX(i) + colW / 2}
              y={412}
              textAnchor="middle"
              className="fill-muted-foreground font-mono font-semibold"
              style={{ fontSize: 11, letterSpacing: "0.1em" }}
            >
              {d.n}
            </text>
          </g>
        ))}
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Thread pool                                                      */
/* ------------------------------------------------------------------ */

/** A grid of pool slots: the first `hung` slots are stuck, the rest are free. */
function SlotGrid({
  x,
  y,
  cols,
  rows,
  hung,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  hung: number;
}) {
  const w = 26;
  const h = 20;
  const gapX = 6.4;
  const gapY = 6;
  const cells = Array.from({ length: cols * rows }, (_, i) => i);
  return (
    <g>
      {cells.map((i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const stuck = i < hung;
        return (
          <rect
            key={i}
            x={x + col * (w + gapX)}
            y={y + row * (h + gapY)}
            width={w}
            height={h}
            rx={4}
            className={
              stuck
                ? "fill-red-500/25 stroke-red-500"
                : "fill-emerald-500/10 stroke-emerald-500/50"
            }
            strokeWidth="1.25"
          />
        );
      })}
    </g>
  );
}

/** Four default libuv slots all stuck on dead SMB reads vs 64 slots plus forced unmount. */
export function DeadShareThreadPoolDiagram({ caption }: DiagramProps) {
  const id = "cfx3";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Node gives file work 4 threads by default. Eight reads hung on a dead share were enough to starve an unrelated local read for over 150 seconds, while timers and health checks kept answering fine."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={556}
        eyebrow="Hung Reads vs. the Thread Pool"
        chips={[
          { label: "150+ s blocked", accent: "red" },
          { label: "1 ms fixed", accent: "emerald" },
        ]}
        footerRight="libuv pool · dead SMB share"
      >
        {/* BEFORE */}
        <SectionLabel x={24} y={84} label="Before: 4 default threads" accent="red" />
        <rect
          x={24}
          y={98}
          width={560}
          height={132}
          rx={10}
          className="fill-red-500/[0.04] stroke-red-500/40"
          strokeWidth="1.25"
        />
        {[40, 172, 304, 436].map((px, i) => (
          <NodePanel
            key={px}
            x={px}
            y={110}
            w={124}
            h={58}
            accent="red"
            title="hung read"
            sub={[`SMB, slot ${i + 1}`]}
            titleSize={15}
            subSize={12}
          />
        ))}
        {[40, 172, 304, 436].map((px) => (
          <NodePanel
            key={`q${px}`}
            x={px}
            y={178}
            w={124}
            h={40}
            accent="red"
            variant="dashed"
            title="queued read"
            titleSize={13.5}
          />
        ))}
        <FlowLine id={id} d="M584,152 L640,152" accent="red" />
        <NodePanel
          x={640}
          y={98}
          w={216}
          h={76}
          accent="red"
          emphasis
          title="Local file read"
          sub={["no free slot", "blocked 150+ s"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={640}
          y={182}
          w={216}
          h={48}
          accent="emerald"
          title="Health check: fine"
          sub={["touches no files"]}
          titleSize={14}
          subSize={11.5}
        />

        {/* AFTER */}
        <SectionLabel x={24} y={270} label="After: 64 threads" accent="emerald" />
        <rect
          x={24}
          y={284}
          width={560}
          height={150}
          rx={10}
          className="fill-emerald-500/[0.04] stroke-emerald-500/40"
          strokeWidth="1.25"
        />
        <SlotGrid x={44} y={298} cols={16} rows={4} hung={8} />
        <Mono x={44} y={422} anchor="start">
          8 hung reads hold 8 slots, 56 stay free
        </Mono>
        <FlowLine id={id} d="M584,322 L640,322" accent="emerald" />
        <NodePanel
          x={640}
          y={284}
          w={216}
          h={76}
          accent="emerald"
          emphasis
          title="Local file read"
          sub={["free slot", "done in 1 ms"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={640}
          y={372}
          w={216}
          h={62}
          accent="muted"
          title="In the launch script"
          sub={["UV_THREADPOOL_SIZE=64"]}
          titleSize={14}
          subSize={12}
        />

        {/* Forced unmount */}
        <NodePanel
          x={24}
          y={450}
          w={832}
          h={62}
          accent="emerald"
          emphasis
          align="left"
          title="Forced unmount on the first failed port 445 probe"
          sub={["frees the hung calls in about 1 s"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Migration                                                        */
/* ------------------------------------------------------------------ */

/** Foreign keys left on cascade-delete watch history; the runner flips them off and checks. */
export function WatchHistoryMigrationDiagram({ caption }: DiagramProps) {
  const id = "cfx4";
  const stepX = [24, 238, 452, 666];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Inside a transaction the migration's own PRAGMA does nothing, so dropping the table cascaded into watch history. The runner turns foreign keys off first, checks afterward, and only then turns them back on."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={550}
        eyebrow="The Migration That Nearly Erased History"
        chips={[
          { label: "scratch copy first", accent: "amber" },
          { label: "0 rows lost", accent: "emerald" },
        ]}
        footerRight="SQLite · foreign keys · drizzle"
      >
        {/* Naive lane */}
        <SectionLabel x={24} y={84} label="Naive: PRAGMA inside the transaction" accent="red" />
        <NodePanel
          x={24}
          y={100}
          w={190}
          h={104}
          accent="amber"
          title="Migration starts"
          sub={["foreign_keys=OFF", "a no-op in the txn"]}
          titleSize={17}
          subSize={12}
        />
        <FlowLine id={id} d="M214,152 L242,152" accent="amber" />
        <NodePanel
          x={242}
          y={100}
          w={190}
          h={104}
          accent="red"
          emphasis
          title="DROP TABLE sources"
          sub={["foreign keys", "still ON"]}
          titleSize={15}
          subSize={12.5}
        />
        {/* fan-out bus */}
        <path d="M432,152 L452,152" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <path d="M452,124 L452,180" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M452,124 L468,124" accent="red" />
        <FlowLine id={id} d="M452,180 L468,180" accent="red" />
        <NodePanel
          x={468}
          y={100}
          w={210}
          h={48}
          accent="red"
          title="watch_progress"
          sub={["emptied by cascade"]}
          titleSize={14}
          subSize={11.5}
        />
        <NodePanel
          x={468}
          y={156}
          w={210}
          h={48}
          accent="red"
          title="playback_sessions"
          sub={["emptied by cascade"]}
          titleSize={14}
          subSize={11.5}
        />
        {/* fan-in bus */}
        <path d="M678,124 L694,124" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <path d="M678,180 L694,180" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <path d="M694,124 L694,180" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M694,152 L712,152" accent="red" />
        <NodePanel
          x={712}
          y={100}
          w={144}
          h={104}
          accent="red"
          emphasis
          title="History gone"
          sub={["no error", "raised"]}
          titleSize={15}
          subSize={12.5}
        />

        {/* Fixed lane */}
        <SectionLabel x={24} y={262} label="Fixed: the runner owns the pragma" accent="emerald" />
        <NodePanel
          x={stepX[0]}
          y={302}
          w={190}
          h={96}
          accent="muted"
          title="Keys off"
          sub={["foreign_keys = OFF", "before the txn"]}
          titleSize={17}
          subSize={12}
        />
        <NodePanel
          x={stepX[1]}
          y={302}
          w={190}
          h={96}
          accent="muted"
          title="Run migration"
          sub={["drizzle migrate()", "table rebuilt"]}
          titleSize={17}
          subSize={12}
        />
        <NodePanel
          x={stepX[2]}
          y={302}
          w={190}
          h={96}
          accent="amber"
          emphasis
          title="Check"
          sub={["foreign_key_check", "throws on a violation"]}
          titleSize={17}
          subSize={12}
        />
        <NodePanel
          x={stepX[3]}
          y={302}
          w={190}
          h={96}
          accent="emerald"
          title="Keys back on"
          sub={["foreign_keys = ON"]}
          titleSize={17}
          subSize={12}
        />
        <FlowLine id={id} d="M214,350 L238,350" accent="emerald" />
        <FlowLine id={id} d="M428,350 L452,350" accent="emerald" />
        <FlowLine id={id} d="M642,350 L666,350" accent="emerald" />
        {stepX.map((sx, i) => (
          <StepBadge
            key={sx}
            cx={sx + 24}
            cy={286}
            n={i + 1}
            accent={i === 2 ? "amber" : i === 3 ? "emerald" : "primary"}
          />
        ))}

        {/* Result band */}
        <FlowLine id={id} d="M761,398 L761,426" accent="emerald" width={2} />
        <NodePanel
          x={24}
          y={426}
          w={832}
          h={78}
          accent="emerald"
          emphasis
          align="left"
          title="Shipped to production, Thursday 06:37"
          sub={["rollback copy first, lost-row check by id after"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={840} y={453} label="0 rows lost" accent="emerald" filled anchor="end" fontSize={12} />
        </NodePanel>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Autoplay                                                         */
/* ------------------------------------------------------------------ */

/** A fresh video element per episode needs a tap each time; one persistent element needs one. */
export function SameVideoElementDiagram({ caption }: DiagramProps) {
  const id = "cfx5";
  const rejected = [24, 335, 646];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "On iOS the user gesture belongs to the video element. A new element per episode would wait for a tap every time, so swapTo changes only the source and one tap carries a whole run."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={540}
        eyebrow="Keeping iPhone Autoplay Alive"
        chips={[
          { label: "1 tap per run", accent: "emerald" },
        ]}
        footerRight="Vidstack · swapTo · iOS gesture rule"
      >
        {/* Rejected lane */}
        <SectionLabel x={24} y={84} label="Rejected: a fresh element per episode" accent="red" />
        {["A", "B", "C"].map((letter, i) => (
          <NodePanel
            key={letter}
            x={rejected[i]}
            y={100}
            w={210}
            h={84}
            accent="red"
            title={`video element ${letter}`}
            sub={[`plays episode ${i + 1}`]}
            titleSize={15}
            subSize={12.5}
          />
        ))}
        {[234, 545].map((lx) => (
          <g key={lx}>
            <FlowLine id={id} d={`M${lx},142 L${lx + 101},142`} accent="red" />
            <Chip x={lx + 31} y={104} label="tap" accent="red" filled fontSize={11} />
            <Mono x={lx + 50} y={166} size={12}>
              gesture lost
            </Mono>
          </g>
        ))}

        {/* Chosen lane */}
        <SectionLabel x={24} y={230} label="Chosen: one persistent element" accent="emerald" />
        {[1, 2, 3].map((ep, i) => (
          <NodePanel
            key={ep}
            x={24}
            y={248 + i * 56}
            w={190}
            h={48}
            title={`Episode ${ep} stream`}
            titleSize={14}
          />
        ))}
        {[272, 328, 384].map((cy) => (
          <path
            key={cy}
            d={`M214,${cy} L238,${cy}`}
            fill="none"
            className="stroke-emerald-500/50"
            strokeWidth="1.5"
          />
        ))}
        <path d="M238,272 L238,384" fill="none" className="stroke-emerald-500/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M238,328 L316,328" accent="emerald" />
        <rect
          x={243}
          y={298}
          width={68}
          height={22}
          rx={5}
          className="fill-emerald-500/10 stroke-emerald-500"
          strokeWidth="1"
        />
        <text
          x={277}
          y={313}
          textAnchor="middle"
          className="fill-success font-mono font-semibold"
          style={{ fontSize: 11.5 }}
        >
          swapTo()
        </text>
        <NodePanel
          x={316}
          y={248}
          w={300}
          h={160}
          accent="emerald"
          emphasis
          terminal
          title="One video in Vidstack"
          sub={["gesture stays with the element", "old session ends, next starts", "only the source changes"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M616,288 L656,288" accent="amber" dashed />
        <NodePanel
          x={656}
          y={248}
          w={200}
          h={80}
          accent="amber"
          variant="dashed"
          title="Start playing"
          sub={["shown if the first", "autoplay is refused"]}
          titleSize={15}
          subSize={12}
        />
        <FlowLine id={id} d="M756,328 L756,352" accent="emerald" />
        <NodePanel
          x={656}
          y={352}
          w={200}
          h={56}
          accent="emerald"
          title="One tap"
          sub={["carries the whole run"]}
          titleSize={15}
          subSize={12}
        />

        {/* Rule band */}
        <NodePanel
          x={24}
          y={436}
          w={832}
          h={62}
          accent="primary"
          align="left"
          title="The gesture belongs to the element"
          sub={["Safari on iOS needs a user gesture to play a video, so the element must outlive the episode"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Classic vs new design                                            */
/* ------------------------------------------------------------------ */

/** Mock poster cards: classic is rounded with a shadow, new is square-cornered with a hairline. */
function MockPosters({ x, y, kind }: { x: number; y: number; kind: "classic" | "next" }) {
  const classic = kind === "classic";
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const px = x + i * 112;
        return (
          <g key={i}>
            {classic && (
              <rect x={px + 3} y={y + 5} width={96} height={104} rx={12} className="fill-foreground/10" />
            )}
            <rect
              x={px}
              y={y}
              width={96}
              height={104}
              rx={classic ? 12 : 3}
              className={
                classic
                  ? "fill-surface-2/80 stroke-amber-500/60"
                  : "fill-surface-2/80 stroke-primary/60"
              }
              strokeWidth={classic ? 1.5 : 1}
            />
            <rect
              x={px + 8}
              y={y + 8}
              width={80}
              height={58}
              rx={classic ? 8 : 2}
              className={classic ? "fill-amber-500/20" : "fill-primary/20"}
            />
            <rect
              x={px + 8}
              y={y + 76}
              width={64}
              height={7}
              rx={classic ? 3.5 : 1}
              className="fill-foreground/25"
            />
            <rect
              x={px + 8}
              y={y + 90}
              width={40}
              height={6}
              rx={classic ? 3 : 1}
              className={classic ? "fill-foreground/15" : "fill-primary/50"}
            />
          </g>
        );
      })}
    </g>
  );
}

/** Classic and Cyber Editorial designs side by side, one set of components re-themed. */
export function ClassicVsNewDesignDiagram({ caption }: DiagramProps) {
  const id = "cfx6";
  const specs: Record<"classic" | "next", string[]> = {
    classic: ["rounded, shadowed cards", "amber accent", "system fonts"],
    next: ["4 px radii, hairline borders", "one teal accent", "Space Grotesk + JetBrains Mono"],
  };
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The same components in two designs. Under html[data-design=\"next\"] the classic tokens point at new values, and a per-browser toggle picks which one each device sees."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={554}
        eyebrow="Classic vs. Cyber Editorial"
        chips={[{ label: "2 designs", accent: "primary" }]}
        footerRight="Design toggle · per browser"
      >
        {/* Classic card */}
        <NodePanel
          x={24}
          y={66}
          w={360}
          h={60}
          accent="amber"
          align="left"
          title="Classic design"
          sub={["the original look"]}
          titleSize={17}
          subSize={12.5}
        />
        <rect
          x={24}
          y={136}
          width={360}
          height={216}
          rx={10}
          className="fill-surface-1/80 stroke-foreground/15"
          strokeWidth="1"
        />
        <MockPosters x={44} y={148} kind="classic" />
        {specs.classic.map((line, i) => (
          <g key={line}>
            <rect x={44} y={272 + i * 24} width={7} height={7} className="fill-amber-500" />
            <Mono x={60} y={280 + i * 24} anchor="start" size={13}>
              {line}
            </Mono>
          </g>
        ))}

        {/* New card */}
        <NodePanel
          x={496}
          y={66}
          w={360}
          h={60}
          accent="primary"
          emphasis
          align="left"
          title="Cyber Editorial"
          sub={["the new default"]}
          titleSize={17}
          subSize={12.5}
        />
        <rect
          x={496}
          y={136}
          width={360}
          height={216}
          rx={10}
          className="fill-surface-1/80 stroke-primary/30"
          strokeWidth="1"
        />
        <MockPosters x={516} y={148} kind="next" />
        {specs.next.map((line, i) => (
          <g key={line}>
            <rect x={516} y={272 + i * 24} width={7} height={7} className="fill-primary" />
            <Mono x={532} y={280 + i * 24} anchor="start" size={13}>
              {line}
            </Mono>
          </g>
        ))}

        {/* Re-theme arrow */}
        <FlowLine id={id} d="M384,226 L496,226" accent="primary" width={2} />
        <Chip x={400} y={196} label="re-themed" accent="primary" filled fontSize={11} />
        <Mono x={440} y={250} size={12}>
          not rewritten
        </Mono>

        {/* Token band */}
        <NodePanel
          x={24}
          y={370}
          w={832}
          h={58}
          accent="cyan"
          align="left"
          title="Same components, new tokens"
          sub={["html[data-design=\"next\"] points the classic token names at new values"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Toggle band */}
        <FlowLine id={id} d={elbowPath(440, 428, 440, 450)} accent="primary" />
        <NodePanel
          x={24}
          y={450}
          w={832}
          h={58}
          accent="primary"
          emphasis
          align="left"
          title="Per-browser toggle, defaults to new"
          sub={["saved in localStorage, never sent to the server, so phone and Mac can differ"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}
