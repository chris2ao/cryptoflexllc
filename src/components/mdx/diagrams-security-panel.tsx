/** CVE-2026-33579 Security Panel blog post diagrams -- SVG-based, themed to site colors */

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

/** Multi-agent coordination flow: CVE disclosure -> security agent -> builder agent -> implementation */
export function CVEResponseFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Multi-agent CVE response: from disclosure to implemented Security Panel"
      }
    >
      <svg
        viewBox="0 0 920 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Arrow marker */}
        <defs>
          <marker
            id="crfArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker
            id="crfArrowRed"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500/60" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="460"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          CVE-2026-33579 Response Timeline
        </text>

        {/* Phase 1: Trigger */}
        <rect
          x="20"
          y="50"
          width="200"
          height="90"
          rx="12"
          className="fill-red-500/10 stroke-red-500/60"
          strokeWidth="1.5"
        />
        <text
          x="120"
          y="74"
          textAnchor="middle"
          className="fill-red-400 text-[12px] font-semibold"
        >
          CVE-2026-33579
        </text>
        <text
          x="120"
          y="94"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Pairing/admin-approval
        </text>
        <text
          x="120"
          y="108"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          privilege escalation
        </text>
        <text
          x="120"
          y="128"
          textAnchor="middle"
          className="fill-red-500/60 text-[9px] font-mono"
        >
          OpenClaw 2026.4.2 patched
        </text>

        {/* Arrow to Security Agent */}
        <line
          x1="220"
          y1="95"
          x2="280"
          y2="95"
          className="stroke-red-500/60"
          strokeWidth="1.5"
          markerEnd="url(#crfArrowRed)"
        />
        <text
          x="250"
          y="88"
          textAnchor="middle"
          className="fill-red-500/60 text-[8px]"
        >
          triggers
        </text>

        {/* Phase 2: Security Agent */}
        <rect
          x="285"
          y="45"
          width="270"
          height="200"
          rx="12"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1.5"
        />
        <text
          x="420"
          y="68"
          textAnchor="middle"
          className="fill-amber-500 text-[12px] font-semibold"
        >
          JClaw_Security (Threat Hunt)
        </text>

        {/* Security agent tasks */}
        {[
          { label: "Pairing audit", y: 88 },
          { label: "Device inventory", y: 108 },
          { label: "Gateway exposure posture", y: 128 },
          { label: "Approver attribution analysis", y: 148 },
        ].map((task) => (
          <g key={task.label}>
            <rect
              x="305"
              y={task.y - 12}
              width="230"
              height="22"
              rx="4"
              className="fill-amber-500/15 stroke-amber-500/40"
              strokeWidth="1"
            />
            <text
              x="420"
              y={task.y + 3}
              textAnchor="middle"
              className="fill-amber-400 text-[10px]"
            >
              {task.label}
            </text>
          </g>
        ))}

        {/* Security deliverable */}
        <rect
          x="305"
          y="170"
          width="230"
          height="55"
          rx="8"
          className="fill-amber-500/20 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="420"
          y="192"
          textAnchor="middle"
          className="fill-amber-400 text-[11px] font-medium"
        >
          DASH-SPG-001-SEC
        </text>
        <text
          x="420"
          y="210"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Alert schema + redaction matrix + rubric
        </text>

        {/* Arrow down to coordination */}
        <line
          x1="420"
          y1="245"
          x2="420"
          y2="290"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#crfArrow)"
        />
        <text
          x="440"
          y="275"
          className="fill-muted-foreground/60 text-[8px]"
        >
          handoff
        </text>

        {/* Phase 3: Coordination (human) */}
        <rect
          x="340"
          y="295"
          width="160"
          height="44"
          rx="8"
          className="fill-violet-500/15 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="420"
          y="315"
          textAnchor="middle"
          className="fill-violet-400 text-[11px] font-medium"
        >
          Human Review
        </text>
        <text
          x="420"
          y="330"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Prioritize, scope, approve
        </text>

        {/* Arrow down to Builder Agent */}
        <line
          x1="420"
          y1="339"
          x2="420"
          y2="375"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#crfArrow)"
        />

        {/* Phase 4: Builder Agent */}
        <rect
          x="235"
          y="380"
          width="370"
          height="160"
          rx="12"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1.5"
        />
        <text
          x="420"
          y="403"
          textAnchor="middle"
          className="fill-emerald-500 text-[12px] font-semibold"
        >
          Builder Agent (Claude Code Session)
        </text>

        {/* Builder phases */}
        {[
          { label: "Types + schemas", x: 300, y: 430 },
          { label: "Log parsers", x: 470, y: 430 },
          { label: "Redaction layer", x: 300, y: 465 },
          { label: "Alert engine", x: 470, y: 465 },
          { label: "API endpoint", x: 300, y: 500 },
          { label: "5 UI components", x: 470, y: 500 },
        ].map((phase) => (
          <g key={phase.label}>
            <rect
              x={phase.x - 75}
              y={phase.y - 12}
              width="150"
              height="24"
              rx="4"
              className="fill-emerald-500/15 stroke-emerald-500/40"
              strokeWidth="1"
            />
            <text
              x={phase.x}
              y={phase.y + 3}
              textAnchor="middle"
              className="fill-emerald-400 text-[10px]"
            >
              {phase.label}
            </text>
          </g>
        ))}

        {/* Result box */}
        <rect
          x="660"
          y="380"
          width="230"
          height="160"
          rx="12"
          className="fill-cyan-500/8 stroke-cyan-500/40"
          strokeWidth="1.5"
        />
        <text
          x="775"
          y="403"
          textAnchor="middle"
          className="fill-cyan-500 text-[12px] font-semibold"
        >
          Result
        </text>

        {[
          { label: "15 files changed", y: 425 },
          { label: "26 unit tests passing", y: 445 },
          { label: "/security page live", y: 465 },
          { label: "Real data: 2 devices", y: 485 },
          { label: "Gateway posture: medium", y: 505 },
          { label: "CVE context in alerts", y: 525 },
        ].map((item) => (
          <g key={item.label}>
            <text
              x="695"
              y={item.y}
              className="fill-cyan-400 text-[10px]"
            >
              {item.label}
            </text>
          </g>
        ))}

        {/* Arrow to result */}
        <line
          x1="605"
          y1="460"
          x2="660"
          y2="460"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#crfArrow)"
        />

        {/* Right side: Parallel track labels */}
        <rect
          x="620"
          y="50"
          width="270"
          height="200"
          rx="12"
          className="fill-zinc-500/5 stroke-zinc-500/30"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="755"
          y="72"
          textAnchor="middle"
          className="fill-zinc-500 text-[11px] font-medium"
        >
          Builder Agent (DASH-SPG-001)
        </text>
        <text
          x="755"
          y="92"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Local dashboard architecture
        </text>

        {[
          { label: "P1: Collectors", y: 115 },
          { label: "P2: Aggregator API", y: 135 },
          { label: "P3: Storage layer", y: 155 },
          { label: "P4: UI components", y: 175 },
          { label: "P5: Dashboard pages", y: 195 },
          { label: "P6: Security semantics", y: 215 },
        ].map((phase) => (
          <g key={phase.label}>
            <text
              x="680"
              y={phase.y}
              className="fill-zinc-500/80 text-[9px]"
            >
              {phase.label}
            </text>
          </g>
        ))}

        {/* Arrow connecting builder plans to implementation */}
        <line
          x1="755"
          y1="250"
          x2="755"
          y2="295"
          className="stroke-zinc-500/30"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="755"
          y1="295"
          x2="500"
          y2="295"
          className="stroke-zinc-500/30"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    </DiagramWrapper>
  );
}

