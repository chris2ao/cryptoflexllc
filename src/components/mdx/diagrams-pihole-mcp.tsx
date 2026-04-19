/** Pi-hole MCP blog post diagrams: SVG-based, themed to site colors */

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
 * Research-to-ship pipeline: deep-research fan-out, decision gate, consolidation
 * of three upstream repos, shipping as a public GitHub project.
 */
export function PiholeResearchToShipDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "From /deep-research fan-out to a public GitHub ship: parallel Haiku research feeds a build-vs-adopt decision, three upstreams consolidate into one Python FastMCP server, then open-source polish lands the release."
      }
    >
      <svg
        viewBox="0 0 920 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="phrArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="460"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          chris2ao/pihole-mcp: Research to Ship
        </text>

        {/* Phase 1: Research */}
        <rect
          x="20"
          y="48"
          width="880"
          height="170"
          rx="10"
          className="fill-cyan-500/6 stroke-cyan-500/40"
          strokeWidth="1"
        />
        <text
          x="40"
          y="68"
          className="fill-cyan-500/90 text-[11px] font-semibold"
        >
          PHASE 1 - /deep-research fan-out (parallel Haiku agents)
        </text>

        {/* Research agent 1: DPI impact */}
        <rect
          x="40"
          y="85"
          width="270"
          height="115"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="175"
          y="107"
          textAnchor="middle"
          className="fill-cyan-400 text-[12px] font-semibold"
        >
          Question A: DPI impact?
        </text>
        <text
          x="175"
          y="125"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Does Pi-hole degrade UniFi DPI?
        </text>
        <text
          x="175"
          y="145"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[10px]"
        >
          Exa + Firecrawl + WebSearch
        </text>
        <text
          x="175"
          y="165"
          textAnchor="middle"
          className="fill-emerald-400 text-[10px]"
        >
          Answer: No. SNI-driven, not DNS.
        </text>
        <text
          x="175"
          y="183"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Zero community degradation reports
        </text>

        {/* Research agent 2: MCP landscape */}
        <rect
          x="325"
          y="85"
          width="270"
          height="115"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="460"
          y="107"
          textAnchor="middle"
          className="fill-cyan-400 text-[12px] font-semibold"
        >
          Question B: MCP landscape?
        </text>
        <text
          x="460"
          y="125"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          What Pi-hole MCPs exist in 2026?
        </text>
        <text
          x="460"
          y="145"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[10px]"
        >
          GitHub + npm + PyPI + Docker Hub
        </text>
        <text
          x="460"
          y="165"
          textAnchor="middle"
          className="fill-emerald-400 text-[10px]"
        >
          Answer: 5 found, 1 actively maintained.
        </text>
        <text
          x="460"
          y="183"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Combined surface leaves gap list
        </text>

        {/* Sources pill */}
        <rect
          x="610"
          y="85"
          width="270"
          height="115"
          rx="8"
          className="fill-zinc-500/10 stroke-zinc-500"
          strokeWidth="1.5"
        />
        <text
          x="745"
          y="107"
          textAnchor="middle"
          className="fill-zinc-400 text-[12px] font-semibold"
        >
          Evidence base
        </text>
        <text
          x="745"
          y="125"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          ~30 unique sources
        </text>
        <text
          x="745"
          y="145"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Ubiquiti community, r/pihole,
        </text>
        <text
          x="745"
          y="160"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Pi-hole discourse, vendor docs
        </text>
        <text
          x="745"
          y="183"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          High confidence on A, medium on B
        </text>

        {/* Arrow from Phase 1 to decision gate */}
        <line
          x1="460"
          y1="218"
          x2="460"
          y2="245"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#phrArrow)"
        />

        {/* Phase 2: Decision gate */}
        <rect
          x="20"
          y="245"
          width="880"
          height="110"
          rx="10"
          className="fill-amber-500/6 stroke-amber-500/40"
          strokeWidth="1"
        />
        <text
          x="40"
          y="265"
          className="fill-amber-500/90 text-[11px] font-semibold"
        >
          PHASE 2 - Decision gate (adopt vs extend vs build)
        </text>

        {/* Adopt option */}
        <rect
          x="40"
          y="280"
          width="270"
          height="60"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1.5"
        />
        <text
          x="175"
          y="300"
          textAnchor="middle"
          className="fill-amber-300 text-[12px] font-semibold"
        >
          Adopt upstream only
        </text>
        <text
          x="175"
          y="318"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Single dep, no control of gaps
        </text>
        <text
          x="175"
          y="332"
          textAnchor="middle"
          className="fill-rose-400/80 text-[10px]"
        >
          Rejected (gap list is real)
        </text>

        {/* Extend option */}
        <rect
          x="325"
          y="280"
          width="270"
          height="60"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1.5"
        />
        <text
          x="460"
          y="300"
          textAnchor="middle"
          className="fill-amber-300 text-[12px] font-semibold"
        >
          Fork + extend one upstream
        </text>
        <text
          x="460"
          y="318"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          TS stack, different from unifi-mcp
        </text>
        <text
          x="460"
          y="332"
          textAnchor="middle"
          className="fill-rose-400/80 text-[10px]"
        >
          Rejected (toolchain fragmentation)
        </text>

        {/* Consolidate option */}
        <rect
          x="610"
          y="280"
          width="270"
          height="60"
          rx="8"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="2"
        />
        <text
          x="745"
          y="300"
          textAnchor="middle"
          className="fill-emerald-300 text-[12px] font-semibold"
        >
          Consolidate 3 upstreams, new repo
        </text>
        <text
          x="745"
          y="318"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Python FastMCP, match unifi-mcp
        </text>
        <text
          x="745"
          y="332"
          textAnchor="middle"
          className="fill-emerald-400 text-[10px]"
        >
          Chosen (toolchain uniformity)
        </text>

        {/* Arrow to Phase 3 */}
        <line
          x1="745"
          y1="340"
          x2="745"
          y2="365"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#phrArrow)"
        />
        <line
          x1="745"
          y1="365"
          x2="460"
          y2="365"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
        />
        <line
          x1="460"
          y1="365"
          x2="460"
          y2="385"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#phrArrow)"
        />

        {/* Phase 3: Build */}
        <rect
          x="20"
          y="385"
          width="880"
          height="175"
          rx="10"
          className="fill-violet-500/6 stroke-violet-500/40"
          strokeWidth="1"
        />
        <text
          x="40"
          y="405"
          className="fill-violet-500/90 text-[11px] font-semibold"
        >
          PHASE 3 - Build (tool consolidation)
        </text>

        {/* Upstream 1 */}
        <rect
          x="40"
          y="420"
          width="180"
          height="54"
          rx="6"
          className="fill-zinc-500/10 stroke-zinc-500/70"
          strokeWidth="1.2"
        />
        <text
          x="130"
          y="438"
          textAnchor="middle"
          className="fill-zinc-300 text-[10px] font-semibold"
        >
          aplaceforallmystuff
        </text>
        <text
          x="130"
          y="452"
          textAnchor="middle"
          className="fill-muted-foreground/90 text-[9px]"
        >
          TS, 14 tools, active
        </text>
        <text
          x="130"
          y="466"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          stats, blocking, domain lists
        </text>

        {/* Upstream 2 */}
        <rect
          x="230"
          y="420"
          width="180"
          height="54"
          rx="6"
          className="fill-zinc-500/10 stroke-zinc-500/70"
          strokeWidth="1.2"
        />
        <text
          x="320"
          y="438"
          textAnchor="middle"
          className="fill-zinc-300 text-[10px] font-semibold"
        >
          sbarbett
        </text>
        <text
          x="320"
          y="452"
          textAnchor="middle"
          className="fill-muted-foreground/90 text-[9px]"
        >
          Python, 8 tools, active
        </text>
        <text
          x="320"
          y="466"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          local DNS, rich query filters
        </text>

        {/* Upstream 3 */}
        <rect
          x="420"
          y="420"
          width="180"
          height="54"
          rx="6"
          className="fill-zinc-500/10 stroke-zinc-500/70"
          strokeWidth="1.2"
        />
        <text
          x="510"
          y="438"
          textAnchor="middle"
          className="fill-zinc-300 text-[10px] font-semibold"
        >
          cwdcwd
        </text>
        <text
          x="510"
          y="452"
          textAnchor="middle"
          className="fill-muted-foreground/90 text-[9px]"
        >
          TS, 16 tools, stale
        </text>
        <text
          x="510"
          y="466"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          logs, query types, upstreams
        </text>

        {/* Merge arrow */}
        <line
          x1="130"
          y1="474"
          x2="130"
          y2="500"
          className="stroke-muted-foreground/60"
          strokeWidth="1.3"
        />
        <line
          x1="320"
          y1="474"
          x2="320"
          y2="500"
          className="stroke-muted-foreground/60"
          strokeWidth="1.3"
        />
        <line
          x1="510"
          y1="474"
          x2="510"
          y2="500"
          className="stroke-muted-foreground/60"
          strokeWidth="1.3"
        />
        <line
          x1="130"
          y1="500"
          x2="510"
          y2="500"
          className="stroke-muted-foreground/60"
          strokeWidth="1.3"
        />
        <line
          x1="320"
          y1="500"
          x2="320"
          y2="518"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#phrArrow)"
        />

        {/* Consolidated output */}
        <rect
          x="40"
          y="518"
          width="570"
          height="34"
          rx="6"
          className="fill-violet-500/15 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="325"
          y="539"
          textAnchor="middle"
          className="fill-violet-300 text-[11px] font-semibold"
        >
          chris2ao/pihole-mcp: 28 tools + server_info across 6 modules
        </text>

        {/* Side panel: stack */}
        <rect
          x="630"
          y="420"
          width="250"
          height="132"
          rx="8"
          className="fill-violet-500/10 stroke-violet-500/80"
          strokeWidth="1.5"
        />
        <text
          x="755"
          y="440"
          textAnchor="middle"
          className="fill-violet-300 text-[11px] font-semibold"
        >
          Stack (matches unifi-mcp)
        </text>
        <text
          x="645"
          y="462"
          className="fill-muted-foreground text-[10px]"
        >
          Python 3.12+, uv
        </text>
        <text
          x="645"
          y="478"
          className="fill-muted-foreground text-[10px]"
        >
          FastMCP 2.x, stdio
        </text>
        <text
          x="645"
          y="494"
          className="fill-muted-foreground text-[10px]"
        >
          httpx.AsyncClient
        </text>
        <text
          x="645"
          y="510"
          className="fill-muted-foreground text-[10px]"
        >
          Pydantic v2 + pydantic-settings
        </text>
        <text
          x="645"
          y="526"
          className="fill-muted-foreground text-[10px]"
        >
          pytest + respx for httpx mocks
        </text>
        <text
          x="645"
          y="546"
          className="fill-muted-foreground/70 text-[9px]"
        >
          hatchling build, MIT license
        </text>

        {/* Arrow to Phase 4 */}
        <line
          x1="460"
          y1="560"
          x2="460"
          y2="585"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#phrArrow)"
        />

        {/* Phase 4: Ship */}
        <rect
          x="20"
          y="585"
          width="880"
          height="115"
          rx="10"
          className="fill-emerald-500/8 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="40"
          y="605"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          PHASE 4 - Ship (open-source polish, retrofitted to unifi-mcp too)
        </text>

        {/* Ship pills */}
        <rect x="40" y="620" width="155" height="34" rx="6" className="fill-emerald-500/15 stroke-emerald-500/80" strokeWidth="1" />
        <text x="117" y="641" textAnchor="middle" className="fill-emerald-300 text-[10px] font-medium">Public repo + MIT</text>

        <rect x="205" y="620" width="155" height="34" rx="6" className="fill-emerald-500/15 stroke-emerald-500/80" strokeWidth="1" />
        <text x="282" y="641" textAnchor="middle" className="fill-emerald-300 text-[10px] font-medium">CI: pytest 3.12 + 3.13</text>

        <rect x="370" y="620" width="155" height="34" rx="6" className="fill-emerald-500/15 stroke-emerald-500/80" strokeWidth="1" />
        <text x="447" y="641" textAnchor="middle" className="fill-emerald-300 text-[10px] font-medium">3 issue templates</text>

        <rect x="535" y="620" width="155" height="34" rx="6" className="fill-emerald-500/15 stroke-emerald-500/80" strokeWidth="1" />
        <text x="612" y="641" textAnchor="middle" className="fill-emerald-300 text-[10px] font-medium">13 topics + badges</text>

        <rect x="700" y="620" width="180" height="34" rx="6" className="fill-emerald-500/15 stroke-emerald-500/80" strokeWidth="1" />
        <text x="790" y="641" textAnchor="middle" className="fill-emerald-300 text-[10px] font-medium">Branch protection on main</text>

        <text
          x="40"
          y="680"
          className="fill-muted-foreground text-[10px]"
        >
          Same hygiene retrofitted to the existing unifi-mcp public repo for parity.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Pi-hole v6 session auth flow: first-request authentication, X-FTL-SID header
 * on every subsequent call, 401 retry, near-expiry pre-auth, best-effort DELETE.
 */
