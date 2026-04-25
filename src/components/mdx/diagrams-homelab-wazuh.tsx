/** Homelab Wazuh deployment diagrams: SVG-based, themed to site colors */

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
 * Planned ingest architecture for the homelab-wazuh deployment: UDM Pro,
 * Pi-hole, Mac endpoint, and the manager's self-agent all feeding the
 * single-host Wazuh stack on the HUNSN RS34.
 */
export function WazuhHomelabIngestDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Planned ingest paths for homelab-wazuh: UDM Pro syslog via rsyslog, plus three Wazuh agents (Pi-hole, Mac, manager self) feeding one manager, one indexer, one dashboard on a single HUNSN RS34."
      }
    >
      <svg
        viewBox="0 0 940 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="whArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="470"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          homelab-wazuh: Ingest Architecture (planned)
        </text>

        {/* LAN boundary */}
        <rect
          x="20"
          y="46"
          width="900"
          height="450"
          rx="12"
          className="fill-muted/20 stroke-muted-foreground/30"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="40"
          y="66"
          className="fill-muted-foreground text-[10px] font-semibold"
        >
          LAN 172.16.27.0/24 (UDM Pro is the network boundary)
        </text>

        {/* UDM Pro */}
        <rect
          x="40"
          y="90"
          width="170"
          height="90"
          rx="10"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="125"
          y="112"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          UDM Pro
        </text>
        <text
          x="125"
          y="132"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          172.16.27.1
        </text>
        <text
          x="125"
          y="150"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          firewall, IPS, wireless,
        </text>
        <text
          x="125"
          y="164"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          admin events
        </text>

        {/* Pi-hole */}
        <rect
          x="40"
          y="210"
          width="170"
          height="90"
          rx="10"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="125"
          y="232"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          Pi-hole
        </text>
        <text
          x="125"
          y="252"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          172.16.27.227
        </text>
        <text
          x="125"
          y="270"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          DNS queries + blocks
        </text>
        <text
          x="125"
          y="284"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          (wazuh-agent on host)
        </text>

        {/* Mac endpoint */}
        <rect
          x="40"
          y="330"
          width="170"
          height="90"
          rx="10"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="125"
          y="352"
          textAnchor="middle"
          className="fill-violet-300 text-[11px] font-semibold"
        >
          Mac endpoint
        </text>
        <text
          x="125"
          y="372"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          chriss-mac-mini
        </text>
        <text
          x="125"
          y="390"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          auth, FIM, syslog
        </text>
        <text
          x="125"
          y="404"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          (wazuh-agent on host)
        </text>

        {/* Arrows from sources */}
        <line
          x1="210"
          y1="135"
          x2="340"
          y2="170"
          className="stroke-cyan-500/80"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />
        <text
          x="235"
          y="125"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UDP 514 syslog
        </text>

        <line
          x1="210"
          y1="255"
          x2="340"
          y2="245"
          className="stroke-emerald-500/80"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />
        <text
          x="235"
          y="235"
          className="fill-muted-foreground/80 text-[9px]"
        >
          TCP 1514 agent
        </text>

        <line
          x1="210"
          y1="375"
          x2="340"
          y2="330"
          className="stroke-violet-500/80"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />
        <text
          x="235"
          y="385"
          className="fill-muted-foreground/80 text-[9px]"
        >
          TCP 1514 agent
        </text>

        {/* HUNSN host */}
        <rect
          x="340"
          y="100"
          width="420"
          height="360"
          rx="12"
          className="fill-amber-500/6 stroke-amber-500/60"
          strokeWidth="1.2"
        />
        <text
          x="360"
          y="120"
          className="fill-amber-400 text-[11px] font-semibold"
        >
          HUNSN RS34 (wazah, 172.16.27.210)
        </text>
        <text
          x="360"
          y="134"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Ubuntu 26.04 LTS, J4125 4-core, 14 GiB RAM, 117 GiB SSD
        </text>

        {/* rsyslog box */}
        <rect
          x="360"
          y="150"
          width="180"
          height="60"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500/70"
          strokeWidth="1"
        />
        <text
          x="450"
          y="172"
          textAnchor="middle"
          className="fill-cyan-300 text-[10px] font-semibold"
        >
          rsyslog (host)
        </text>
        <text
          x="450"
          y="190"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          /var/log/udm-pro.log
        </text>

        {/* Self-agent box */}
        <rect
          x="560"
          y="150"
          width="180"
          height="60"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1"
        />
        <text
          x="650"
          y="172"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          wazuh-agent (self)
        </text>
        <text
          x="650"
          y="190"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          logcollector, apcupsd
        </text>

        {/* rsyslog -> self-agent arrow */}
        <line
          x1="540"
          y1="180"
          x2="560"
          y2="180"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />

        {/* Manager (Docker) */}
        <rect
          x="360"
          y="235"
          width="380"
          height="110"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1"
        />
        <text
          x="550"
          y="255"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          Docker Compose stack
        </text>
        <text
          x="550"
          y="275"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          wazuh-manager (analysisd)
        </text>
        <text
          x="550"
          y="292"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UniFi + Pi-hole + apcupsd decoders/rules
        </text>
        <text
          x="550"
          y="310"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          wazuh-indexer (loopback only)
        </text>
        <text
          x="550"
          y="328"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          wazuh-alerts-* index, ILM 30-day delete
        </text>

        {/* agent -> manager arrow */}
        <line
          x1="650"
          y1="210"
          x2="650"
          y2="235"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />

        {/* remote agents -> manager arrow */}
        <line
          x1="340"
          y1="255"
          x2="360"
          y2="275"
          className="stroke-emerald-500/70"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />
        <line
          x1="340"
          y1="325"
          x2="360"
          y2="305"
          className="stroke-violet-500/70"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />

        {/* Dashboard */}
        <rect
          x="360"
          y="370"
          width="380"
          height="70"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1"
        />
        <text
          x="550"
          y="392"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          wazuh-dashboard
        </text>
        <text
          x="550"
          y="410"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          HTTPS 443, self-signed cert, LAN-only
        </text>
        <text
          x="550"
          y="426"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          no public exposure, no Tailscale
        </text>

        {/* manager -> dashboard arrow */}
        <line
          x1="550"
          y1="345"
          x2="550"
          y2="370"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />

        {/* Operator */}
        <rect
          x="790"
          y="370"
          width="120"
          height="70"
          rx="8"
          className="fill-muted/30 stroke-muted-foreground/50"
          strokeWidth="1"
        />
        <text
          x="850"
          y="392"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          Operator
        </text>
        <text
          x="850"
          y="410"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          LAN browser
        </text>
        <text
          x="850"
          y="426"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          https://172.16.27.210
        </text>

        {/* dashboard -> operator arrow */}
        <line
          x1="740"
          y1="405"
          x2="790"
          y2="405"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#whArrow)"
        />

        {/* footer */}
        <text
          x="470"
          y="480"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          One host. One indexer. 30-day retention. LAN-only. Single-drive accept-loss-of-history.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