/** Security Panel data architecture: log sources -> parsers -> API -> UI components */
export function SecurityPanelArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Security Panel data flow: from OpenClaw logs to dashboard components"
      }
    >
      <svg
        viewBox="0 0 920 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="spaArrow"
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
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Security Panel Data Architecture
        </text>

        {/* Column 1: Data Sources */}
        <text
          x="95"
          y="58"
          textAnchor="middle"
          className="fill-zinc-500 text-[11px] font-medium"
        >
          DATA SOURCES
        </text>

        {[
          { label: "Gateway logs", desc: "Pairing events", y: 80, color: "amber" },
          { label: "paired.json", desc: "Device registry", y: 145, color: "cyan" },
          { label: "openclaw.json", desc: "Gateway config", y: 210, color: "violet" },
        ].map((source) => (
          <g key={source.label}>
            <rect
              x="20"
              y={source.y}
              width="150"
              height="50"
              rx="8"
              className={`fill-${source.color}-500/10 stroke-${source.color}-500/60`}
              strokeWidth="1.5"
            />
            <text
              x="95"
              y={source.y + 22}
              textAnchor="middle"
              className={`fill-${source.color}-400 text-[11px] font-medium`}
            >
              {source.label}
            </text>
            <text
              x="95"
              y={source.y + 38}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              {source.desc}
            </text>
          </g>
        ))}

        {/* Arrows from sources to parsers */}
        <line x1="170" y1="105" x2="230" y2="105" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />
        <line x1="170" y1="170" x2="230" y2="170" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />
        <line x1="170" y1="235" x2="230" y2="200" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />

        {/* Column 2: Parsers */}
        <text
          x="315"
          y="58"
          textAnchor="middle"
          className="fill-zinc-500 text-[11px] font-medium"
        >
          PARSERS
        </text>

        <rect
          x="235"
          y="75"
          width="160"
          height="150"
          rx="10"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1.5"
        />
        <text
          x="315"
          y="98"
          textAnchor="middle"
          className="fill-emerald-500 text-[11px] font-semibold"
        >
          security-events.ts
        </text>

        {[
          { label: "parsePairingEvents()", y: 118 },
          { label: "readPairedDevices()", y: 140 },
          { label: "getGatewayPosture()", y: 162 },
          { label: "getSecurityPosture()", y: 184 },
        ].map((fn) => (
          <g key={fn.label}>
            <text
              x="315"
              y={fn.y}
              textAnchor="middle"
              className="fill-emerald-400 text-[9px] font-mono"
            >
              {fn.label}
            </text>
          </g>
        ))}

        {/* Redaction layer */}
        <rect
          x="235"
          y="240"
          width="160"
          height="55"
          rx="8"
          className="fill-red-500/10 stroke-red-500/40"
          strokeWidth="1.5"
        />
        <text
          x="315"
          y="262"
          textAnchor="middle"
          className="fill-red-400 text-[11px] font-semibold"
        >
          redact.ts
        </text>
        <text
          x="315"
          y="280"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Paths, device IDs, IPs, secrets
        </text>

        {/* Arrow from parsers to redaction */}
        <line x1="315" y1="225" x2="315" y2="240" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />

        {/* Arrow from parsers+redaction to alert engine */}
        <line x1="395" y1="155" x2="460" y2="155" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />
        <line x1="395" y1="265" x2="460" y2="220" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />

        {/* Column 3: Alert Engine + API */}
        <text
          x="540"
          y="58"
          textAnchor="middle"
          className="fill-zinc-500 text-[11px] font-medium"
        >
          ENGINE + API
        </text>

        <rect
          x="465"
          y="80"
          width="150"
          height="80"
          rx="8"
          className="fill-violet-500/10 stroke-violet-500/60"
          strokeWidth="1.5"
        />
        <text
          x="540"
          y="105"
          textAnchor="middle"
          className="fill-violet-400 text-[11px] font-semibold"
        >
          alert-engine.ts
        </text>
        <text
          x="540"
          y="122"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          checkPairingAnomalies()
        </text>
        <text
          x="540"
          y="138"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          integrated into getActiveAlerts()
        </text>

        <rect
          x="465"
          y="180"
          width="150"
          height="55"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500/60"
          strokeWidth="1.5"
        />
        <text
          x="540"
          y="202"
          textAnchor="middle"
          className="fill-cyan-400 text-[11px] font-semibold"
        >
          GET /api/security
        </text>
        <text
          x="540"
          y="220"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Returns SecurityPanelData
        </text>

        {/* Arrow from engine to API */}
        <line x1="540" y1="160" x2="540" y2="180" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />

        {/* Arrow from API to UI */}
        <line x1="615" y1="207" x2="690" y2="130" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />

        {/* Column 4: UI Components */}
        <text
          x="790"
          y="58"
          textAnchor="middle"
          className="fill-zinc-500 text-[11px] font-medium"
        >
          UI COMPONENTS
        </text>

        <rect
          x="695"
          y="75"
          width="200"
          height="200"
          rx="12"
          className="fill-cyan-500/8 stroke-cyan-500/40"
          strokeWidth="1.5"
        />

        {[
          { label: "SecurityPanel", desc: "Main container", y: 100 },
          { label: "SecurityPostureSummary", desc: "Exposure gauge", y: 140 },
          { label: "SecurityAlertCard", desc: "Enriched alerts", y: 180 },
          { label: "PairingTimeline", desc: "Event history", y: 220 },
          { label: "PairedDevices", desc: "Device inventory", y: 255 },
        ].map((comp) => (
          <g key={comp.label}>
            <text
              x="720"
              y={comp.y}
              className="fill-cyan-400 text-[10px] font-medium"
            >
              {comp.label}
            </text>
            <text
              x="720"
              y={comp.y + 14}
              className="fill-muted-foreground text-[8px]"
            >
              {comp.desc}
            </text>
          </g>
        ))}

        {/* Pages at bottom */}
        <rect
          x="695"
          y="290"
          width="200"
          height="50"
          rx="8"
          className="fill-zinc-500/10 stroke-zinc-500/40"
          strokeWidth="1.5"
        />
        <text
          x="795"
          y="312"
          textAnchor="middle"
          className="fill-zinc-400 text-[10px] font-medium"
        >
          /security page + dashboard card
        </text>
        <text
          x="795"
          y="328"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          + sidebar navigation
        </text>

        {/* Arrow from components to pages */}
        <line x1="795" y1="275" x2="795" y2="290" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#spaArrow)" />

        {/* Bottom: data flow legend */}
        <rect
          x="20"
          y="370"
          width="880"
          height="55"
          rx="8"
          className="fill-zinc-500/5 stroke-zinc-500/20"
          strokeWidth="1"
        />
        <text
          x="460"
          y="392"
          textAnchor="middle"
          className="fill-zinc-500 text-[10px] font-medium"
        >
          Key Design Constraint
        </text>
        <text
          x="460"
          y="410"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          security-events.ts does NOT import alert-engine.ts (avoids circular dependency).
        </text>
        <text
          x="460"
          y="422"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          alert-engine.ts calls security-events.ts. Redaction applies before data leaves the API layer.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** DASH-SPG-001-SEC alert schema structure */