export function PiholeSessionAuthDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Pi-hole v6 session auth state machine. First request authenticates, subsequent calls carry X-FTL-SID, 401 invalidates and re-auths once, near-expiry (<60s) pre-empts stale sessions, shutdown DELETEs the session best-effort."
      }
    >
      <svg
        viewBox="0 0 920 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="paArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker
            id="paArrowRose"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-rose-500/80" />
          </marker>
          <marker
            id="paArrowAmber"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="460"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Pi-hole v6 Session Auth: State Machine
        </text>

        {/* State 1: No session */}
        <rect
          x="40"
          y="55"
          width="220"
          height="80"
          rx="10"
          className="fill-zinc-500/12 stroke-zinc-500"
          strokeWidth="1.5"
        />
        <text
          x="150"
          y="82"
          textAnchor="middle"
          className="fill-zinc-300 text-[12px] font-semibold"
        >
          No session
        </text>
        <text
          x="150"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          sid = None
        </text>
        <text
          x="150"
          y="118"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          expires_at = 0
        </text>

        {/* Auth arrow */}
        <line
          x1="260"
          y1="95"
          x2="370"
          y2="95"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#paArrow)"
        />
        <text
          x="315"
          y="86"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          POST /api/auth
        </text>
        <text
          x="315"
          y="112"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          body: {"{password: app-password}"}
        </text>

        {/* State 2: Authenticating */}
        <rect
          x="370"
          y="55"
          width="220"
          height="80"
          rx="10"
          className="fill-amber-500/12 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="480"
          y="82"
          textAnchor="middle"
          className="fill-amber-300 text-[12px] font-semibold"
        >
          Authenticating
        </text>
        <text
          x="480"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          await resp.json()
        </text>
        <text
          x="480"
          y="118"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          session {"{sid, valid, csrf}"}
        </text>

        {/* Arrow to Authenticated */}
        <line
          x1="590"
          y1="95"
          x2="700"
          y2="95"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#paArrow)"
        />
        <text
          x="645"
          y="86"
          textAnchor="middle"
          className="fill-emerald-400/80 text-[10px]"
        >
          200 OK
        </text>
        <text
          x="645"
          y="112"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          cache sid + expires_at
        </text>

        {/* State 3: Authenticated */}
        <rect
          x="700"
          y="55"
          width="180"
          height="80"
          rx="10"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="790"
          y="82"
          textAnchor="middle"
          className="fill-emerald-300 text-[12px] font-semibold"
        >
          Authenticated
        </text>
        <text
          x="790"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          sid cached
        </text>
        <text
          x="790"
          y="118"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          expires = now + valid
        </text>

        {/* Auth fail path */}
        <line
          x1="480"
          y1="135"
          x2="480"
          y2="165"
          className="stroke-rose-500/70"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#paArrowRose)"
        />
        <text
          x="500"
          y="158"
          className="fill-rose-400 text-[10px]"
        >
          non-200: raise PiholeAuthError
        </text>

        {/* Request loop container */}
        <rect
          x="40"
          y="200"
          width="840"
          height="185"
          rx="12"
          className="fill-cyan-500/5 stroke-cyan-500/40"
          strokeWidth="1.2"
        />
        <text
          x="60"
          y="222"
          className="fill-cyan-500/90 text-[12px] font-semibold"
        >
          Request loop (every tool call)
        </text>

        {/* Request block */}
        <rect
          x="60"
          y="238"
          width="240"
          height="75"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.2"
        />
        <text
          x="180"
          y="260"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          ensure_session()
        </text>
        <text
          x="180"
          y="278"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          if not sid or near_expiry:
        </text>
        <text
          x="180"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          re-authenticate
        </text>
        <text
          x="180"
          y="307"
          textAnchor="middle"
          className="fill-amber-400/80 text-[9px]"
        >
          60s pre-expiry buffer
        </text>

        {/* Arrow to HTTP */}
        <line
          x1="300"
          y1="275"
          x2="360"
          y2="275"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#paArrow)"
        />

        {/* HTTP request block */}
        <rect
          x="360"
          y="238"
          width="290"
          height="75"
          rx="8"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.2"
        />
        <text
          x="505"
          y="260"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          Send HTTP request
        </text>
        <text
          x="505"
          y="278"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          headers: X-FTL-SID: {"<sid>"}
        </text>
        <text
          x="505"
          y="293"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          e.g. GET /api/stats/summary
        </text>
        <text
          x="505"
          y="307"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          or POST /api/dns/blocking, etc.
        </text>

        {/* Success path */}
        <line
          x1="650"
          y1="262"
          x2="705"
          y2="262"
          className="stroke-emerald-500/80"
          strokeWidth="1.5"
          markerEnd="url(#paArrow)"
        />
        <text
          x="665"
          y="253"
          className="fill-emerald-400 text-[10px]"
        >
          2xx
        </text>

        {/* Response OK block */}
        <rect
          x="705"
          y="238"
          width="155"
          height="45"
          rx="8"
          className="fill-emerald-500/15 stroke-emerald-500/80"
          strokeWidth="1.2"
        />
        <text
          x="782"
          y="260"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          Return JSON
        </text>
        <text
          x="782"
          y="276"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          to tool caller
        </text>

        {/* 401 path */}
        <line
          x1="505"
          y1="313"
          x2="505"
          y2="345"
          className="stroke-rose-500/80"
          strokeWidth="1.5"
          markerEnd="url(#paArrowRose)"
        />
        <text
          x="520"
          y="335"
          className="fill-rose-400 text-[10px]"
        >
          401 Unauthorized
        </text>

        {/* 401 handler block */}
        <rect
          x="360"
          y="345"
          width="290"
          height="32"
          rx="6"
          className="fill-rose-500/15 stroke-rose-500"
          strokeWidth="1.2"
        />
        <text
          x="505"
          y="365"
          textAnchor="middle"
          className="fill-rose-300 text-[10px] font-medium"
        >
          Invalidate sid, re-auth, retry once
        </text>

        {/* 401 handler loops back up */}
        <line
          x1="360"
          y1="361"
          x2="180"
          y2="361"
          className="stroke-rose-500/70"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <line
          x1="180"
          y1="361"
          x2="180"
          y2="315"
          className="stroke-rose-500/70"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          markerEnd="url(#paArrowRose)"
        />

        {/* Near-expiry callout */}
        <line
          x1="180"
          y1="238"
          x2="180"
          y2="160"
          className="stroke-amber-500/80"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          markerEnd="url(#paArrowAmber)"
        />
        <text
          x="195"
          y="185"
          className="fill-amber-400 text-[10px]"
        >
          near-expiry (&lt; 60s): re-auth pre-emptively
        </text>

        {/* Shutdown block */}
        <rect
          x="40"
          y="420"
          width="840"
          height="105"
          rx="10"
          className="fill-violet-500/6 stroke-violet-500/40"
          strokeWidth="1.2"
        />
        <text
          x="60"
          y="442"
          className="fill-violet-400 text-[12px] font-semibold"
        >
          Shutdown
        </text>

        <rect
          x="60"
          y="455"
          width="260"
          height="58"
          rx="8"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="1.2"
        />
        <text
          x="190"
          y="477"
          textAnchor="middle"
          className="fill-violet-300 text-[11px] font-semibold"
        >
          DELETE /api/auth
        </text>
        <text
          x="190"
          y="493"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          headers: X-FTL-SID: {"<sid>"}
        </text>
        <text
          x="190"
          y="507"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          best-effort, any exception swallowed
        </text>

        <line
          x1="320"
          y1="484"
          x2="370"
          y2="484"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#paArrow)"
        />

        <rect
          x="370"
          y="455"
          width="260"
          height="58"
          rx="8"
          className="fill-zinc-500/12 stroke-zinc-500"
          strokeWidth="1.2"
        />
        <text
          x="500"
          y="477"
          textAnchor="middle"
          className="fill-zinc-300 text-[11px] font-semibold"
        >
          No session
        </text>
        <text
          x="500"
          y="495"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Server reclaims session slot
        </text>

        <text
          x="650"
          y="478"
          className="fill-muted-foreground/80 text-[10px]"
        >
          Fallback: if DELETE fails, session
        </text>
        <text
          x="650"
          y="495"
          className="fill-muted-foreground/80 text-[10px]"
        >
          expires server-side from validity.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
