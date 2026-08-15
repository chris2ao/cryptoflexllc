/** Ledgerly MCP tool-calling chat blog post diagrams: editorial SVG, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  StepBadge,
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

/**
 * Mono detail lines for the right-hand column of a two-column panel:
 * title on the left, facts on the right, so wide panels stay filled and
 * type can grow. `tone` recolors individual lines (index -> accent).
 */
function DetailLines({
  x,
  y,
  lines,
  size = 13,
  tone = {},
}: {
  x: number;
  y: number;
  lines: string[];
  size?: number;
  tone?: Record<number, "amber" | "violet">;
}) {
  const gap = size + 4;
  return (
    <>
      {lines.map((line, i) => {
        const t = tone[i];
        const cls =
          t === "amber"
            ? "fill-warning font-mono font-semibold"
            : t === "violet"
              ? "fill-violet-500 font-heading font-semibold"
              : "fill-muted-foreground font-mono";
        return (
          <text key={line} x={x} y={y + i * gap} className={cls} style={{ fontSize: size }}>
            {line}
          </text>
        );
      })}
    </>
  );
}

/**
 * First baseline for a details column so it lines up with the panel's
 * title/sub block: mirrors NodePanel's vertical centering math, then
 * offsets so an n-line details block shares the title block's center.
 */
function detailsBaseline(
  y: number,
  h: number,
  opts: { terminal?: boolean; titleSize: number; subSize: number; subCount: number; lines: number }
): number {
  const contentTop = opts.terminal ? y + 34 : y;
  const gap = opts.subSize + 4;
  const blockH = opts.titleSize + 6 + opts.subCount * gap;
  const titleBaseline = contentTop + (h - (contentTop - y) - blockH) / 2 + opts.titleSize;
  return titleBaseline + ((1 + opts.subCount - opts.lines) * gap) / 2;
}

/**
 * Per-turn architecture: browser through the Next.js route, the claude CLI,
 * a stdio MCP server, and into SQLite, with the app's own long-lived WAL
 * connection to that same database file shown beside SQLite on the last row.
 *
 * Layout: one 740-wide column centered in a 900 frame, each panel split
 * into a title column (left) and a details column (right); the request
 * path runs down the left lane and the NDJSON return path runs up the
 * right lane between the same panels, so nothing hangs off one side.
 */
