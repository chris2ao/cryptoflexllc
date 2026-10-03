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
  monoWidth,
  DIAGRAM_ACCENTS,
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
 * the PC over read-only SMB, and TMDb and the cloud storage provider's API
 * over HTTPS. Cloud segments are proxied so no token reaches a browser.
 */
export function CryptoFlixArchitectureDiagram({ caption }: DiagramProps) {
  const id = "cfx1";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The app is reachable only on the LAN, but it calls out over HTTPS to TMDb and to the cloud storage provider's API. CryptoFlix owns the catalog, sign-in, and every playback session, and proxies cloud segments so no token reaches a browser. Jellyfin hides on localhost and only converts video the browser cannot play."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={714}
        eyebrow="CryptoFlix Architecture"
        chips={[
          { label: "inbound: LAN only", accent: "amber" },
          { label: "1 user", accent: "cyan" },
        ]}
        footerRight="Mac Mini · hidden Jellyfin · PC + cloud"
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
        <FlowLine id={id} d="M159,412 L159,548" accent="muted" />
        <Mono x={171} y={490} anchor="start">
          read-only SMB 3
        </Mono>
        <NodePanel x={24} y={548} w={270} h={120} accent="muted" align="left" title="">
          <text
            x={38}
            y={578}
            className="fill-foreground font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            Windows PC
          </text>
          <Mono x={38} y={602} anchor="start">
            every drive shared read-only
          </Mono>
          <Mono x={38} y={621} anchor="start">
            probed every 30 s, runs nothing
          </Mono>
          <Chip x={38} y={634} label="may be off" accent="amber" fontSize={11} />
        </NodePanel>

        {/* Server -> TMDb */}
        <FlowLine id={id} d="M360,412 L360,548" accent="muted" />
        <Mono x={350} y={490} anchor="end">
          HTTPS
        </Mono>
        <NodePanel
          x={310}
          y={548}
          w={200}
          h={120}
          align="left"
          title="TMDb"
          sub={["titles, cast, genres", "outbound lookups only"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Server <-> Cloud storage: request out, proxied segments back */}
        <FlowLine
          id={id}
          d="M396,412 L396,502 Q396,510 404,510 L632,510 Q640,510 640,518 L640,548"
          accent="emerald"
        />
        <Mono x={412} y={502} anchor="start">
          HTTPS · token in a header
        </Mono>
        <FlowLine
          id={id}
          d="M800,548 L800,474 Q800,466 792,466 L438,466 Q430,466 430,458 L430,412"
          accent="emerald"
        />
        <Mono x={450} y={458} anchor="start">
          segments proxied · no token to the browser
        </Mono>
        <NodePanel
          x={526}
          y={548}
          w={330}
          h={120}
          accent="emerald"
          emphasis
          align="left"
          title=""
        >
          <text
            x={540}
            y={578}
            className="fill-success font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            Cloud storage
          </text>
          <Mono x={540} y={602} anchor="start">
            browse and stream only
          </Mono>
          <Mono x={540} y={621} anchor="start">
            HLS after conversion
          </Mono>
          <Chip x={540} y={634} label="plays with the PC off" accent="emerald" filled fontSize={11} />
        </NodePanel>
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
    lines: ["cloud storage", "source", "browse + binge", "redesign"],
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
        "Six calendar days from first message to redesign. The app was live on an iPhone on day three with an empty library, and the cloud storage source shipped on day six without losing a row."
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
          sub={["cloud storage source"]}
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

/* ------------------------------------------------------------------ */
/* 7. Two sources, one catalog                                         */
/* ------------------------------------------------------------------ */

/**
 * PC and cloud lanes feed one Identify step, which lands both files on one
 * title. A Reach gate then decides which copy plays, PC first.
 */
export function TwoSourcesOneCatalogDiagram({ caption }: DiagramProps) {
  const id = "cfx7";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Two lanes feed one catalog. A cloud file is a row in the same sources table and is identified exactly like a PC file, so one title can hold both copies. Play takes the requested copy if it can, else the other, PC first, which is why the cloud copy plays while the PC is off."
      }
    >
      <EditorialFrame
        id={id}
        w={880}
        h={436}
        eyebrow="Two Sources, One Catalog"
        chips={[
          { label: "no merge step", accent: "cyan" },
          { label: "PC first", accent: "amber" },
        ]}
        footerRight="sources table · identify · reach"
      >
        {/* Source lanes */}
        <NodePanel
          x={24}
          y={70}
          w={270}
          h={84}
          accent="cyan"
          align="left"
          title="Windows PC"
          sub={["polled every 2 min", "while online"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={24}
          y={166}
          w={270}
          h={84}
          accent="emerald"
          align="left"
          title="Cloud storage"
          sub={["full listing every 10 min", "while connected"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Fan-in bus */}
        <path d="M294,112 L310,112" fill="none" className="stroke-primary/50" strokeWidth="1.5" />
        <path d="M294,208 L310,208" fill="none" className="stroke-primary/50" strokeWidth="1.5" />
        <path d="M310,112 L310,208" fill="none" className="stroke-primary/50" strokeWidth="1.5" />
        <FlowLine id={id} d="M310,160 L330,160" accent="primary" />

        {/* Identify */}
        <NodePanel
          x={330}
          y={110}
          w={186}
          h={100}
          accent="primary"
          title="Identify"
          sub={["same lookup", "for both sources"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id={id} d="M516,160 L556,160" accent="primary" />

        {/* One title, two copies */}
        <NodePanel
          x={556}
          y={70}
          w={300}
          h={180}
          accent="primary"
          emphasis
          align="left"
          title=""
        >
          <text
            x={572}
            y={98}
            className="fill-primary font-heading font-semibold"
            style={{ fontSize: 17 }}
          >
            One title, two copies
          </text>
          <NodePanel
            x={572}
            y={112}
            w={268}
            h={60}
            accent="cyan"
            align="left"
            title="PC copy"
            sub={["online, last poll saw it"]}
            titleSize={15}
            subSize={12.5}
          />
          <NodePanel
            x={572}
            y={180}
            w={268}
            h={60}
            accent="emerald"
            align="left"
            title="Cloud copy"
            sub={["connected, last sync saw it"]}
            titleSize={15}
            subSize={12.5}
          />
        </NodePanel>

        {/* Title -> Reach */}
        <FlowLine id={id} d="M706,250 L706,296" accent="amber" />

        {/* Reach gate */}
        <NodePanel
          x={330}
          y={296}
          w={526}
          h={84}
          accent="amber"
          emphasis
          align="left"
          title="Reach"
          sub={["plays if any copy can · PC first", "else: PC offline, not connected, missing"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Reach -> PC-offline note */}
        <FlowLine id={id} d="M330,338 L294,338" accent="emerald" dashed />
        <NodePanel
          x={24}
          y={296}
          w={270}
          h={84}
          accent="emerald"
          variant="dashed"
          align="left"
          title="PC offline?"
          sub={["the cloud copy plays", "PC-only titles show PC offline"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* 8. The shopping trip scorecard                                      */
/* ------------------------------------------------------------------ */

type Fit = "fits" | "caveats" | "missed" | "untested";

interface ScoreCell {
  fit: Fit;
  verdict: string;
  details: string[];
  /** Screen-reader text, for cells whose details wrap one phrase across lines. */
  sr?: string;
}

interface ScoreRow {
  label: string;
  mustHave?: boolean;
  cells: [ScoreCell, ScoreCell, ScoreCell];
}

interface ScoreColumn {
  name: string;
  maker: string;
  basis: string;
  accent: DiagramAccent;
}

const SCORE_COLUMNS: ScoreColumn[] = [
  { name: "Plex", maker: "Plex, the company", basis: "used it", accent: "muted" },
  { name: "Jellyfin", maker: "open-source project", basis: "tested", accent: "violet" },
  { name: "CryptoFlix", maker: "me, with Claude Code", basis: "built it", accent: "primary" },
];

const SCORE_ROWS: ScoreRow[] = [
  {
    label: "Sign-in",
    cells: [
      {
        fit: "caveats",
        verdict: "Plex account sign-in",
        details: ["on by default once claimed", "LAN too; advanced bypass"],
        sr: "Plex account sign-in, on by default once a server is claimed, LAN too; an advanced bypass exists",
      },
      { fit: "fits", verdict: "No cloud account", details: ["local server users"] },
      { fit: "fits", verdict: "One local password", details: ["one user"] },
    ],
  },
  {
    label: "Cost",
    cells: [
      {
        fit: "caveats",
        verdict: "Free at home",
        details: ["Pass $6.99/mo, $69.99/yr", "or $749.99 lifetime", "remote paid since 2025-04-29"],
        sr: "Free at home; Plex Pass $6.99/mo, $69.99/yr, or $749.99 lifetime; remote streaming paid since 2025-04-29",
      },
      { fit: "fits", verdict: "Free", details: ["open source, GPL"] },
      {
        fit: "caveats",
        verdict: "No license fee",
        details: ["TMDb free, non-commercial", "costs time and upkeep"],
      },
    ],
  },
  {
    label: "Look and feel",
    cells: [
      {
        fit: "missed",
        verdict: "Plex's own apps",
        details: ["the look is Plex's", "beside its ad-supported TV"],
      },
      { fit: "missed", verdict: "Jellyfin's own look", details: ["as shipped"] },
      { fit: "fits", verdict: "Fully custom", details: ["two designs"] },
    ],
  },
  {
    label: "Codec handling",
    cells: [
      { fit: "caveats", verdict: "Server transcodes", details: ["hardware accel: Plex Pass"] },
      { fit: "fits", verdict: "FFmpeg transcoding", details: ["free hardware acceleration"] },
      {
        fit: "fits",
        verdict: "Direct play first",
        details: ["when the browser can decode", "else hidden Jellyfin to HLS", "on Apple's VideoToolbox"],
        sr: "Direct play when the browser can decode it, else hidden Jellyfin to HLS on Apple's VideoToolbox",
      },
    ],
  },
  {
    label: "Whole-PC file access",
    mustHave: true,
    cells: [
      { fit: "missed", verdict: "Library folders only", details: ["no whole-drive browser"] },
      { fit: "missed", verdict: "Library folders only", details: ["no whole-drive browser"] },
      { fit: "fits", verdict: "Every PC drive", details: ["read-only file browser"] },
    ],
  },
  {
    label: "When the PC is off",
    mustHave: true,
    cells: [
      { fit: "untested", verdict: "Not tested here", details: ["no head-to-head test"] },
      {
        fit: "caveats",
        verdict: "Keeps items offline",
        details: ["if its library roots are", "deep enough (spike result)"],
        sr: "Keeps items offline if its library roots are deep enough (spike result)",
      },
      {
        fit: "fits",
        verdict: "Badged offline, no hangs",
        details: ["about 45 s worst case", "cloud copies keep playing"],
      },
    ],
  },
];

const SCORE_FIT: Record<Fit, { label: string; bar: string }> = {
  fits: { label: "fits what I wanted", bar: "fill-emerald-500" },
  caveats: { label: "with caveats", bar: "fill-amber-500" },
  missed: { label: "doesn't fit", bar: "fill-foreground/25" },
  untested: { label: "not tested here", bar: "fill-foreground/15" },
};

/** Shape and color both carry the fit, so it reads without color too. */
function FitMark({ cx, cy, fit }: { cx: number; cy: number; fit: Fit }) {
  const r = 8.5;
  if (fit === "fits") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} className="fill-emerald-500/15 stroke-emerald-500" strokeWidth="1.5" />
        <path
          d={`M${cx - 4},${cy + 0.5} L${cx - 1},${cy + 3.5} L${cx + 4.5},${cy - 3}`}
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }
  if (fit === "caveats") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
        <path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} Z`} className="fill-amber-500" />
      </g>
    );
  }
  if (fit === "missed") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} className="stroke-foreground/35" strokeWidth="1.5" />
        <path
          d={`M${cx - 4},${cy} L${cx + 4},${cy}`}
          className="stroke-foreground/45"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    );
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className="stroke-foreground/35" strokeWidth="1.5" strokeDasharray="2.5 2.5" />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        className="fill-muted-foreground font-mono font-semibold"
        style={{ fontSize: 11 }}
      >
        ?
      </text>
    </g>
  );
}

/** Column names on their own: muted reads as plain foreground. */
function scoreNameFill(col: ScoreColumn): string {
  return col.accent === "muted" ? "fill-foreground" : DIAGRAM_ACCENTS[col.accent].text;
}

/** Cell height for a verdict line plus `n` mono detail lines `step` apart. */
function scoreCellHeight(n: number, step = 17): number {
  return n === 0 ? 40 : 40 + n * step;
}

/**
 * One scorecard cell. With `column`, the product name sits in a left
 * gutter, for the phone layout where the cells stack instead of lining
 * up under column headers.
 */
function ScoreCellPanel({
  x,
  y,
  w,
  h,
  cell,
  column,
  emphasis = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  cell: ScoreCell;
  column?: ScoreColumn;
  emphasis?: boolean;
}) {
  const textX = column ? x + 104 : x + 18;
  const detailSize = column ? 13.5 : 12.5;
  const step = column ? 18 : 17;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        className={`fill-surface-2/80 ${emphasis ? "stroke-primary/45" : "stroke-foreground/15"}`}
        strokeWidth="1"
      />
      {column && (
        <text
          x={x + 18}
          y={y + 25}
          className={`${scoreNameFill(column)} font-heading font-semibold`}
          style={{ fontSize: 13.5 }}
        >
          {column.name}
        </text>
      )}
      <rect x={x + 5} y={y + 9} width={3} height={h - 18} rx={1.5} className={SCORE_FIT[cell.fit].bar} />
      <text
        x={textX}
        y={y + 25}
        className="fill-foreground font-heading font-semibold"
        style={{ fontSize: 16 }}
      >
        {cell.verdict}
      </text>
      {cell.details.map((line, i) => (
        <text
          key={line}
          x={textX}
          y={y + 44 + i * step}
          className="fill-muted-foreground font-mono"
          style={{ fontSize: detailSize }}
        >
          {line}
        </text>
      ))}
      <FitMark cx={x + w - 20} cy={y + 20} fit={cell.fit} />
    </g>
  );
}

/** Legend entries laid out left to right, `perLine` to a line. */
function scoreLegend(perLine: number, colStep: number | null) {
  const fits = Object.keys(SCORE_FIT) as Fit[];
  return fits.reduce<{ fit: Fit; x: number; line: number }[]>((acc, fit, i) => {
    const prev = acc[acc.length - 1];
    const line = Math.floor(i / perLine);
    const first = i % perLine === 0;
    const x = first
      ? 16 + (perLine > 2 ? 8 : 0)
      : colStep !== null
        ? prev.x + colStep
        : prev.x + 24 + monoWidth(SCORE_FIT[prev.fit].label, 12.5) + 28;
    return [...acc, { fit, x, line }];
  }, []);
}

/**
 * The phone layout: each question's three cells stack, product names in
 * a left gutter, so text stays near article size on a narrow screen
 * instead of shrinking with a 900-wide frame.
 */
function ScorecardPhoneFrame() {
  const id = "cfx8p";
  const x = 16;
  const w = 348;
  const keyTop = 62;
  const rowStart = keyTop + SCORE_COLUMNS.length * 26 + 14;
  const layout = SCORE_ROWS.reduce<{ row: ScoreRow; top: number; cellTops: number[]; end: number }[]>(
    (acc, row) => {
      const prev = acc[acc.length - 1];
      const top = prev ? prev.end + 6 : rowStart;
      const cellTops = row.cells.reduce<number[]>((tops, _, i) => {
        if (i === 0) return [top + 34];
        const before = row.cells[i - 1];
        return [...tops, tops[i - 1] + scoreCellHeight(before.details.length, 18) + 8];
      }, []);
      const lastCell = row.cells[row.cells.length - 1];
      const end = cellTops[cellTops.length - 1] + scoreCellHeight(lastCell.details.length, 18);
      return [...acc, { row, top, cellTops, end }];
    },
    []
  );
  const legendY = layout[layout.length - 1].end + 30;
  const legend = scoreLegend(2, 180);
  const h = legendY + 24 + 62;

  return (
    <EditorialFrame
      id={id}
      w={380}
      h={h}
      eyebrow="The shopping trip"
      chips={[{ label: "Prices 2026-10-03", accent: "amber" }]}
      maxWidthClass="max-w-md"
    >
      {/* Product key */}
      {SCORE_COLUMNS.map((col, i) => {
        const y = keyTop + 20 + i * 26;
        return (
          <g key={col.name}>
            <text
              x={x}
              y={y}
              className={`${scoreNameFill(col)} font-heading font-semibold`}
              style={{ fontSize: 14 }}
            >
              {col.name}
            </text>
            <Mono x={x + 88} y={y} anchor="start">
              {col.maker}
            </Mono>
            <Chip
              x={x + w}
              y={y - 15}
              label={col.basis}
              accent={col.accent}
              filled={i === 2}
              fontSize={10.5}
              anchor="end"
            />
          </g>
        );
      })}

      {/* Rows */}
      {layout.map(({ row, top, cellTops }) => {
        const labelY = top + 24;
        const labelW = row.label.length * 12 * 0.76;
        return (
          <g key={row.label}>
            <SectionLabel x={x} y={labelY} label={row.label} accent={row.mustHave ? "primary" : "muted"} />
            {row.mustHave && (
              <Chip x={x + 16 + labelW + 10} y={labelY - 15} label="must-have" accent="primary" filled />
            )}
            {row.cells.map((cell, i) => (
              <ScoreCellPanel
                key={i}
                x={x}
                y={cellTops[i]}
                w={w}
                h={scoreCellHeight(cell.details.length, 18)}
                cell={cell}
                column={SCORE_COLUMNS[i]}
                emphasis={i === 2}
              />
            ))}
          </g>
        );
      })}

      {/* Legend */}
      {legend.map(({ fit, x: lx, line }) => (
        <g key={fit}>
          <FitMark cx={lx + 9} cy={legendY + line * 24 - 4} fit={fit} />
          <Mono x={lx + 24} y={legendY + line * 24} anchor="start">
            {SCORE_FIT[fit].label}
          </Mono>
        </g>
      ))}
    </EditorialFrame>
  );
}

/**
 * The shopping trip as a scorecard: Plex, Jellyfin and CryptoFlix down
 * three columns, one row per question, each cell marked by how well it
 * fit a one-user LAN app. The two must-have rows are flagged. A
 * screen-reader table carries the same data, since the SVG is an image.
 */
export function ShoppingTripScorecardDiagram({ caption }: DiagramProps) {
  const id = "cfx8";
  const colX = [24, 313, 602];
  const colW = 274;
  const rowStart = 140;
  const layout = SCORE_ROWS.reduce<{ row: ScoreRow; top: number; h: number }[]>((acc, row) => {
    const prev = acc[acc.length - 1];
    const top = prev ? prev.top + 34 + prev.h + 6 : rowStart;
    const h = Math.max(...row.cells.map((c) => scoreCellHeight(c.details.length)));
    return [...acc, { row, top, h }];
  }, []);
  const last = layout[layout.length - 1];
  const contentBottom = last.top + 34 + last.h;
  const legendY = contentBottom + 30;
  const h = legendY + 62;
  const legend = scoreLegend(4, null);
  const fullCaption =
    caption ??
    "How the three stacked up for one user on a home LAN. Each mark is fit for what I wanted, not a verdict on the product. Prices are from the vendors' own pages on 2026-10-03.";

  return (
    <>
      <div className="md:hidden">
        <DiagramWrapper caption={fullCaption}>
          <ScorecardPhoneFrame />
        </DiagramWrapper>
      </div>
      <div className="hidden md:block">
        <DiagramWrapper caption={fullCaption}>
          <EditorialFrame
            id={id}
            w={900}
            h={h}
            eyebrow="Plex vs. Jellyfin vs. CryptoFlix"
            chips={[{ label: "Prices checked 2026-10-03", accent: "amber" }]}
            footerRight="Fit for one user on one LAN"
          >
            {/* CryptoFlix column band */}
            <rect
              x={colX[2] - 8}
              y={60}
              width={colW + 16}
              height={contentBottom + 8 - 60}
              rx={12}
              className="fill-primary/[0.05] stroke-primary/25"
              strokeWidth="1"
            />

            {/* Column headers */}
            {SCORE_COLUMNS.map((col, i) => (
              <NodePanel
                key={col.name}
                x={colX[i]}
                y={66}
                w={colW}
                h={70}
                accent={col.accent}
                emphasis={i === 2}
                align="left"
                title={col.name}
                sub={[col.maker]}
                titleSize={18}
                subSize={12.5}
              >
                <Chip
                  x={colX[i] + colW - 12}
                  y={78}
                  label={col.basis}
                  accent={col.accent}
                  filled={i === 2}
                  fontSize={10.5}
                  anchor="end"
                />
              </NodePanel>
            ))}

            {/* Rows */}
            {layout.map(({ row, top, h: rowH }) => {
              const labelY = top + 24;
              const labelW = row.label.length * 12 * 0.76;
              return (
                <g key={row.label}>
                  <SectionLabel
                    x={24}
                    y={labelY}
                    label={row.label}
                    accent={row.mustHave ? "primary" : "muted"}
                  />
                  {row.mustHave && (
                    <Chip x={24 + 16 + labelW + 10} y={labelY - 15} label="must-have" accent="primary" filled />
                  )}
                  {row.cells.map((cell, i) => (
                    <ScoreCellPanel key={i} x={colX[i]} y={top + 34} w={colW} h={rowH} cell={cell} />
                  ))}
                </g>
              );
            })}

            {/* Legend */}
            {legend.map(({ fit, x }) => (
              <g key={fit}>
                <FitMark cx={x + 9} cy={legendY - 4} fit={fit} />
                <Mono x={x + 24} y={legendY} anchor="start">
                  {SCORE_FIT[fit].label}
                </Mono>
              </g>
            ))}
          </EditorialFrame>
        </DiagramWrapper>
      </div>
      {/* sr-only on a wrapper: a table ignores the 1px width and would widen the page */}
      <div className="sr-only">
        <table>
          <caption>Plex, Jellyfin and CryptoFlix compared for one user on a home LAN</caption>
          <thead>
            <tr>
              <th scope="col">Question</th>
              {SCORE_COLUMNS.map((col) => (
                <th key={col.name} scope="col">
                  {col.name} ({col.basis})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Who maintains it</th>
              {SCORE_COLUMNS.map((col) => (
                <td key={col.name}>{col.maker}</td>
              ))}
            </tr>
            {SCORE_ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.mustHave ? `${row.label} (must-have)` : row.label}</th>
                {row.cells.map((cell, i) => (
                  <td key={i}>
                    {cell.sr ?? [cell.verdict, ...cell.details].join("; ")} ({SCORE_FIT[cell.fit].label})
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
