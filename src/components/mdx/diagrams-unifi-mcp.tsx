/** UniFi MCP blog post diagrams: SVG-based, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return (
    <DiagramLightbox caption={caption}>
      {children}
    </DiagramLightbox>
  );
}

/**
 * Architecture diagram: Claude Code session -> FastMCP server -> loaders ->
 * per-product tool surface -> httpx -> UniFi console.
 */
export function UniFiMCPArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Claude Code talks to a single FastMCP server that lazy-loads tools per UniFi product and proxies every call through httpx with X-API-Key auth"
      }
    >
      <svg
        viewBox="0 0 900 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="umcpArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        {/* Claude Code box */}
        <rect
          x="320"
          y="20"
          width="260"
          height="60"
          rx="10"
          className="fill-primary/15 stroke-primary"
          strokeWidth="1.5"
        />
        <text
          x="450"
          y="48"
          textAnchor="middle"
          className="fill-primary text-[14px] font-semibold"
        >
          Claude Code session
        </text>
        <text
          x="450"
          y="66"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          MCP client over stdio
        </text>

        <line
          x1="450"
          y1="80"
          x2="450"
          y2="115"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#umcpArrow)"
        />

        {/* FastMCP server */}
        <rect
          x="260"
          y="120"
          width="380"
          height="90"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="450"
          y="148"
          textAnchor="middle"
          className="fill-cyan-500 text-[14px] font-semibold"
        >
          FastMCP server (unifi-mcp)
        </text>
        <text
          x="450"
          y="170"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          5 utility tools always loaded
        </text>
        <text
          x="450"
          y="188"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          _bind_client closure strips infra args from JSON Schema
        </text>

        {/* Three loader boxes */}
        <line x1="360" y1="210" x2="160" y2="250" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#umcpArrow)" />
        <line x1="450" y1="210" x2="450" y2="250" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#umcpArrow)" />
        <line x1="540" y1="210" x2="740" y2="250" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#umcpArrow)" />

        {/* Network loader */}
        <rect
          x="40"
          y="255"
          width="240"
          height="100"
          rx="8"
          className="fill-emerald-500/10 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text x="160" y="278" textAnchor="middle" className="fill-emerald-500 text-[13px] font-semibold">
          load_network_tools
        </text>
        <text x="160" y="300" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
          86 tools
        </text>
        <text x="160" y="318" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Devices, clients, firewall,
        </text>
        <text x="160" y="332" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          WiFi, VPN, ZBF, DPI, QoS,
        </text>
        <text x="160" y="346" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          topology, webhooks, backups
        </text>

        {/* Protect loader */}
        <rect
          x="330"
          y="255"
          width="240"
          height="100"
          rx="8"
          className="fill-purple-500/10 stroke-purple-500"
          strokeWidth="1.5"
        />
        <text x="450" y="278" textAnchor="middle" className="fill-purple-500 text-[13px] font-semibold">
          load_protect_tools
        </text>
        <text x="450" y="300" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
          12 tools (7 live, 5 stubs)
        </text>
        <text x="450" y="318" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Cameras, snapshots,
        </text>
        <text x="450" y="332" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          NVRs, liveviews,
        </text>
        <text x="450" y="346" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          rename (PATCH)
        </text>

        {/* Access loader */}
        <rect
          x="620"
          y="255"
          width="240"
          height="100"
          rx="8"
          className="fill-orange-500/10 stroke-orange-500"
          strokeWidth="1.5"
        />
        <text x="740" y="278" textAnchor="middle" className="fill-orange-500 text-[13px] font-semibold">
          load_access_tools
        </text>
        <text x="740" y="300" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
          0 tools on this console
        </text>
        <text x="740" y="318" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Probe correctly rejects
        </text>
        <text x="740" y="332" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          HTML landing page when
        </text>
        <text x="740" y="346" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Access is not installed
        </text>

        {/* Arrows converging on httpx */}
        <line x1="160" y1="355" x2="360" y2="395" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#umcpArrow)" />
        <line x1="450" y1="355" x2="450" y2="395" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#umcpArrow)" />
        <line x1="740" y1="355" x2="540" y2="395" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#umcpArrow)" />

        {/* httpx client */}
        <rect
          x="260"
          y="400"
          width="380"
          height="70"
          rx="10"
          className="fill-yellow-500/10 stroke-yellow-500"
          strokeWidth="1.5"
        />
        <text x="450" y="428" textAnchor="middle" className="fill-yellow-500 text-[13px] font-semibold">
          UnifiClient (httpx.AsyncClient)
        </text>
        <text x="450" y="450" textAnchor="middle" className="fill-muted-foreground text-[11px]">
          X-API-Key header, site-UUID resolver, content-type guard, cache
        </text>

        {/* Wire */}
        <line
          x1="450"
          y1="470"
          x2="450"
          y2="505"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#umcpArrow)"
        />
        <text x="465" y="492" className="fill-muted-foreground text-[10px] italic">
          HTTPS on LAN, X-API-Key on every call
        </text>

        {/* UniFi console */}
        <rect
          x="320"
          y="510"
          width="260"
          height="40"
          rx="10"
          className="fill-primary/15 stroke-primary"
          strokeWidth="1.5"
        />
        <text x="450" y="535" textAnchor="middle" className="fill-primary text-[13px] font-semibold">
          UniFi console (UDM Pro)
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Tool surface breakdown: visual hierarchy of 103 tools across 5 utility,
 * 86 Network (split by category), and 12 Protect (7 live + 5 stubs).
 */
export function UniFiMCPToolSurfaceDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "103 tools split across 5 utility, 86 Network categories, and 12 Protect tools (7 functional, 5 PRODUCT_UNAVAILABLE stubs)"
      }
    >
      <svg
        viewBox="0 0 900 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Utility row */}
        <rect x="30" y="20" width="840" height="70" rx="10" className="fill-primary/10 stroke-primary" strokeWidth="1.5" />
        <text x="50" y="48" className="fill-primary text-[13px] font-semibold">Utility / 5 tools always loaded</text>
        <text x="50" y="68" className="fill-muted-foreground text-[11px]">
          load_network_tools . load_protect_tools . load_access_tools . get_server_info . get_auth_report
        </text>

        {/* Network row label */}
        <rect x="30" y="110" width="840" height="30" rx="6" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="50" y="131" className="fill-emerald-500 text-[13px] font-semibold">Network / 86 tools across 19 categories (loaded on demand)</text>

        {/* Network tiles */}
        {[
          { x: 30, y: 150, w: 130, h: 50, t: "Devices", n: "12" },
          { x: 165, y: 150, w: 130, h: 50, t: "Clients", n: "8" },
          { x: 300, y: 150, w: 130, h: 50, t: "Networks/VLAN", n: "6" },
          { x: 435, y: 150, w: 130, h: 50, t: "Firewall (legacy)", n: "8" },
          { x: 570, y: 150, w: 130, h: 50, t: "Zone Firewall", n: "6" },
          { x: 705, y: 150, w: 165, h: 50, t: "WiFi / SSID", n: "6" },
          { x: 30, y: 208, w: 130, h: 50, t: "VPN", n: "2" },
          { x: 165, y: 208, w: 130, h: 50, t: "Port forwards", n: "4" },
          { x: 300, y: 208, w: 130, h: 50, t: "DPI", n: "2" },
          { x: 435, y: 208, w: 130, h: 50, t: "Hotspot", n: "2" },
          { x: 570, y: 208, w: 130, h: 50, t: "MAC ACL", n: "3" },
          { x: 705, y: 208, w: 165, h: 50, t: "QoS", n: "2" },
          { x: 30, y: 266, w: 130, h: 50, t: "Topology", n: "3" },
          { x: 165, y: 266, w: 130, h: 50, t: "RADIUS", n: "4" },
          { x: 300, y: 266, w: 130, h: 50, t: "Port profiles", n: "4" },
          { x: 435, y: 266, w: 130, h: 50, t: "Backups", n: "3" },
          { x: 570, y: 266, w: 130, h: 50, t: "Webhooks", n: "3" },
          { x: 705, y: 266, w: 165, h: 50, t: "System", n: "4" },
          { x: 30, y: 324, w: 840, h: 40, t: "Traffic Flows (all 4 return PRODUCT_UNAVAILABLE on Network 10.2.105)", n: "4" },
        ].map((tile, i) => (
          <g key={i}>
            <rect
              x={tile.x}
              y={tile.y}
              width={tile.w}
              height={tile.h}
              rx="6"
              className="fill-emerald-500/5 stroke-emerald-500/50"
              strokeWidth="1"
            />
            <text
              x={tile.x + tile.w / 2}
              y={tile.y + (tile.h > 40 ? 22 : 22)}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-semibold"
            >
              {tile.t}
            </text>
            <text
              x={tile.x + tile.w / 2}
              y={tile.y + (tile.h > 40 ? 40 : 40)}
              textAnchor="middle"
              className="fill-emerald-500 text-[12px] font-bold"
            >
              {tile.n}
            </text>
          </g>
        ))}

        {/* Protect row label */}
        <rect x="30" y="384" width="840" height="30" rx="6" className="fill-purple-500/10 stroke-purple-500" strokeWidth="1.5" />
        <text x="50" y="405" className="fill-purple-500 text-[13px] font-semibold">Protect / 12 tools (loaded on demand)</text>

        {/* Protect functional */}
        <rect x="30" y="424" width="500" height="110" rx="8" className="fill-purple-500/8 stroke-purple-500" strokeWidth="1.5" />
        <text x="50" y="448" className="fill-purple-500 text-[12px] font-semibold">Functional (7)</text>
        <text x="50" y="468" className="fill-foreground text-[10px]">list_cameras . get_camera . get_camera_snapshot</text>
        <text x="50" y="484" className="fill-foreground text-[10px]">list_liveviews . list_nvrs . get_nvr_stats</text>
        <text x="50" y="504" className="fill-foreground text-[10px]">update_camera_name (PATCH, Tier 1)</text>
        <text x="50" y="524" className="fill-muted-foreground text-[10px] italic">Live against UDM Pro, Protect 7.0.104</text>

        {/* Protect stubs */}
        <rect x="540" y="424" width="330" height="110" rx="8" className="fill-orange-500/8 stroke-orange-500" strokeWidth="1.5" />
        <text x="560" y="448" className="fill-orange-500 text-[12px] font-semibold">PRODUCT_UNAVAILABLE stubs (5)</text>
        <text x="560" y="468" className="fill-foreground text-[10px]">set_camera_recording_mode</text>
        <text x="560" y="484" className="fill-foreground text-[10px]">ptz_camera . reboot_camera</text>
        <text x="560" y="500" className="fill-foreground text-[10px]">list_motion_events . list_smart_detections</text>
        <text x="560" y="524" className="fill-muted-foreground text-[10px] italic">Probes documented, flip on firmware ship</text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Probe-by-status-code decision flow that drove endpoint archaeology.
 */