export function ChatTurnArchitecture({ caption }: DiagramProps) {
  const W = 900;
  const PX = 80; // panel left
  const PW = 740; // panel width
  const PR = PX + PW; // panel right (820)
  const DX = 372; // details column x
  const LANE_DOWN = 160; // request lane x
  const LANE_UP = 740; // return lane x
  const GAP = 48; // vertical gap between rows

  // Row geometry (y, h)
  const r1 = { y: 72, h: 90 }; // Browser
  const r2 = { y: r1.y + r1.h + GAP, h: 96 }; // Next.js route
  const r3 = { y: r2.y + r2.h + GAP, h: 112 }; // claude CLI (terminal)
  const r4 = { y: r3.y + r3.h + GAP, h: 122 }; // MCP stdio server (terminal)
  const r5 = { y: r4.y + r4.h + GAP, h: 100 }; // SQLite + next dev server
  const noteY = r5.y + r5.h + 34;
  const H = noteY + 22 + 52;

  const mid = (a: { y: number; h: number }, b: { y: number }) => (a.y + a.h + b.y) / 2;

  return (
    <DiagramWrapper
      caption={
        caption ??
        "Every chat turn hops from the browser through the Next.js route, the claude CLI, and a stdio MCP server before reaching SQLite; the Next.js dev server also holds its own separate WAL connection to that same database file."
      }
    >
      <EditorialFrame
        id="lmtc1"
        w={W}
        h={H}
        eyebrow="Chat Turn Architecture"
        eyebrowAccent="cyan"
        chips={[
          { label: "5 hops", accent: "cyan" },
          { label: "2 procs, 1 file", accent: "red" },
        ]}
        footerRight="Stdio MCP · WAL side-car"
      >
        {/* ROW 1: BROWSER */}
        <NodePanel
          x={PX}
          y={r1.y}
          w={PW}
          h={r1.h}
          accent="cyan"
          align="left"
          titleSize={18}
          subSize={13}
          title="Browser"
          sub={["chat UI"]}
        >
          <DetailLines
            x={DX}
            y={detailsBaseline(r1.y, r1.h, { titleSize: 18, subSize: 13, subCount: 1, lines: 2 })}
            lines={["sends the question", "receives SSE: answer text + tool chips"]}
          />
        </NodePanel>
        <FlowLine id="lmtc1" d={`M${LANE_DOWN},${r1.y + r1.h} L${LANE_DOWN},${r2.y}`} accent="cyan" />
        <text
          x={LANE_DOWN + 12}
          y={mid(r1, r2) + 4.5}
          className="fill-cyan-600 font-mono"
          style={{ fontSize: 12.5 }}
        >
          question
        </text>

        {/* ROW 2: NEXT.JS ROUTE */}
        <NodePanel
          x={PX}
          y={r2.y}
          w={PW}
          h={r2.h}
          accent="cyan"
          align="left"
          titleSize={18}
          subSize={13}
          title="Next.js route"
          sub={["/api/chat"]}
        >
          <DetailLines
            x={DX}
            y={detailsBaseline(r2.y, r2.h, { titleSize: 18, subSize: 13, subCount: 1, lines: 2 })}
            lines={["builds the prompt + inline --mcp-config", "spawns the CLI as an argv array"]}
          />
          <Chip x={PR - 14} y={r2.y + r2.h / 2 - 11} label="no shell" accent="amber" anchor="end" />
        </NodePanel>
        <FlowLine id="lmtc1" d={`M${LANE_DOWN},${r2.y + r2.h} L${LANE_DOWN},${r3.y}`} accent="cyan" />
        <text
          x={LANE_DOWN + 12}
          y={mid(r2, r3) + 4.5}
          className="fill-cyan-600 font-mono"
          style={{ fontSize: 12.5 }}
        >
          argv array
        </text>
        {/* NDJSON return path, up the right lane from the CLI to the route */}
        <FlowLine
          id="lmtc1"
          d={`M${LANE_UP},${r3.y} L${LANE_UP},${r2.y + r2.h}`}
          accent="violet"
          dashed
        />
        <text
          x={LANE_UP - 12}
          y={mid(r2, r3) + 4.5}
          textAnchor="end"
          className="fill-violet-500 font-mono"
          style={{ fontSize: 12.5 }}
        >
          NDJSON on stdout
        </text>

        {/* ROW 3: CLAUDE CLI */}
        <NodePanel
          x={PX}
          y={r3.y}
          w={PW}
          h={r3.h}
          accent="violet"
          emphasis
          terminal
          align="left"
          titleSize={18}
          subSize={13}
          title="claude CLI"
          sub={["v2.1.228"]}
        >
          <DetailLines
            x={DX}
            y={detailsBaseline(r3.y, r3.h, {
              terminal: true,
              titleSize: 18,
              subSize: 13,
              subCount: 1,
              lines: 2,
            })}
            lines={["headless · --max-turns 12", "decides which tools to call"]}
            tone={{ 1: "violet" }}
          />
        </NodePanel>
        <FlowLine id="lmtc1" d={`M${LANE_DOWN},${r3.y + r3.h} L${LANE_DOWN},${r4.y}`} accent="emerald" />
        <text
          x={LANE_DOWN + 12}
          y={mid(r3, r4) + 4.5}
          className="fill-success font-mono"
          style={{ fontSize: 12.5 }}
        >
          stdio
        </text>

        {/* ROW 4: MCP STDIO SERVER */}
        <NodePanel
          x={PX}
          y={r4.y}
          w={PW}
          h={r4.h}
          accent="emerald"
          terminal
          align="left"
          titleSize={18}
          subSize={13}
          title="MCP stdio server"
          sub={["scripts/mcp-server.ts"]}
        >
          <DetailLines
            x={DX}
            y={detailsBaseline(r4.y, r4.h, {
              terminal: true,
              titleSize: 18,
              subSize: 13,
              subCount: 1,
              lines: 3,
            })}
            lines={["JSON-RPC 2.0 over stdio", "stdout is protocol-only", "diagnostics go to stderr"]}
            tone={{ 1: "amber", 2: "amber" }}
          />
        </NodePanel>
        <FlowLine id="lmtc1" d={`M${LANE_DOWN},${r4.y + r4.h} L${LANE_DOWN},${r5.y}`} accent="amber" />
        <text
          x={LANE_DOWN + 12}
          y={mid(r4, r5) + 4.5}
          className="fill-warning font-mono"
          style={{ fontSize: 12.5 }}
        >
          query_only = ON
        </text>

        {/* ROW 5: SQLITE + the app's own WAL connection */}
        <NodePanel
          x={PX}
          y={r5.y}
          w={500}
          h={r5.h}
          accent="muted"
          align="left"
          titleSize={18}
          subSize={13}
          title="SQLite"
          sub={["local ledger file"]}
        >
          <DetailLines
            x={DX}
            y={detailsBaseline(r5.y, r5.h, { titleSize: 18, subSize: 13, subCount: 1, lines: 2 })}
            lines={["MCP opens a short-lived", "connection per call"]}
          />
        </NodePanel>
        <NodePanel
          x={PX + 550}
          y={r5.y}
          w={190}
          h={r5.h}
          accent="red"
          variant="dashed"
          align="left"
          titleSize={15}
          subSize={12.5}
          title="next dev server"
          sub={["same process,", "separate WAL conn.,", "two open connections"]}
        />
        <FlowLine
          id="lmtc1"
          d={`M${PX + 550},${r5.y + r5.h / 2} L${PX + 500},${r5.y + r5.h / 2}`}
          accent="red"
          dashed
        />
        <text
          x={PX + 525}
          y={r5.y + r5.h / 2 - 9}
          textAnchor="middle"
          className="fill-destructive font-mono font-semibold"
          style={{ fontSize: 12.5 }}
        >
          WAL
        </text>

        <text
          x={W / 2}
          y={noteY}
          textAnchor="middle"
          className="fill-muted-foreground font-heading"
          style={{ fontSize: 13 }}
        >
          Two processes touch one file: the app&apos;s long-lived WAL connection
        </text>
        <text
          x={W / 2}
          y={noteY + 19}
          textAnchor="middle"
          className="fill-muted-foreground font-heading"
          style={{ fontSize: 13 }}
        >
          and the MCP server&apos;s short-lived, query_only connection.
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * The five JSON-RPC calls the real claude CLI makes to the MCP server, in
 * the order a de-risking spike captured them, with the undocumented
 * server/discover call styled as the odd one out and tools/call shown as
 * loopable across a multi-turn conversation. Each row reads call on the
 * left, what comes back on the right, so the wide panels stay filled.
 */
export function McpHandshakeOrder({ caption }: DiagramProps) {
  const W = 900;
  const SPINE = 60;
  const PX = 100;
  const PW = 760;
  const PR = PX + PW;
  const TITLE = 17;
  const SUB = 13;
  const GAP = 22;

  const r1 = { y: 92, h: 112 };
  const r2 = { y: r1.y + r1.h + GAP, h: 78 };
  const r3 = { y: r2.y + r2.h + GAP, h: 78 };
  const r4 = { y: r3.y + r3.h + GAP, h: 78 };
  const r5 = { y: r4.y + r4.h + GAP, h: 100 };
  const loopY = r5.y + r5.h + 42;
  const noteY = loopY + 52;
  const H = noteY + 56;

  const cy = (r: { y: number; h: number }) => r.y + r.h / 2;
  const responseY = (r: { y: number; h: number }) =>
    detailsBaseline(r.y, r.h, { titleSize: TITLE, subSize: SUB, subCount: 1, lines: 1 });

  return (
    <DiagramWrapper
      caption={
        caption ??
        "The claude CLI (2.1.228) sends an undocumented server/discover call before initialize, then negotiates initialize, notifications/initialized, tools/list, and a repeatable tools/call, captured against the real CLI in a de-risking spike."
      }
    >
      <EditorialFrame
        id="lmtc2"
        w={W}
        h={H}
        eyebrow="MCP Handshake Order"
        eyebrowAccent="cyan"
        chips={[
          { label: "v2.1.228", accent: "violet" },
          { label: "5 rpc calls", accent: "cyan" },
        ]}
        footerRight="Captured against the real CLI"
      >
        {/* column headers */}
        <text
          x={PX + 14}
          y={76}
          className="fill-muted-foreground font-mono font-semibold uppercase"
          style={{ fontSize: 10.5, letterSpacing: "0.14em" }}
        >
          call from the CLI
        </text>
        <text
          x={PR - 14}
          y={76}
          textAnchor="end"
          className="fill-muted-foreground font-mono font-semibold uppercase"
          style={{ fontSize: 10.5, letterSpacing: "0.14em" }}
        >
          what comes back
        </text>

        {/* spine */}
        <FlowLine id="lmtc2" d={`M${SPINE},${cy(r1)} L${SPINE},${cy(r5)}`} accent="muted" arrow={false} />

        {/* STEP 1: server/discover (the odd one out) */}
        <FlowLine id="lmtc2" d={`M${SPINE + 13},${cy(r1)} L${PX},${cy(r1)}`} accent="amber" />
        <StepBadge cx={SPINE} cy={cy(r1)} n={1} accent="amber" />
        <NodePanel
          x={PX}
          y={r1.y}
          w={PW}
          h={r1.h}
          accent="amber"
          emphasis
          align="left"
          titleSize={TITLE}
          subSize={SUB}
          title="server/discover"
          sub={["arrives before initialize · must not throw"]}
        >
          <Chip x={PR - 14} y={r1.y + 12} label="undocumented" accent="amber" filled anchor="end" />
          <text
            x={PR - 14}
            y={responseY(r1)}
            textAnchor="end"
            className="fill-warning font-mono font-semibold"
            style={{ fontSize: SUB }}
          >
            -32601 method not found
          </text>
          <text
            x={PX + 14}
            y={r1.y + r1.h - 16}
            className="fill-warning font-mono font-semibold"
            style={{ fontSize: SUB }}
          >
            a server that throws or exits here never reaches the handshake
          </text>
        </NodePanel>

        {/* STEP 2: initialize */}
        <FlowLine id="lmtc2" d={`M${SPINE + 13},${cy(r2)} L${PX},${cy(r2)}`} accent="cyan" />
        <StepBadge cx={SPINE} cy={cy(r2)} n={2} accent="cyan" />
        <NodePanel
          x={PX}
          y={r2.y}
          w={PW}
          h={r2.h}
          accent="cyan"
          align="left"
          titleSize={TITLE}
          subSize={SUB}
          title="initialize"
          sub={["negotiates a protocol version"]}
        >
          <text
            x={PR - 14}
            y={responseY(r2)}
            textAnchor="end"
            className="fill-cyan-600 font-mono font-semibold"
            style={{ fontSize: SUB }}
          >
            2025-06-18
          </text>
        </NodePanel>

        {/* STEP 3: notifications/initialized (no response) */}
        <FlowLine id="lmtc2" d={`M${SPINE + 13},${cy(r3)} L${PX},${cy(r3)}`} accent="muted" />
        <StepBadge cx={SPINE} cy={cy(r3)} n={3} accent="muted" />
        <NodePanel
          x={PX}
          y={r3.y}
          w={PW}
          h={r3.h}
          accent="muted"
          variant="dashed"
          align="left"
          titleSize={TITLE}
          subSize={SUB}
          title="notifications/initialized"
          sub={["a notification, not a request"]}
        >
          <text
            x={PR - 14}
            y={responseY(r3)}
            textAnchor="end"
            className="fill-muted-foreground font-mono"
            style={{ fontSize: SUB }}
          >
            no response
          </text>
        </NodePanel>

        {/* STEP 4: tools/list */}
        <FlowLine id="lmtc2" d={`M${SPINE + 13},${cy(r4)} L${PX},${cy(r4)}`} accent="cyan" />
        <StepBadge cx={SPINE} cy={cy(r4)} n={4} accent="cyan" />
        <NodePanel
          x={PX}
          y={r4.y}
          w={PW}
          h={r4.h}
          accent="cyan"
          align="left"
          titleSize={TITLE}
          subSize={SUB}
          title="tools/list"
          sub={["advertises what is available"]}
        >
          <text
            x={PR - 14}
            y={responseY(r4)}
            textAnchor="end"
            className="fill-cyan-600 font-mono font-semibold"
            style={{ fontSize: SUB }}
          >
            the 10 read-only tools
          </text>
        </NodePanel>

        {/* STEP 5: tools/call (loopable) */}
        <FlowLine id="lmtc2" d={`M${SPINE + 13},${cy(r5)} L${PX},${cy(r5)}`} accent="emerald" />
        <StepBadge cx={SPINE} cy={cy(r5)} n={5} accent="emerald" />
        <NodePanel
          x={PX}
          y={r5.y}
          w={PW}
          h={r5.h}
          accent="emerald"
          emphasis
          align="left"
          titleSize={TITLE}
          subSize={SUB}
          title="tools/call"
          sub={["runs one tool and returns its result"]}
        >
          <text
            x={PR - 14}
            y={responseY(r5)}
            textAnchor="end"
            className="fill-success font-mono font-semibold"
            style={{ fontSize: SUB }}
          >
            repeatable up to the turn limit
          </text>
        </NodePanel>

        {/* self-loop back into step 5 */}
        <FlowLine
          id="lmtc2"
          d={`M300,${r5.y + r5.h} L300,${loopY} L600,${loopY} L600,${r5.y + r5.h}`}
          accent="emerald"
          dashed
        />
        <text
          x={450}
          y={loopY + 20}
          textAnchor="middle"
          className="fill-success font-mono font-semibold"
          style={{ fontSize: SUB }}
        >
          loop per turn · --max-turns 12
        </text>

        <text
          x={W / 2}
          y={noteY}
          textAnchor="middle"
          className="fill-muted-foreground font-heading"
          style={{ fontSize: 13 }}
        >
          Repeats until the model has enough to answer, or --max-turns 12 is reached.
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}