export function SecurityAlertSchemaDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "SecurityAlert schema: base Alert extended with security-specific fields"
      }
    >
      <svg
        viewBox="0 0 860 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="sasArrow"
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
          x="430"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          SecurityAlert Schema (DASH-SPG-001-SEC)
        </text>

        {/* Base Alert box */}
        <rect
          x="40"
          y="50"
          width="280"
          height="200"
          rx="12"
          className="fill-zinc-500/8 stroke-zinc-500/40"
          strokeWidth="1.5"
        />
        <text
          x="180"
          y="75"
          textAnchor="middle"
          className="fill-zinc-400 text-[12px] font-semibold"
        >
          Base Alert
        </text>

        {[
          { field: "id", type: "string", y: 100 },
          { field: "type", type: "AlertType", y: 118 },
          { field: "severity", type: "critical | warn | info", y: 136 },
          { field: "title", type: "string", y: 154 },
          { field: "message", type: "string", y: 172 },
          { field: "source", type: "string", y: 190 },
          { field: "timestamp", type: "Date", y: 208 },
          { field: "acknowledged", type: "boolean", y: 226 },
        ].map((f) => (
          <g key={f.field}>
            <text
              x="70"
              y={f.y}
              className="fill-cyan-400 text-[10px] font-mono"
            >
              {f.field}
            </text>
            <text
              x="190"
              y={f.y}
              className="fill-muted-foreground text-[9px] font-mono"
            >
              {f.type}
            </text>
          </g>
        ))}

        {/* Extends arrow */}
        <line
          x1="320"
          y1="150"
          x2="400"
          y2="150"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#sasArrow)"
        />
        <text
          x="360"
          y="142"
          textAnchor="middle"
          className="fill-emerald-400 text-[9px] font-medium"
        >
          extends
        </text>

        {/* SecurityAlert box */}
        <rect
          x="405"
          y="50"
          width="420"
          height="350"
          rx="12"
          className="fill-red-500/8 stroke-red-500/40"
          strokeWidth="1.5"
        />
        <text
          x="615"
          y="75"
          textAnchor="middle"
          className="fill-red-400 text-[12px] font-semibold"
        >
          SecurityAlert (extends Alert)
        </text>

        {[
          { field: "reason", type: "string", y: 100, desc: "Why this alert fired" },
          { field: "impact", type: "string", y: 120, desc: "What could go wrong" },
          { field: "remediation", type: "string", y: 140, desc: "How to fix it" },
          { field: "evidence", type: "string[]", y: 160, desc: "Supporting data points" },
          { field: "confidence", type: "number", y: 180, desc: "0.0 to 1.0 score" },
          { field: "securityStatus", type: "SecurityStatus", y: 200, desc: "open | investigating | resolved" },
          { field: "owner", type: "string", y: 220, desc: "Assigned responder" },
          { field: "tags", type: "string[]", y: 240, desc: "Classification labels" },
          { field: "actionability", type: "Actionability", y: 260, desc: "immediate | scheduled | informational" },
          { field: "securityCategory", type: "SecurityCategory", y: 280, desc: "auth | network | config | data" },
        ].map((f) => (
          <g key={f.field}>
            <text
              x="430"
              y={f.y}
              className="fill-red-400 text-[10px] font-mono"
            >
              {f.field}
            </text>
            <text
              x="580"
              y={f.y}
              className="fill-muted-foreground text-[9px] font-mono"
            >
              {f.type}
            </text>
            <text
              x="750"
              y={f.y}
              className="fill-muted-foreground/60 text-[8px]"
            >
              {f.desc}
            </text>
          </g>
        ))}

        {/* Severity rubric */}
        <rect
          x="425"
          y="310"
          width="380"
          height="70"
          rx="8"
          className="fill-amber-500/8 stroke-amber-500/30"
          strokeWidth="1"
        />
        <text
          x="615"
          y="330"
          textAnchor="middle"
          className="fill-amber-400 text-[10px] font-medium"
        >
          Severity Rubric (anti-vague rule)
        </text>

        {[
          { level: "critical", rule: "Active exploitation or data exposure", x: 450, y: 348 },
          { level: "warn", rule: "Misconfiguration that enables exploitation", x: 450, y: 363 },
          { level: "info", rule: "Audit finding, no immediate risk", x: 450, y: 378 },
        ].map((r) => (
          <g key={r.level}>
            <text
              x={r.x}
              y={r.y}
              className={`text-[9px] font-mono ${
                r.level === "critical" ? "fill-red-400" :
                r.level === "warn" ? "fill-amber-400" :
                "fill-cyan-400"
              }`}
            >
              {r.level}:
            </text>
            <text
              x={r.x + 55}
              y={r.y}
              className="fill-muted-foreground text-[9px]"
            >
              {r.rule}
            </text>
          </g>
        ))}

        {/* Redaction matrix box */}
        <rect
          x="40"
          y="275"
          width="280"
          height="125"
          rx="12"
          className="fill-red-500/8 stroke-red-500/30"
          strokeWidth="1.5"
        />
        <text
          x="180"
          y="298"
          textAnchor="middle"
          className="fill-red-400 text-[11px] font-semibold"
        >
          Redaction Matrix
        </text>

        {[
          { category: "File paths", method: "Basename only", y: 318 },
          { category: "Device IDs", method: "First 6 + last 4 chars", y: 336 },
          { category: "IP addresses", method: "Subnet mask (/24)", y: 354 },
          { category: "Secrets/tokens", method: "Full redaction", y: 372 },
          { category: "Usernames", method: "First char + asterisks", y: 390 },
        ].map((r) => (
          <g key={r.category}>
            <text
              x="65"
              y={r.y}
              className="fill-amber-400 text-[9px]"
            >
              {r.category}
            </text>
            <text
              x="170"
              y={r.y}
              className="fill-muted-foreground text-[9px]"
            >
              {r.method}
            </text>
          </g>
        ))}
      </svg>
    </DiagramWrapper>
  );
}
