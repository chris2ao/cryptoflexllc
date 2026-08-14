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
 * Per-turn architecture: browser through the Next.js route, the claude CLI,
 * a stdio MCP server, and into SQLite, with the app's own long-lived WAL
 * connection to that same database file shown as a second, parallel edge.
 */
export function ChatTurnArchitecture({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Every chat turn hops from the browser through the Next.js route, the claude CLI, and a stdio MCP server before reaching SQLite; the Next.js dev server also holds its own separate WAL connection to that same database file."
      }
    >
      <EditorialFrame
        id="lmtc1"
        w={920}
        h={1030}
        eyebrow="Chat Turn Architecture"
        eyebrowAccent="cyan"
        chips={[
          { label: "5 hops", accent: "cyan" },
          { label: "2 procs, 1 file", accent: "red" },
        ]}
        footerRight="Stdio MCP · WAL side-car"
      >
        {/* BROWSER */}
        <NodePanel
          x={180}
          y={70}
          w={560}
          h={110}
          accent="cyan"
          title="Browser"
          sub={["chat UI", "sends the question", "receives SSE: answer text + tool chips"]}
        />
        <FlowLine id="lmtc1" d="M260,180 L260,210" accent="cyan" />
        <text x={272} y={198} className="fill-cyan-500 font-mono" style={{ fontSize: 10.5 }}>
          SSE
        </text>

        {/* NEXT.JS ROUTE */}
        <NodePanel
          x={180}
          y={210}
          w={560}
          h={150}
          accent="cyan"
          title="Next.js route"
          sub={["/api/chat", "builds the prompt + inline --mcp-config", "spawns the CLI as an argv array"]}
        >
          <Chip x={696} y={326} label="no shell" accent="amber" anchor="end" />
        </NodePanel>
        <FlowLine id="lmtc1" d="M260,360 L260,390" accent="cyan" />
        <text x={272} y={378} className="fill-cyan-500 font-mono" style={{ fontSize: 10.5 }}>
          argv array
        </text>

        {/* CLAUDE CLI */}
        <NodePanel
          x={180}
          y={390}
          w={560}
          h={190}
          accent="violet"
          emphasis
          terminal
          title="claude CLI"
          sub={["v2.1.228", "headless · --max-turns 12"]}
        >
          <text
            x={460}
            y={550}
            textAnchor="middle"
            className="fill-violet-500 font-heading font-semibold"
            style={{ fontSize: 12 }}
          >
            decides which tools to call
          </text>
        </NodePanel>
        <FlowLine id="lmtc1" d="M260,580 L260,610" accent="emerald" />
        <text x={272} y={598} className="fill-emerald-500 font-mono" style={{ fontSize: 10.5 }}>
          stdio
        </text>

        {/* NDJSON return path, up the right side back to the route */}
        <FlowLine
          id="lmtc1"
          d="M740,485 L780,485 L780,285 L740,285"
          accent="violet"
          dashed
        />
        <text x={786} y={382} className="fill-violet-500 font-mono" style={{ fontSize: 10.5 }}>
          NDJSON
        </text>
        <text x={786} y={396} className="fill-violet-500 font-mono" style={{ fontSize: 10.5 }}>
          on stdout
        </text>

        {/* MCP STDIO SERVER */}
        <NodePanel
          x={180}
          y={610}
          w={560}
          h={190}
          accent="emerald"
          terminal
          title="MCP stdio server"
          sub={["scripts/mcp-server.ts", "JSON-RPC 2.0 over stdio"]}
        >
          <text
            x={460}
            y={760}
            textAnchor="middle"
            className="fill-amber-500 font-mono font-semibold"
            style={{ fontSize: 10.5 }}
          >
            stdout is protocol-only
          </text>
          <text
            x={460}
            y={776}
            textAnchor="middle"
            className="fill-amber-500 font-mono font-semibold"
            style={{ fontSize: 10.5 }}
          >
            diagnostics go to stderr
          </text>
        </NodePanel>
        <FlowLine id="lmtc1" d="M260,800 L260,830" accent="amber" />
        <text x={272} y={818} className="fill-amber-500 font-mono" style={{ fontSize: 10.5 }}>
          query_only = ON
        </text>

        {/* SQLITE */}
        <NodePanel
          x={180}
          y={830}
          w={560}
          h={110}
          accent="muted"
          title="SQLite"
          sub={["local ledger file", "MCP opens a short-lived connection per call"]}
        />

        {/* WAL side-car: next dev server holds its own connection to SQLite */}
        <NodePanel
          x={750}
          y={680}
          w={145}
          h={120}
          accent="red"
          variant="dashed"
          titleSize={12.5}
          title="next dev server"
          sub={["same process,", "separate WAL conn.", "two open connections"]}
        />
        <FlowLine
          id="lmtc1"
          d="M823,800 L823,885 L740,885"
          accent="red"
          dashed
        />
        <text x={827} y={846} className="fill-red-500 font-mono font-semibold" style={{ fontSize: 10.5 }}>
          WAL
        </text>

        <text
          x={460}
          y={964}
          textAnchor="middle"
          className="fill-muted-foreground font-heading"
          style={{ fontSize: 11.5 }}
        >
          Two processes touch one file: the app&apos;s long-lived WAL connection
        </text>
        <text
          x={460}
          y={980}
          textAnchor="middle"
          className="fill-muted-foreground font-heading"
          style={{ fontSize: 11.5 }}
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
 * loopable across a multi-turn conversation.
 */
export function McpHandshakeOrder({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The claude CLI (2.1.228) sends an undocumented server/discover call before initialize, then negotiates initialize, notifications/initialized, tools/list, and a repeatable tools/call, captured against the real CLI in a de-risking spike."
      }
    >
      <EditorialFrame
        id="lmtc2"
        w={920}
        h={860}
        eyebrow="MCP Handshake Order"
        eyebrowAccent="cyan"
        chips={[
          { label: "v2.1.228", accent: "violet" },
          { label: "5 rpc calls", accent: "cyan" },
        ]}
        footerRight="Captured against the real CLI"
      >
        {/* spine */}
        <FlowLine id="lmtc2" d="M60,135 L60,618" accent="muted" arrow={false} />

        {/* STEP 1: server/discover (the odd one out) */}
        <FlowLine id="lmtc2" d="M73,135 L100,135" accent="amber" />
        <StepBadge cx={60} cy={135} n={1} accent="amber" />
        <NodePanel
          x={100}
          y={70}
          w={780}
          h={130}
          accent="amber"
          emphasis
          align="left"
          titleSize={14}
          title="server/discover"
          sub={["-32601 method not found", "arrives before initialize · must not throw"]}
        >
          <Chip x={866} y={82} label="undocumented" accent="amber" filled anchor="end" />
          <text
            x={114}
            y={184}
            className="fill-amber-500 font-mono font-semibold"
            style={{ fontSize: 10.5 }}
          >
            a server that throws or exits here never reaches the handshake
          </text>
        </NodePanel>

        {/* STEP 2: initialize */}
        <FlowLine id="lmtc2" d="M73,267 L100,267" accent="cyan" />
        <StepBadge cx={60} cy={267} n={2} accent="cyan" />
        <NodePanel
          x={100}
          y={222}
          w={780}
          h={90}
          accent="cyan"
          align="left"
          titleSize={14}
          title="initialize"
          sub={["protocol version negotiated · 2025-06-18"]}
        />

        {/* STEP 3: notifications/initialized (no response) */}
        <FlowLine id="lmtc2" d="M73,379 L100,379" accent="muted" />
        <StepBadge cx={60} cy={379} n={3} accent="muted" />
        <NodePanel
          x={100}
          y={334}
          w={780}
          h={90}
          accent="muted"
          variant="dashed"
          align="left"
          titleSize={14}
          title="notifications/initialized"
          sub={["a notification · no response"]}
        />

        {/* STEP 4: tools/list */}
        <FlowLine id="lmtc2" d="M73,491 L100,491" accent="cyan" />
        <StepBadge cx={60} cy={491} n={4} accent="cyan" />
        <NodePanel
          x={100}
          y={446}
          w={780}
          h={90}
          accent="cyan"
          align="left"
          titleSize={14}
          title="tools/list"
          sub={["returns the 10 read-only tools"]}
        />

        {/* STEP 5: tools/call (loopable) */}
        <FlowLine id="lmtc2" d="M73,618 L100,618" accent="emerald" />
        <StepBadge cx={60} cy={618} n={5} accent="emerald" />
        <NodePanel
          x={100}
          y={558}
          w={780}
          h={120}
          accent="emerald"
          emphasis
          align="left"
          titleSize={14}
          title="tools/call"
          sub={["repeatable up to the turn limit"]}
        />

        {/* self-loop back into step 5 */}
        <FlowLine
          id="lmtc2"
          d="M300,678 L300,730 L600,730 L600,678"
          accent="emerald"
          dashed
        />
        <text
          x={450}
          y={748}
          textAnchor="middle"
          className="fill-emerald-500 font-mono font-semibold"
          style={{ fontSize: 10.5 }}
        >
          loop per turn · --max-turns 12
        </text>

        <text
          x={460}
          y={786}
          textAnchor="middle"
          className="fill-muted-foreground font-heading"
          style={{ fontSize: 11.5 }}
        >
          Repeats until the model has enough to answer, or --max-turns 12 is reached.
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}
