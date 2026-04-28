/** DNS bypass remediation diagrams: SVG-based, themed to site colors */

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
 * ZBF policy evaluation chain for the dns_bypass remediation.
 *
 * Three rules layered on the same isolated VLANs (OnboardNetwork = VLAN 2,
 * RoamingQuarantine = VLAN 3). UniFi evaluates ZBF policies in ascending
 * index order; first match wins, so a low-index ALLOW carves a hole through
 * a higher-index BLOCK. The auto-generated `Isolated Networks` policy at
 * index 30000 still drops everything else from these VLANs to the
 * Default network.
 */
export function ZBFPolicyChainDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "ZBF first-match evaluation. Index 10000 ALLOW carves a hole to Pi-hole. Index 10001 BLOCK catches every other DNS attempt. Index 30000 Isolated Networks BLOCK still drops the rest."
      }
    >
      <svg
        viewBox="0 0 940 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="dnsArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L8,3 L0,6 Z"
              className="fill-muted-foreground/70"
            />
          </marker>
          <marker
            id="dnsArrowAllow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
          <marker
            id="dnsArrowDeny"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="470"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          ZBF Policy Chain on VLAN 2 / VLAN 3 (DNS Egress)
        </text>
        <text
          x="470"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          UniFi evaluates rules in ascending index. First match wins.
        </text>

        {/* Source: VLAN client */}
        <rect
          x="20"
          y="220"
          width="170"
          height="100"
          rx="10"
          className="fill-primary/12 stroke-primary"
          strokeWidth="1.5"
        />
        <text
          x="105"
          y="245"
          textAnchor="middle"
          className="fill-primary text-[11px] font-semibold"
        >
          VLAN 2 / VLAN 3 Client
        </text>
        <text
          x="105"
          y="266"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          OnboardNetwork
        </text>
        <text
          x="105"
          y="282"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          or RoamingQuarantine
        </text>
        <text
          x="105"
          y="304"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          DHCP option 6: 172.16.27.227
        </text>

        {/* Arrow into chain */}
        <line
          x1="190"
          y1="270"
          x2="225"
          y2="270"
          className="stroke-muted-foreground/70"
          strokeWidth="1.5"
          markerEnd="url(#dnsArrow)"
        />

        {/* Index 10000: ALLOW to Pi-hole */}
        <rect
          x="240"
          y="80"
          width="350"
          height="110"
          rx="10"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="415"
          y="103"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          Index 10000 ALLOW
        </text>
        <text
          x="415"
          y="125"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          src: VLAN 2 / VLAN 3
        </text>
        <text
          x="415"
          y="142"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          dst: 172.16.27.227 (Pi-hole)
        </text>
        <text
          x="415"
          y="159"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          dst port: 53 (UDP/TCP)
        </text>
        <text
          x="415"
          y="178"
          textAnchor="middle"
          className="fill-emerald-400/90 text-[9px]"
        >
          Carves a hole through `network_isolation_enabled`
        </text>

        {/* Index 10001: BLOCK to public DNS */}
        <rect
          x="240"
          y="225"
          width="350"
          height="110"
          rx="10"
          className="fill-red-500/12 stroke-red-500"
          strokeWidth="1.5"
        />
        <text
          x="415"
          y="248"
          textAnchor="middle"
          className="fill-red-300 text-[11px] font-semibold"
        >
          Index 10001 BLOCK
        </text>
        <text
          x="415"
          y="270"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          src: VLAN 2 / VLAN 3
        </text>
        <text
          x="415"
          y="287"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          dst: ANY (internet)
        </text>
        <text
          x="415"
          y="304"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          dst port: 53 (UDP/TCP)
        </text>
        <text
          x="415"
          y="323"
          textAnchor="middle"
          className="fill-red-400/90 text-[9px]"
        >
          Catches Quad9 / 1.1.1.1 / 8.8.8.8 if DHCP is bypassed
        </text>

        {/* Index 30000: predefined Isolated Networks BLOCK */}
        <rect
          x="240"
          y="370"
          width="350"
          height="110"
          rx="10"
          className="fill-amber-500/10 stroke-amber-500/80"
          strokeWidth="1.5"
        />
        <text
          x="415"
          y="393"
          textAnchor="middle"
          className="fill-amber-300 text-[11px] font-semibold"
        >
          Index 30000 BLOCK (predefined)
        </text>
        <text
          x="415"
          y="415"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          Isolated Networks rule
        </text>
        <text
          x="415"
          y="432"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          src: VLAN 2 / VLAN 3
        </text>
        <text
          x="415"
          y="449"
          textAnchor="middle"
          className="fill-foreground text-[10px]"
        >
          dst: any other internal VLAN
        </text>
        <text
          x="415"
          y="468"
          textAnchor="middle"
          className="fill-amber-400/90 text-[9px]"
        >
          Auto-generated by `network_isolation_enabled: true`
        </text>

        {/* Vertical "first match wins" axis */}
        <line
          x1="225"
          y1="60"
          x2="225"
          y2="500"
          className="stroke-muted-foreground/40"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x="218"
          y="60"
          textAnchor="end"
          className="fill-muted-foreground text-[9px]"
        >
          first match
        </text>
        <text
          x="218"
          y="495"
          textAnchor="end"
          className="fill-muted-foreground text-[9px]"
        >
          last fallthrough
        </text>

        {/* Arrows from source to each rule */}
        <line
          x1="225"
          y1="135"
          x2="240"
          y2="135"
          className="stroke-emerald-500/70"
          strokeWidth="1.5"
          markerEnd="url(#dnsArrowAllow)"
        />
        <line
          x1="225"
          y1="280"
          x2="240"
          y2="280"
          className="stroke-red-500/70"
          strokeWidth="1.5"
          markerEnd="url(#dnsArrowDeny)"
        />
        <line
          x1="225"
          y1="425"
          x2="240"
          y2="425"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#dnsArrow)"
        />

        {/* Outcomes */}
        <rect
          x="640"
          y="80"
          width="270"
          height="110"
          rx="10"
          className="fill-emerald-500/8 stroke-emerald-500/60"
          strokeWidth="1.2"
        />
        <text
          x="775"
          y="105"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          Pi-hole resolves
        </text>
        <text
          x="775"
          y="128"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Client DNS works
        </text>
        <text
          x="775"
          y="145"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Pi-hole sees the client
        </text>
        <text
          x="775"
          y="162"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          dns_bypass signal counts it
        </text>
        <text
          x="775"
          y="180"
          textAnchor="middle"
          className="fill-emerald-400/80 text-[9px]"
        >
          covered_unifi_clients += 1
        </text>

        <rect
          x="640"
          y="225"
          width="270"
          height="110"
          rx="10"
          className="fill-red-500/8 stroke-red-500/60"
          strokeWidth="1.2"
        />
        <text
          x="775"
          y="250"
          textAnchor="middle"
          className="fill-red-300 text-[11px] font-semibold"
        >
          Public DNS dropped
        </text>
        <text
          x="775"
          y="273"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          No fallback to Quad9
        </text>
        <text
          x="775"
          y="290"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          No fallback to 1.1.1.1
        </text>
        <text
          x="775"
          y="307"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Encrypted DNS still blocked
        </text>
        <text
          x="775"
          y="325"
          textAnchor="middle"
          className="fill-red-400/80 text-[9px]"
        >
          DoH on 443 is a separate problem
        </text>

        <rect
          x="640"
          y="370"
          width="270"
          height="110"
          rx="10"
          className="fill-amber-500/8 stroke-amber-500/60"
          strokeWidth="1.2"
        />
        <text
          x="775"
          y="395"
          textAnchor="middle"
          className="fill-amber-300 text-[11px] font-semibold"
        >
          Cross-VLAN dropped
        </text>
        <text
          x="775"
          y="418"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          No lateral movement
        </text>
        <text
          x="775"
          y="435"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          to Default / IoT / Cameras
        </text>
        <text
          x="775"
          y="452"
          textAnchor="middle"
          className="fill-amber-400/80 text-[9px]"
        >
          Original isolation guarantee
        </text>
        <text
          x="775"
          y="470"
          textAnchor="middle"
          className="fill-amber-400/80 text-[9px]"
        >
          stays intact
        </text>

        {/* Outcome arrows */}
        <line
          x1="590"
          y1="135"
          x2="640"
          y2="135"
          className="stroke-emerald-500/70"
          strokeWidth="1.5"
          markerEnd="url(#dnsArrowAllow)"
        />
        <line
          x1="590"
          y1="280"
          x2="640"
          y2="280"
          className="stroke-red-500/70"
          strokeWidth="1.5"
          markerEnd="url(#dnsArrowDeny)"
        />
        <line
          x1="590"
          y1="425"
          x2="640"
          y2="425"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#dnsArrow)"
        />

        {/* Footnote */}
        <text
          x="470"
          y="520"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px] italic"
        >
          Indices 10000 / 10001 chosen so the new rules sort above the
          predefined Isolated Networks rule at 30000.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Assumption-vs-reality grid for UniFi v2 Traffic Rules. Captures the four
 * schema gotchas surfaced while building the chris2ao/unifi-mcp v0.4.0
 * traffic_rules tools.
 */
export function TrafficRulesAssumptionsDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "What I assumed UniFi v2 Traffic Rules supported vs what the controller actually accepts. Each row is a real schema discovery from building the v0.4.0 tools."
      }
    >
      <svg
        viewBox="0 0 940 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="470"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          UniFi v2 Traffic Rules: Assumption vs Reality
        </text>

        {/* Column headers */}
        <text
          x="245"
          y="62"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          What I assumed
        </text>
        <text
          x="695"
          y="62"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          What the controller actually does
        </text>

        {/* Row 1: name vs description */}
        <rect
          x="30"
          y="80"
          width="430"
          height="70"
          rx="8"
          className="fill-muted/30 stroke-muted-foreground/40"
          strokeWidth="1"
        />
        <text
          x="245"
          y="105"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          Use `name` for the rule label
        </text>
        <text
          x="245"
          y="125"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Like every other UniFi v1 endpoint
        </text>

        <rect
          x="480"
          y="80"
          width="430"
          height="70"
          rx="8"
          className="fill-red-500/12 stroke-red-500/70"
          strokeWidth="1"
        />
        <text
          x="695"
          y="105"
          textAnchor="middle"
          className="fill-red-300 text-[11px] font-semibold"
        >
          The field is `description`
        </text>
        <text
          x="695"
          y="125"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          `name` is silently dropped on persist
        </text>

        {/* Row 2: ports field */}
        <rect
          x="30"
          y="160"
          width="430"
          height="70"
          rx="8"
          className="fill-muted/30 stroke-muted-foreground/40"
          strokeWidth="1"
        />
        <text
          x="245"
          y="185"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          Block traffic by destination port
        </text>
        <text
          x="245"
          y="205"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Just pass `ports: [53]`
        </text>

        <rect
          x="480"
          y="160"
          width="430"
          height="70"
          rx="8"
          className="fill-red-500/12 stroke-red-500/70"
          strokeWidth="1"
        />
        <text
          x="695"
          y="185"
          textAnchor="middle"
          className="fill-red-300 text-[11px] font-semibold"
        >
          No `ports` field exists at all
        </text>
        <text
          x="695"
          y="205"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          For port-level filters, use ZBF firewall-policies
        </text>

        {/* Row 3: target_devices.exclude */}
        <rect
          x="30"
          y="240"
          width="430"
          height="70"
          rx="8"
          className="fill-muted/30 stroke-muted-foreground/40"
          strokeWidth="1"
        />
        <text
          x="245"
          y="265"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          `target_devices.exclude: true`
        </text>
        <text
          x="245"
          y="285"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          {`For "all clients EXCEPT this one"`}
        </text>

        <rect
          x="480"
          y="240"
          width="430"
          height="70"
          rx="8"
          className="fill-red-500/12 stroke-red-500/70"
          strokeWidth="1"
        />
        <text
          x="695"
          y="265"
          textAnchor="middle"
          className="fill-red-300 text-[11px] font-semibold"
        >
          `exclude` is silently dropped
        </text>
        <text
          x="695"
          y="285"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          You can target devices but not anti-target them
        </text>

        {/* Row 4: GET by id */}
        <rect
          x="30"
          y="320"
          width="430"
          height="70"
          rx="8"
          className="fill-muted/30 stroke-muted-foreground/40"
          strokeWidth="1"
        />
        <text
          x="245"
          y="345"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          {`GET /trafficrules/<id> works`}
        </text>
        <text
          x="245"
          y="365"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Standard REST conventions
        </text>

        <rect
          x="480"
          y="320"
          width="430"
          height="70"
          rx="8"
          className="fill-red-500/12 stroke-red-500/70"
          strokeWidth="1"
        />
        <text
          x="695"
          y="345"
          textAnchor="middle"
          className="fill-red-300 text-[11px] font-semibold"
        >
          GET by id returns 405
        </text>
        <text
          x="695"
          y="365"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Tools fetch the collection and filter locally
        </text>

        {/* Footer */}
        <text
          x="470"
          y="425"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[10px] italic"
        >
          Each row is a real schema discovery while building the
          chris2ao/unifi-mcp v0.4.0 traffic_rules tools.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
