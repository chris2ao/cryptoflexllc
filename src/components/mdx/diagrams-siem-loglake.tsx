/** Custom SIEM Log-Lake blog post diagrams -- SVG-based, themed to site colors */

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
 * Master architecture diagram: log sources, syslog rail, Mac mini docker-compose
 * stack (vector, clickhouse, backend, frontend), external SSD, SQLite, and
 * Claude Code operator path.
 */
export function SiemLoglakeArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Custom SIEM Log-Lake architecture: UDM Pro, Pi-hole, and UniFi devices push syslog to Vector on a Mac mini M4 running docker-compose. Vector parses and writes to ClickHouse. FastAPI queries ClickHouse and SQLite to power the Mission Control dashboard."
      }
    >
      <svg
        viewBox="0 0 940 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="slArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
          <marker
            id="slArrowEm"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
          <marker
            id="slArrowAm"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500/80" />
          </marker>
          <marker
            id="slArrowFu"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-fuchsia-500/80" />
          </marker>
          <marker
            id="slArrowMu"
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
          x="470"
          y="22"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Custom SIEM Log-Lake -- Architecture
        </text>

        {/* LAN boundary */}
        <rect
          x="14"
          y="34"
          width="910"
          height="516"
          rx="12"
          className="fill-muted/20 stroke-muted-foreground/30"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="34"
          y="52"
          className="fill-muted-foreground text-[10px] font-semibold"
        >
          LAN 172.16.27.0/24
        </text>

        {/* --- Log source cards (top row) --- */}

        {/* UDM Pro */}
        <rect
          x="34"
          y="62"
          width="178"
          height="88"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="123"
          y="82"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          UDM Pro (172.16.27.1)
        </text>
        <text
          x="123"
          y="100"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          firewall, IPS, wireless,
        </text>
        <text
          x="123"
          y="114"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          admin events
        </text>
        <text
          x="123"
          y="128"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          rsyslog imfile
        </text>

        {/* Pi-hole */}
        <rect
          x="256"
          y="62"
          width="178"
          height="88"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="345"
          y="82"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          Pi-hole (172.16.27.227)
        </text>
        <text
          x="345"
          y="100"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          FTL DNS log
        </text>
        <text
          x="345"
          y="114"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          via rsyslog imfile
        </text>

        {/* UniFi APs + Switches */}
        <rect
          x="478"
          y="62"
          width="178"
          height="88"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="567"
          y="82"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          UniFi APs + Switches
        </text>
        <text
          x="567"
          y="100"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          U7 Pro, U7 In-Wall,
        </text>
        <text
          x="567"
          y="114"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          USW-Flex
        </text>

        {/* Syslog rail */}
        <rect
          x="34"
          y="194"
          width="622"
          height="30"
          rx="6"
          className="fill-cyan-500/8 stroke-cyan-500/50"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="345"
          y="214"
          textAnchor="middle"
          className="fill-cyan-400 text-[10px] font-semibold"
        >
          syslog UDP 5140
        </text>

        {/* Source -> rail arrows */}
        <line
          x1="123"
          y1="150"
          x2="123"
          y2="194"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#slArrow)"
        />
        <line
          x1="345"
          y1="150"
          x2="345"
          y2="194"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#slArrow)"
        />
        <line
          x1="567"
          y1="150"
          x2="567"
          y2="194"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#slArrow)"
        />

        {/* --- Mac mini host box --- */}
        <rect
          x="34"
          y="240"
          width="622"
          height="250"
          rx="10"
          className="fill-slate-500/6 stroke-slate-400/50"
          strokeWidth="1.2"
        />
        <text
          x="54"
          y="258"
          className="fill-slate-300 text-[10px] font-semibold"
        >
          Mac mini M4 (172.16.27.187) -- docker-compose
        </text>

        {/* Rail -> vector arrow */}
        <line
          x1="250"
          y1="224"
          x2="160"
          y2="274"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#slArrow)"
        />

        {/* vector service card */}
        <rect
          x="54"
          y="268"
          width="270"
          height="90"
          rx="8"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="189"
          y="288"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          vector
        </text>
        <text
          x="189"
          y="306"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          syslog source, VRL transforms,
        </text>
        <text
          x="189"
          y="319"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          ClickHouse HTTP sink,
        </text>
        <text
          x="189"
          y="332"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          2 GB disk buffer
        </text>

        {/* clickhouse service card */}
        <rect
          x="346"
          y="268"
          width="270"
          height="90"
          rx="8"
          className="fill-fuchsia-500/12 stroke-fuchsia-500"
          strokeWidth="1.5"
        />
        <text
          x="481"
          y="288"
          textAnchor="middle"
          className="fill-fuchsia-300 text-[11px] font-semibold"
        >
          clickhouse
        </text>
        <text
          x="481"
          y="306"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          MergeTree + Aggregating + Replacing,
        </text>
        <text
          x="481"
          y="319"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          port 8123, 180-day TTL
        </text>

        {/* vector -> clickhouse arrow */}
        <line
          x1="324"
          y1="313"
          x2="346"
          y2="313"
          className="stroke-emerald-500/80"
          strokeWidth="1.5"
          markerEnd="url(#slArrowEm)"
        />
        <text
          x="335"
          y="306"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[8px]"
        >
          JSONEachRow
        </text>
        <text
          x="335"
          y="317"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[8px]"
        >
          over HTTP
        </text>

        {/* backend service card */}
        <rect
          x="54"
          y="382"
          width="270"
          height="90"
          rx="8"
          className="fill-amber-500/12 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="189"
          y="402"
          textAnchor="middle"
          className="fill-amber-300 text-[11px] font-semibold"
        >
          backend (FastAPI)
        </text>
        <text
          x="189"
          y="420"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          queries CH for events,
        </text>
        <text
          x="189"
          y="433"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          SQLite for refs, APScheduler,
        </text>
        <text
          x="189"
          y="446"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          notification dispatcher
        </text>

        {/* frontend service card */}
        <rect
          x="346"
          y="382"
          width="270"
          height="90"
          rx="8"
          className="fill-slate-500/12 stroke-slate-400"
          strokeWidth="1.5"
        />
        <text
          x="481"
          y="402"
          textAnchor="middle"
          className="fill-slate-300 text-[11px] font-semibold"
        >
          frontend (Vite/React)
        </text>
        <text
          x="481"
          y="420"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Mission Control dashboard,
        </text>
        <text
          x="481"
          y="433"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          SIEM and VECTOR health chips
        </text>

        {/* backend <-> clickhouse */}
        <line
          x1="481"
          y1="358"
          x2="481"
          y2="382"
          className="stroke-fuchsia-500/70"
          strokeWidth="1.5"
          markerEnd="url(#slArrowFu)"
        />
        <text
          x="495"
          y="366"
          className="fill-muted-foreground/70 text-[8px]"
        >
          SQL / HTTP
        </text>
        <text
          x="495"
          y="376"
          className="fill-muted-foreground/70 text-[8px]"
        >
          dashboard role
        </text>

        {/* backend -> frontend */}
        <line
          x1="324"
          y1="427"
          x2="346"
          y2="427"
          className="stroke-amber-500/80"
          strokeWidth="1.5"
          markerEnd="url(#slArrowAm)"
        />

        {/* --- External SSD (right side) --- */}
        <rect
          x="680"
          y="268"
          width="210"
          height="90"
          rx="8"
          className="fill-slate-500/10 stroke-slate-400/60"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <text
          x="785"
          y="288"
          textAnchor="middle"
          className="fill-slate-300 text-[10px] font-semibold"
        >
          External SSD
        </text>
        <text
          x="785"
          y="304"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          /Volumes/MacExternal
        </text>
        <text
          x="785"
          y="320"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          ClickHouse data, Vector buffer,
        </text>
        <text
          x="785"
          y="333"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          300 GB cap
        </text>

        {/* clickhouse -> external SSD arrow */}
        <line
          x1="616"
          y1="313"
          x2="680"
          y2="313"
          className="stroke-fuchsia-500/60"
          strokeWidth="1.5"
          markerEnd="url(#slArrowFu)"
        />

        {/* --- Claude Code card (bottom right) --- */}
        <rect
          x="680"
          y="380"
          width="210"
          height="80"
          rx="8"
          className="fill-muted/20 stroke-muted-foreground/40"
          strokeWidth="1"
        />
        <text
          x="785"
          y="400"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          Claude Code
        </text>
        <text
          x="785"
          y="416"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          mcp__clickhouse
        </text>
        <text
          x="785"
          y="430"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          claude SELECT-only role
        </text>

        {/* Claude Code -> clickhouse */}
        <line
          x1="785"
          y1="380"
          x2="616"
          y2="350"
          className="stroke-muted-foreground/50"
          strokeWidth="1.2"
          markerEnd="url(#slArrowMu)"
        />

        {/* --- SQLite card (bottom left, outside host box) --- */}
        <rect
          x="34"
          y="510"
          width="220"
          height="30"
          rx="6"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1"
        />
        <text
          x="144"
          y="530"
          textAnchor="middle"
          className="fill-amber-300 text-[9px] font-semibold"
        >
          SQLite ./data/homenet.db -- persona, acks, feed cache, audit log
        </text>

        {/* backend -> sqlite arrow */}
        <line
          x1="144"
          y1="472"
          x2="144"
          y2="510"
          className="stroke-amber-500/60"
          strokeWidth="1.2"
          markerEnd="url(#slArrowAm)"
        />
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Three-pattern ingestion diagram: syslog push (Vector), HTTP-pulled snapshots
 * (APScheduler), and reference writes (SQLite via FastAPI).
 */
export function SiemLoglakeIngestionDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Three ingestion patterns in the SIEM Log-Lake. Lane 1: devices push syslog to Vector, which parses via VRL and writes raw_syslog. Lane 2: APScheduler polls UniFi and Pi-hole REST APIs, staging snapshots into AggregatingMergeTree via materialized views. Lane 3: operator and Claude Code write reference data to SQLite through FastAPI."
      }
    >
      <svg
        viewBox="0 0 940 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="inArrowCy"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
          <marker
            id="inArrowAm"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500/80" />
          </marker>
          <marker
            id="inArrowFu"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-fuchsia-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="470"
          y="24"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Three Ingestion Patterns
        </text>

        {/* Lane dividers */}
        <line
          x1="320"
          y1="38"
          x2="320"
          y2="430"
          className="stroke-muted-foreground/20"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <line
          x1="636"
          y1="38"
          x2="636"
          y2="430"
          className="stroke-muted-foreground/20"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Lane 1 header */}
        <text
          x="160"
          y="50"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          1. Syslog push
        </text>

        {/* Lane 2 header */}
        <text
          x="478"
          y="50"
          textAnchor="middle"
          className="fill-amber-300 text-[11px] font-semibold"
        >
          2. HTTP-pulled snapshots
        </text>

        {/* Lane 3 header */}
        <text
          x="788"
          y="50"
          textAnchor="middle"
          className="fill-fuchsia-300 text-[11px] font-semibold"
        >
          3. Reference writes
        </text>

        {/* === Lane 1 boxes === */}
        {/* Box 1-1 */}
        <rect
          x="40"
          y="62"
          width="240"
          height="62"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="86"
          textAnchor="middle"
          className="fill-cyan-300 text-[10px] font-semibold"
        >
          Device
        </text>
        <text
          x="160"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UDM Pro, Pi-hole, UniFi
        </text>

        {/* Arrow 1-1 -> 1-2 */}
        <line
          x1="160"
          y1="124"
          x2="160"
          y2="148"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowCy)"
        />

        {/* Box 1-2 */}
        <rect
          x="40"
          y="148"
          width="240"
          height="62"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500/70"
          strokeWidth="1.2"
        />
        <text
          x="160"
          y="172"
          textAnchor="middle"
          className="fill-cyan-300 text-[10px] font-semibold"
        >
          Vector syslog source
        </text>
        <text
          x="160"
          y="188"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UDP 5140
        </text>

        {/* Arrow 1-2 -> 1-3 */}
        <line
          x1="160"
          y1="210"
          x2="160"
          y2="234"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowCy)"
        />

        {/* Box 1-3 */}
        <rect
          x="40"
          y="234"
          width="240"
          height="62"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500/70"
          strokeWidth="1.2"
        />
        <text
          x="160"
          y="258"
          textAnchor="middle"
          className="fill-cyan-300 text-[10px] font-semibold"
        >
          VRL parser
        </text>
        <text
          x="160"
          y="274"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          parse_udmpro, parse_pihole,
        </text>
        <text
          x="160"
          y="286"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          parse_unifi_device
        </text>

        {/* Arrow 1-3 -> 1-4 */}
        <line
          x1="160"
          y1="296"
          x2="160"
          y2="320"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowCy)"
        />

        {/* Box 1-4 */}
        <rect
          x="40"
          y="320"
          width="240"
          height="62"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500/70"
          strokeWidth="1.2"
        />
        <text
          x="160"
          y="344"
          textAnchor="middle"
          className="fill-cyan-300 text-[10px] font-semibold"
        >
          ClickHouse raw_syslog
        </text>
        <text
          x="160"
          y="360"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          MergeTree, 180-day TTL
        </text>

        {/* Caption 1 */}
        <text
          x="160"
          y="408"
          textAnchor="middle"
          className="fill-cyan-400/70 text-[9px] font-semibold"
        >
          Vector owns push streams.
        </text>

        {/* === Lane 2 boxes === */}
        {/* Box 2-1 */}
        <rect
          x="356"
          y="62"
          width="240"
          height="62"
          rx="8"
          className="fill-amber-500/12 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="476"
          y="86"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          UniFi REST, Pi-hole REST
        </text>

        {/* Arrow 2-1 -> 2-2 */}
        <line
          x1="476"
          y1="124"
          x2="476"
          y2="148"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowAm)"
        />

        {/* Box 2-2 */}
        <rect
          x="356"
          y="148"
          width="240"
          height="62"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1.2"
        />
        <text
          x="476"
          y="172"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          Backend APScheduler poll
        </text>
        <text
          x="476"
          y="188"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          session auth, retries, 429 backoff
        </text>

        {/* Arrow 2-2 -> 2-3 */}
        <line
          x1="476"
          y1="210"
          x2="476"
          y2="234"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowAm)"
        />

        {/* Box 2-3 */}
        <rect
          x="356"
          y="234"
          width="240"
          height="62"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1.2"
        />
        <text
          x="476"
          y="256"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          Python writer
        </text>
        <text
          x="476"
          y="272"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          *_input staging table
        </text>

        {/* Arrow 2-3 -> 2-4 */}
        <line
          x1="476"
          y1="296"
          x2="476"
          y2="320"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowAm)"
        />

        {/* Box 2-4 */}
        <rect
          x="356"
          y="320"
          width="240"
          height="62"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1.2"
        />
        <text
          x="476"
          y="344"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          Materialized view
        </text>
        <text
          x="476"
          y="360"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          argMaxState, AggregatingMergeTree
        </text>

        {/* Caption 2 */}
        <text
          x="476"
          y="408"
          textAnchor="middle"
          className="fill-amber-400/70 text-[9px] font-semibold"
        >
          Python owns REST polls.
        </text>

        {/* === Lane 3 boxes === */}
        {/* Box 3-1 */}
        <rect
          x="672"
          y="62"
          width="240"
          height="62"
          rx="8"
          className="fill-fuchsia-500/12 stroke-fuchsia-500"
          strokeWidth="1.5"
        />
        <text
          x="792"
          y="86"
          textAnchor="middle"
          className="fill-fuchsia-300 text-[10px] font-semibold"
        >
          Operator (UI, Claude Code)
        </text>

        {/* Arrow 3-1 -> 3-2 */}
        <line
          x1="792"
          y1="124"
          x2="792"
          y2="148"
          className="stroke-fuchsia-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowFu)"
        />

        {/* Box 3-2 */}
        <rect
          x="672"
          y="148"
          width="240"
          height="62"
          rx="8"
          className="fill-fuchsia-500/10 stroke-fuchsia-500/70"
          strokeWidth="1.2"
        />
        <text
          x="792"
          y="172"
          textAnchor="middle"
          className="fill-fuchsia-300 text-[10px] font-semibold"
        >
          FastAPI route handler
        </text>

        {/* Arrow 3-2 -> 3-3 */}
        <line
          x1="792"
          y1="210"
          x2="792"
          y2="234"
          className="stroke-fuchsia-500/70"
          strokeWidth="1.5"
          markerEnd="url(#inArrowFu)"
        />

        {/* Box 3-3 */}
        <rect
          x="672"
          y="234"
          width="240"
          height="148"
          rx="8"
          className="fill-fuchsia-500/10 stroke-fuchsia-500/70"
          strokeWidth="1.2"
        />
        <text
          x="792"
          y="258"
          textAnchor="middle"
          className="fill-fuchsia-300 text-[10px] font-semibold"
        >
          SQLite (SQLModel)
        </text>
        <text
          x="792"
          y="276"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          persona, acks,
        </text>
        <text
          x="792"
          y="290"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          feed cache, audit log
        </text>

        {/* Caption 3 */}
        <text
          x="792"
          y="408"
          textAnchor="middle"
          className="fill-fuchsia-400/70 text-[9px] font-semibold"
        >
          SQLite stays for slowly-changing
        </text>
        <text
          x="792"
          y="420"
          textAnchor="middle"
          className="fill-fuchsia-400/70 text-[9px] font-semibold"
        >
          reference and ack state.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * ClickHouse engine choices: MergeTree for time-series, AggregatingMergeTree
 * with argMaxState for snapshots, and ReplacingMergeTree for security findings.
 */