export function ProbeDecisionFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Reading status codes as directional signals: 404 means not here, 405 means wrong method on the right path, 400 means right path with wrong args"
      }
    >
      <svg
        viewBox="0 0 900 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="pdfArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        {/* Root */}
        <rect x="310" y="20" width="280" height="60" rx="10" className="fill-primary/15 stroke-primary" strokeWidth="1.5" />
        <text x="450" y="48" textAnchor="middle" className="fill-primary text-[13px] font-semibold">curl the plausible endpoint</text>
        <text x="450" y="68" textAnchor="middle" className="fill-muted-foreground text-[11px]">then read the status code</text>

        {/* Fan out */}
        <line x1="380" y1="80" x2="160" y2="120" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#pdfArrow)" />
        <line x1="440" y1="80" x2="330" y2="120" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#pdfArrow)" />
        <line x1="460" y1="80" x2="570" y2="120" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#pdfArrow)" />
        <line x1="520" y1="80" x2="740" y2="120" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#pdfArrow)" />

        {/* 404 */}
        <rect x="30" y="125" width="240" height="70" rx="8" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="150" y="150" textAnchor="middle" className="fill-red-500 text-[13px] font-semibold">404 NOT_FOUND</text>
        <text x="150" y="170" textAnchor="middle" className="fill-foreground text-[11px]">Endpoint does not exist</text>
        <text x="150" y="185" textAnchor="middle" className="fill-muted-foreground text-[10px] italic">Try the next plausible path</text>

        {/* 405 */}
        <rect x="285" y="125" width="240" height="70" rx="8" className="fill-yellow-500/10 stroke-yellow-500" strokeWidth="1.5" />
        <text x="405" y="150" textAnchor="middle" className="fill-yellow-500 text-[13px] font-semibold">405 Method Not Allowed</text>
        <text x="405" y="170" textAnchor="middle" className="fill-foreground text-[11px]">Right path, wrong verb</text>
        <text x="405" y="185" textAnchor="middle" className="fill-muted-foreground text-[10px] italic">Swap GET for POST (or vice versa)</text>

        {/* 400 */}
        <rect x="540" y="125" width="240" height="70" rx="8" className="fill-orange-500/10 stroke-orange-500" strokeWidth="1.5" />
        <text x="660" y="150" textAnchor="middle" className="fill-orange-500 text-[13px] font-semibold">400 BAD_REQUEST</text>
        <text x="660" y="170" textAnchor="middle" className="fill-foreground text-[11px]">Right path, wrong args</text>
        <text x="660" y="185" textAnchor="middle" className="fill-muted-foreground text-[10px] italic">Site name vs site UUID, envelope shape</text>

        {/* AJV parse */}
        <rect x="620" y="220" width="240" height="90" rx="8" className="fill-orange-500/10 stroke-orange-500" strokeWidth="1.5" />
        <text x="740" y="245" textAnchor="middle" className="fill-orange-500 text-[13px] font-semibold">AJV_PARSE_ERROR</text>
        <text x="740" y="265" textAnchor="middle" className="fill-foreground text-[11px]">additionalProperties rejected</text>
        <text x="740" y="283" textAnchor="middle" className="fill-muted-foreground text-[10px] italic">Feature-discovery through negative space.</text>
        <text x="740" y="298" textAnchor="middle" className="fill-muted-foreground text-[10px] italic">The field you tried does not exist.</text>

        <line x1="660" y1="195" x2="720" y2="220" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#pdfArrow)" />

        {/* 200 */}
        <rect x="30" y="220" width="540" height="90" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="300" y="245" textAnchor="middle" className="fill-emerald-500 text-[13px] font-semibold">200 OK (but mind the body)</text>
        <text x="300" y="268" textAnchor="middle" className="fill-foreground text-[11px]">JSON list? JSON dict? HTML landing page?</text>
        <text x="300" y="286" textAnchor="middle" className="fill-muted-foreground text-[10px] italic">Reject non-JSON content types at the HTTP-client boundary.</text>
        <text x="300" y="300" textAnchor="middle" className="fill-muted-foreground text-[10px] italic">Unwrap list-or-dict envelopes at the tool boundary.</text>

        {/* Example section */}
        <rect x="30" y="340" width="830" height="200" rx="10" className="fill-cyan-500/8 stroke-cyan-500" strokeWidth="1.5" />
        <text x="50" y="365" className="fill-cyan-500 text-[13px] font-semibold">Worked example: finding the events endpoint on Network 9.x</text>
        <text x="50" y="395" className="fill-foreground text-[11px] font-mono">GET  /v2/api/site/default/system-log/events    -&gt; 404</text>
        <text x="50" y="415" className="fill-foreground text-[11px] font-mono">GET  /v2/api/site/default/system-log/triggers  -&gt; 405 Method Not Allowed</text>
        <text x="50" y="435" className="fill-foreground text-[11px] font-mono">POST /v2/api/site/default/system-log/triggers  -&gt; 200 {"{data: [], ...}"}</text>
        <text x="50" y="455" className="fill-foreground text-[11px] font-mono">POST /v2/api/site/default/system-log/threats   -&gt; 200 {"{data: [], ...}"}</text>
        <text x="50" y="490" className="fill-muted-foreground text-[11px]">The 405 response was the giveaway. The endpoint exists; it just wanted POST.</text>
        <text x="50" y="510" className="fill-muted-foreground text-[11px]">Repointed get_events to POST system-log/{"{"}category{"}"} with triggers as the default.</text>
      </svg>
    </DiagramWrapper>
  );
}
