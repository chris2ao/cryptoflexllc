/** Ledgerly MCP tool-calling chat blog post diagrams: SVG-based, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";

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
      <svg
        viewBox="0 0 900 1050"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="lmtc-chatarch-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker id="lmtc-chatarch-arrow-violet" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-violet-500/80" />
          </marker>
          <marker id="lmtc-chatarch-arrow-rose" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-rose-500/80" />
          </marker>
        </defs>

        <text x="450" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Ledgerly Chat Turn: Browser to SQLite and Back
        </text>

        {/* BROWSER */}
        <rect x="190" y="50" width="520" height="140" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="450" y="78" textAnchor="middle" className="fill-cyan-300 text-[13px] font-semibold">Browser</text>
        <text x="450" y="98" textAnchor="middle" className="fill-muted-foreground text-[10px]">chat UI</text>
        <text x="450" y="118" textAnchor="middle" className="fill-muted-foreground text-[10px]">sends the question</text>
        <text x="450" y="136" textAnchor="middle" className="fill-muted-foreground text-[10px]">receives SSE back: streamed answer text</text>
        <text x="450" y="152" textAnchor="middle" className="fill-muted-foreground text-[10px]">plus tool-activity chips</text>

        <line x1="450" y1="190" x2="450" y2="222" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-chatarch-arrow)" />
        <text x="474" y="209" className="fill-muted-foreground text-[9px] font-medium">SSE</text>

        {/* NEXT.JS ROUTE */}
        <rect x="190" y="222" width="520" height="170" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="450" y="250" textAnchor="middle" className="fill-cyan-300 text-[13px] font-semibold">Next.js Route</text>
        <text x="450" y="268" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">/api/chat</text>
        <text x="450" y="288" textAnchor="middle" className="fill-muted-foreground text-[10px]">builds the prompt and an inline</text>
        <text x="450" y="304" textAnchor="middle" className="fill-muted-foreground text-[10px]">--mcp-config JSON document</text>
        <text x="450" y="324" textAnchor="middle" className="fill-muted-foreground text-[10px]">spawns the CLI as an argv array,</text>
        <text x="450" y="340" textAnchor="middle" className="fill-amber-300 text-[10px] font-medium">no shell</text>

        <line x1="450" y1="392" x2="450" y2="424" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-chatarch-arrow)" />
        <text x="474" y="411" className="fill-muted-foreground text-[9px] font-medium">argv, no shell</text>

        {/* CLAUDE CLI */}
        <rect x="190" y="424" width="520" height="190" rx="10" className="fill-violet-500/12 stroke-violet-500" strokeWidth="2" />
        <text x="450" y="452" textAnchor="middle" className="fill-violet-300 text-[13px] font-semibold">claude CLI</text>
        <text x="450" y="470" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">v2.1.228</text>
        <text x="450" y="488" textAnchor="middle" className="fill-muted-foreground text-[10px]">headless, --max-turns 12</text>
        <text x="450" y="506" textAnchor="middle" className="fill-muted-foreground text-[10px]">emits NDJSON on stdout</text>
        <text x="450" y="522" textAnchor="middle" className="fill-muted-foreground text-[10px]">(route parses line by line)</text>
        <text x="450" y="544" textAnchor="middle" className="fill-violet-300 text-[11px] font-semibold">decides which tools to call</text>

        <line x1="450" y1="614" x2="450" y2="646" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-chatarch-arrow)" />
        <text x="474" y="633" className="fill-muted-foreground text-[9px] font-medium">JSON-RPC 2.0 over stdio</text>

        {/* NDJSON return path, CLI back to Route */}
        <path d="M190,500 C130,500 130,300 190,300" fill="none" className="stroke-violet-500/70" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#lmtc-chatarch-arrow-violet)" />
        <text x="105" y="404" textAnchor="middle" className="fill-violet-400 text-[9px] font-medium">NDJSON</text>
        <text x="105" y="416" textAnchor="middle" className="fill-violet-400 text-[9px] font-medium">on stdout</text>

        {/* MCP STDIO SERVER */}
        <rect x="190" y="646" width="520" height="190" rx="10" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="450" y="674" textAnchor="middle" className="fill-emerald-300 text-[13px] font-semibold">MCP stdio server</text>
        <text x="450" y="692" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">scripts/mcp-server.ts</text>
        <text x="450" y="710" textAnchor="middle" className="fill-muted-foreground text-[10px]">spawned by the CLI, not the app</text>
        <text x="450" y="728" textAnchor="middle" className="fill-muted-foreground text-[10px]">newline-delimited JSON-RPC 2.0</text>
        <text x="450" y="744" textAnchor="middle" className="fill-muted-foreground text-[10px]">over stdin and stdout</text>
        <text x="450" y="766" textAnchor="middle" className="fill-amber-300 text-[10px] font-semibold">stdout is protocol-only</text>
        <text x="450" y="782" textAnchor="middle" className="fill-amber-300 text-[10px] font-semibold">diagnostics go to stderr</text>

        <line x1="450" y1="836" x2="450" y2="868" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-chatarch-arrow)" />
        <text x="474" y="855" className="fill-amber-400 text-[9px] font-semibold">query_only = ON</text>

        {/* SQLITE */}
        <rect x="190" y="868" width="520" height="130" rx="10" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.5" />
        <text x="450" y="896" textAnchor="middle" className="fill-zinc-300 text-[13px] font-semibold">SQLite</text>
        <text x="450" y="914" textAnchor="middle" className="fill-muted-foreground text-[10px]">local ledger file</text>
        <text x="450" y="932" textAnchor="middle" className="fill-muted-foreground text-[10px]">MCP server opens its own</text>
        <text x="450" y="948" textAnchor="middle" className="fill-muted-foreground text-[10px]">short-lived connection per call</text>

        {/* WAL side lane, Route directly to SQLite */}
        <path d="M710,300 C760,300 760,930 710,930" fill="none" className="stroke-rose-500/70" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#lmtc-chatarch-arrow-rose)" />
        <text x="735" y="292" className="fill-rose-400 text-[10px] font-semibold">WAL</text>

        <rect x="770" y="560" width="120" height="120" rx="8" className="fill-rose-500/10 stroke-rose-500" strokeWidth="1.2" strokeDasharray="4 3" />
        <text x="830" y="584" textAnchor="middle" className="fill-rose-300 text-[9px] font-semibold">Next.js dev server</text>
        <text x="830" y="600" textAnchor="middle" className="fill-muted-foreground text-[9px]">ALSO holds its own</text>
        <text x="830" y="616" textAnchor="middle" className="fill-muted-foreground text-[9px]">WAL-mode connection</text>
        <text x="830" y="632" textAnchor="middle" className="fill-muted-foreground text-[9px]">to this same file</text>
        <text x="830" y="652" textAnchor="middle" className="fill-muted-foreground/70 text-[8px]">(two processes,</text>
        <text x="830" y="664" textAnchor="middle" className="fill-muted-foreground/70 text-[8px]">one file)</text>

        <text x="450" y="1006" textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          Two processes touch one file: the app&apos;s long-lived WAL connection
        </text>
        <text x="450" y="1022" textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          and the MCP server&apos;s short-lived query_only connection.
        </text>
      </svg>
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
      <svg
        viewBox="0 0 880 860"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="lmtc-handshake-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker id="lmtc-handshake-arrow-emerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
        </defs>

        <text x="440" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          MCP Handshake Order: What the Real CLI Actually Calls
        </text>

        {/* STEP 1: server/discover (the odd one out) */}
        <rect x="60" y="50" width="680" height="180" rx="12" className="fill-amber-500/14 stroke-amber-500" strokeWidth="2.5" />
        <circle cx="100" cy="90" r="18" className="fill-amber-500" />
        <text x="100" y="95" textAnchor="middle" className="fill-white text-[13px] font-bold">1</text>
        <text x="134" y="84" className="fill-amber-300 text-[14px] font-mono font-semibold">server/discover</text>
        <rect x="560" y="70" width="140" height="24" rx="12" className="fill-amber-500" />
        <text x="630" y="86" textAnchor="middle" className="fill-white text-[9px] font-bold">UNDOCUMENTED</text>
        <text x="134" y="108" className="fill-amber-200 text-[11px] font-mono">response: -32601 (method not found)</text>
        <text x="134" y="136" className="fill-amber-100/90 text-[10px]">Not in the MCP spec, undocumented</text>
        <text x="134" y="154" className="fill-amber-100/90 text-[10px]">Arrives BEFORE initialize</text>
        <text x="134" y="176" className="fill-amber-300 text-[10px] font-semibold">A server that throws or exits here never reaches the handshake</text>

        <line x1="440" y1="230" x2="440" y2="254" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-handshake-arrow)" />

        {/* STEP 2: initialize */}
        <rect x="60" y="254" width="680" height="110" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <circle cx="100" cy="294" r="16" className="fill-cyan-500" />
        <text x="100" y="299" textAnchor="middle" className="fill-white text-[12px] font-bold">2</text>
        <text x="130" y="286" className="fill-cyan-300 text-[13px] font-mono font-semibold">initialize</text>
        <text x="130" y="306" className="fill-muted-foreground text-[11px]">response: protocol version negotiated</text>
        <text x="130" y="324" className="fill-muted-foreground/70 text-[9px]">defaults to the latest version the CLI understands (2025-06-18)</text>

        <line x1="440" y1="364" x2="440" y2="388" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-handshake-arrow)" />

        {/* STEP 3: notifications/initialized (no response) */}
        <rect x="60" y="388" width="680" height="110" rx="10" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="100" cy="428" r="16" className="fill-zinc-500" />
        <text x="100" y="433" textAnchor="middle" className="fill-white text-[12px] font-bold">3</text>
        <text x="130" y="420" className="fill-zinc-300 text-[12px] font-mono font-semibold">notifications/initialized</text>
        <text x="130" y="440" className="fill-muted-foreground text-[11px]">no response</text>
        <text x="130" y="458" className="fill-muted-foreground/70 text-[9px]">it is a notification, not a request</text>

        <line x1="440" y1="498" x2="440" y2="522" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-handshake-arrow)" />

        {/* STEP 4: tools/list */}
        <rect x="60" y="522" width="680" height="110" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <circle cx="100" cy="562" r="16" className="fill-cyan-500" />
        <text x="100" y="567" textAnchor="middle" className="fill-white text-[12px] font-bold">4</text>
        <text x="130" y="554" className="fill-cyan-300 text-[13px] font-mono font-semibold">tools/list</text>
        <text x="130" y="574" className="fill-muted-foreground text-[11px]">response: the 10 read-only tools</text>
        <text x="130" y="592" className="fill-muted-foreground/70 text-[9px]">list_categories, list_accounts, get_monthly_summary, and 7 more</text>

        <line x1="440" y1="632" x2="440" y2="656" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lmtc-handshake-arrow)" />

        {/* STEP 5: tools/call (loopable) */}
        <rect x="60" y="656" width="680" height="150" rx="10" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="2" />
        <circle cx="100" cy="696" r="16" className="fill-emerald-500" />
        <text x="100" y="701" textAnchor="middle" className="fill-white text-[12px] font-bold">5</text>
        <text x="130" y="688" className="fill-emerald-300 text-[13px] font-mono font-semibold">tools/call</text>
        <text x="130" y="708" className="fill-muted-foreground text-[11px]">response: a result</text>
        <text x="130" y="728" className="fill-emerald-300 text-[10px] font-semibold">repeatable up to the turn limit</text>
        <text x="130" y="746" className="fill-muted-foreground/70 text-[9px] font-mono">(--max-turns 12)</text>

        <path d="M700,760 C800,760 800,676 700,676" fill="none" className="stroke-emerald-500/70" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#lmtc-handshake-arrow-emerald)" />
        <text x="812" y="714" textAnchor="middle" className="fill-emerald-400 text-[9px] font-semibold">loop</text>
        <text x="812" y="726" textAnchor="middle" className="fill-emerald-400 text-[9px] font-semibold">per turn</text>

        <text x="440" y="832" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Repeats until the model has enough to answer, or --max-turns 12 is reached.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