export function SiemSchemaEnginesDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "ClickHouse engine selection by table type. MergeTree tables hold append-only time-series with TTL. AggregatingMergeTree tables wrap every column in argMaxState for last-value snapshot semantics. ReplacingMergeTree tables handle security findings that fire repeatedly, updating in place via last_seen as the version key."
      }
    >
      <svg
        viewBox="0 0 940 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="470"
          y="24"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Schema -- Engine Choices
        </text>

        {/* Column dividers */}
        <line
          x1="316"
          y1="36"
          x2="316"
          y2="406"
          className="stroke-muted-foreground/20"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <line
          x1="632"
          y1="36"
          x2="632"
          y2="406"
          className="stroke-muted-foreground/20"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* === Column 1: MergeTree === */}
        <rect
          x="20"
          y="38"
          width="276"
          height="350"
          rx="10"
          className="fill-emerald-500/8 stroke-emerald-500/60"
          strokeWidth="1.5"
        />
        <text
          x="158"
          y="60"
          textAnchor="middle"
          className="fill-emerald-300 text-[12px] font-semibold"
        >
          MergeTree
        </text>

        {/* Row items col 1 */}
        {[
          "raw_syslog",
          "client_dns_query",
          "wan_probe_sample",
          "dpi_snapshot",
          "pihole_stats",
          "client_history",
        ].map((name, i) => (
          <g key={name}>
            <rect
              x="36"
              y={76 + i * 36}
              width="244"
              height="28"
              rx="5"
              className="fill-emerald-500/10 stroke-emerald-500/30"
              strokeWidth="1"
            />
            <text
              x="158"
              y={76 + i * 36 + 18}
              textAnchor="middle"
              className="fill-emerald-200 text-[10px]"
            >
              {name}
            </text>
          </g>
        ))}

        <text
          x="158"
          y="306"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Time-series. Append-only.
        </text>
        <text
          x="158"
          y="320"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          PARTITION BY toYYYYMM(ts).
        </text>
        <text
          x="158"
          y="334"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          TTL ts + INTERVAL 180 DAY.
        </text>

        {/* === Column 2: AggregatingMergeTree === */}
        <rect
          x="336"
          y="38"
          width="276"
          height="350"
          rx="10"
          className="fill-fuchsia-500/8 stroke-fuchsia-500/60"
          strokeWidth="1.5"
        />
        <text
          x="474"
          y="56"
          textAnchor="middle"
          className="fill-fuchsia-300 text-[11px] font-semibold"
        >
          AggregatingMergeTree
        </text>
        <text
          x="474"
          y="70"
          textAnchor="middle"
          className="fill-fuchsia-400/70 text-[9px]"
        >
          + argMaxState
        </text>

        {/* Row items col 2 */}
        {[
          "client",
          "device",
          "network",
          "wlan",
          "firewall_rule",
          "topology_node",
          "topology_edge",
        ].map((name, i) => (
          <g key={name}>
            <rect
              x="352"
              y={80 + i * 32}
              width="244"
              height="24"
              rx="5"
              className="fill-fuchsia-500/10 stroke-fuchsia-500/30"
              strokeWidth="1"
            />
            <text
              x="474"
              y={80 + i * 32 + 16}
              textAnchor="middle"
              className="fill-fuchsia-200 text-[10px]"
            >
              {name}
            </text>
          </g>
        ))}

        <text
          x="474"
          y="310"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Snapshots. argMaxState wraps
        </text>
        <text
          x="474"
          y="324"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          each column on write.
        </text>
        <text
          x="474"
          y="338"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          *_latest views run argMaxMerge.
        </text>

        {/* === Column 3: ReplacingMergeTree === */}
        <rect
          x="652"
          y="38"
          width="270"
          height="350"
          rx="10"
          className="fill-amber-500/8 stroke-amber-500/60"
          strokeWidth="1.5"
        />
        <text
          x="787"
          y="60"
          textAnchor="middle"
          className="fill-amber-300 text-[12px] font-semibold"
        >
          ReplacingMergeTree
        </text>

        {/* Row items col 3 */}
        {["security_finding"].map((name, i) => (
          <g key={name}>
            <rect
              x="668"
              y={76 + i * 36}
              width="238"
              height="28"
              rx="5"
              className="fill-amber-500/10 stroke-amber-500/30"
              strokeWidth="1"
            />
            <text
              x="787"
              y={76 + i * 36 + 18}
              textAnchor="middle"
              className="fill-amber-200 text-[10px]"
            >
              {name}
            </text>
          </g>
        ))}

        <text
          x="787"
          y="154"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Findings. Repeated fires
        </text>
        <text
          x="787"
          y="168"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          update in place via last_seen
        </text>
        <text
          x="787"
          y="182"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          as the version key.
        </text>
        <text
          x="787"
          y="200"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Reads use FINAL
        </text>
        <text
          x="787"
          y="214"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          or argMax.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
