/** Homelab Wazuh, Part 3 diagrams: 8-bug cascade + final 4-agent architecture */

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
 * Eight-bug cascade across the deploy-wazuh.yml runs. Each fix unlocked the
 * next bug. Render reads top-to-bottom so the dependency chain is obvious.
 */
export function WazuhBugCascadeDiagram({ caption }: DiagramProps) {
  const bugs = [
    {
      n: 1,
      title: "Cert hostname mismatch",
      detail: "wazuh.indexer (dotted) vs wazuh-indexer (hyphen)",
      fix: "Rename compose hostnames + network aliases",
    },
    {
      n: 2,
      title: "UDP 514 collision",
      detail: "Manager bound 514/udp; rsyslog already owned it",
      fix: "Drop 514/udp from manager; rsyslog -> file -> agent",
    },
    {
      n: 3,
      title: "API password complexity",
      detail: "Error 5007: needs upper + lower + digit + special",
      fix: "Aa1!<32-char base> format",
    },
    {
      n: 4,
      title: "Security index not initialized",
      detail: "503 Service Unavailable: OpenSearch Security",
      fix: "Run securityadmin.sh after first stack start",
    },
    {
      n: 5,
      title: "Manager healthcheck false negative",
      detail: "API root returns 401 by design (JWT-only)",
      fix: "Accept any 2xx-5xx; rewrite Ansible task to POST /authenticate",
    },
    {
      n: 6,
      title: "ISM call from wrong host",
      detail: "Indexer 9200 is loopback-only; controller can't reach",
      fix: "Run URI task on host (delegate semantics, 127.0.0.1)",
    },
    {
      n: 7,
      title: "Decoder XML rejection",
      detail: "<decoder_list> wrapper not allowed by analysisd",
      fix: "Flatten to top-level <decoder> elements",
    },
    {
      n: 8,
      title: "PCRE2 regex shorthand",
      detail: "\\w \\s \\d unsupported by default OSSEC engine",
      fix: 'Add type="pcre2" attribute on <regex> and <prematch>',
    },
  ];

  const rowH = 56;
  const top = 60;
  const totalH = top + bugs.length * rowH + 90;

  return (
    <DiagramWrapper
      caption={
        caption ??
        "Eight bugs surfaced during deploy-wazuh.yml runs. Each fix unblocked the next. Top-to-bottom dependency: certs first (nothing connects without them), then ports, then auth, then content."
      }
    >
      <svg
        viewBox={`0 0 720 ${totalH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="bcArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500/80" />
          </marker>
        </defs>

        <text
          x="360"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          deploy-wazuh.yml: 8-Bug Cascade
        </text>
        <text
          x="360"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Each fix unlocked the next. Read top to bottom.
        </text>

        {bugs.map((b, i) => {
          const y = top + i * rowH;
          return (
            <g key={b.n}>
              {/* number circle */}
              <circle
                cx="40"
                cy={y + 22}
                r="16"
                className="fill-amber-500/15 stroke-amber-500"
                strokeWidth="1.5"
              />
              <text
                x="40"
                y={y + 27}
                textAnchor="middle"
                className="fill-amber-300 text-[12px] font-bold"
              >
                {b.n}
              </text>

              {/* card */}
              <rect
                x="70"
                y={y}
                width="620"
                height="44"
                rx="8"
                className="fill-muted/15 stroke-muted-foreground/40"
                strokeWidth="1"
              />
              <text
                x="84"
                y={y + 17}
                className="fill-foreground text-[11px] font-semibold"
              >
                {b.title}
              </text>
              <text
                x="84"
                y={y + 32}
                className="fill-muted-foreground text-[10px]"
              >
                {b.detail}
              </text>
              <text
                x="690"
                y={y + 25}
                textAnchor="end"
                className="fill-emerald-300/90 text-[10px] font-medium"
              >
                fix: {b.fix}
              </text>

              {/* arrow to next */}
              {i < bugs.length - 1 && (
                <line
                  x1="40"
                  y1={y + 38}
                  x2="40"
                  y2={y + rowH + 6}
                  className="stroke-amber-500/70"
                  strokeWidth="1.5"
                  markerEnd="url(#bcArrow)"
                />
              )}
            </g>
          );
        })}

        <text
          x="360"
          y={totalH - 30}
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[10px]"
        >
          After bug 8: 3 containers healthy, manager API responding,
          indexer green, dashboard at https://172.16.27.210/
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Final 4-agent architecture as deployed. Mirrors the planning diagram from
 * Part 1 but with reality: real IPs, the rsyslog mode-0644 detail, and the
 * UDM Pro syslog flow that took a manual UI walkthrough to wire up.
 */
export function WazuhFinalArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Deployed architecture: 4 agents (manager self, wazah local, raspberrypi, chriss-mac-mini), 1 manager, 1 indexer, 1 dashboard. UDM Pro syslog reaches the manager via rsyslog -> /var/log/udm-pro.log (mode 0644) -> wazah local agent."
      }
    >
      <svg
        viewBox="0 0 960 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="faArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
          <marker
            id="faArrowAmber"
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
          x="480"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          homelab-wazuh: As Deployed (4 agents, 1 stack)
        </text>

        {/* LAN boundary */}
        <rect
          x="20"
          y="46"
          width="920"
          height="510"
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
          LAN 172.16.27.0/24
        </text>

        {/* UDM Pro */}
        <rect
          x="40"
          y="90"
          width="180"
          height="80"
          rx="10"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="130"
          y="112"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          UDM Pro (172.16.27.1)
        </text>
        <text
          x="130"
          y="130"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          12 syslog categories
        </text>
        <text
          x="130"
          y="146"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          IPS, firewall, admin,
        </text>
        <text
          x="130"
          y="160"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          clients, triggers, VPN
        </text>

        {/* Pi-hole */}
        <rect
          x="40"
          y="200"
          width="180"
          height="80"
          rx="10"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="130"
          y="222"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          raspberrypi (002)
        </text>
        <text
          x="130"
          y="240"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          172.16.27.227
        </text>
        <text
          x="130"
          y="256"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Pi-hole DNS events
        </text>
        <text
          x="130"
          y="270"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          (raspbian, armv7l)
        </text>

        {/* Mac */}
        <rect
          x="40"
          y="310"
          width="180"
          height="80"
          rx="10"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="130"
          y="332"
          textAnchor="middle"
          className="fill-violet-300 text-[11px] font-semibold"
        >
          chriss-mac-mini (003)
        </text>
        <text
          x="130"
          y="350"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          172.16.27.187
        </text>
        <text
          x="130"
          y="366"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          macOS endpoint
        </text>
        <text
          x="130"
          y="380"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          (darwin, arm64)
        </text>

        {/* Source -> HUNSN arrows */}
        <line
          x1="220"
          y1="130"
          x2="350"
          y2="170"
          className="stroke-cyan-500/80"
          strokeWidth="1.5"
          markerEnd="url(#faArrow)"
        />
        <text
          x="240"
          y="120"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UDP 514 syslog
        </text>

        <line
          x1="220"
          y1="240"
          x2="350"
          y2="260"
          className="stroke-emerald-500/80"
          strokeWidth="1.5"
          markerEnd="url(#faArrow)"
        />
        <text
          x="240"
          y="232"
          className="fill-muted-foreground/80 text-[9px]"
        >
          TCP 1514 (AES)
        </text>

        <line
          x1="220"
          y1="350"
          x2="350"
          y2="320"
          className="stroke-violet-500/80"
          strokeWidth="1.5"
          markerEnd="url(#faArrow)"
        />
        <text
          x="240"
          y="362"
          className="fill-muted-foreground/80 text-[9px]"
        >
          TCP 1514 (AES)
        </text>

        {/* HUNSN host */}
        <rect
          x="350"
          y="100"
          width="430"
          height="430"
          rx="12"
          className="fill-amber-500/6 stroke-amber-500/60"
          strokeWidth="1.2"
        />
        <text
          x="370"
          y="120"
          className="fill-amber-400 text-[11px] font-semibold"
        >
          HUNSN RS34 (wazah, 172.16.27.210)
        </text>
        <text
          x="370"
          y="134"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Ubuntu 26.04 LTS, J4125 4-core, 14 GiB RAM
        </text>

        {/* rsyslog */}
        <rect
          x="370"
          y="148"
          width="190"
          height="60"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500/70"
          strokeWidth="1"
        />
        <text
          x="465"
          y="168"
          textAnchor="middle"
          className="fill-cyan-300 text-[10px] font-semibold"
        >
          rsyslog (host)
        </text>
        <text
          x="465"
          y="184"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          /var/log/udm-pro.log
        </text>
        <text
          x="465"
          y="198"
          textAnchor="middle"
          className="fill-amber-300/80 text-[9px]"
        >
          mode 0644 (logrotate too)
        </text>

        {/* wazah agent (self/local) */}
        <rect
          x="580"
          y="148"
          width="180"
          height="60"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1"
        />
        <text
          x="670"
          y="168"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          wazah agent (001)
        </text>
        <text
          x="670"
          y="184"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UDM tail + apcupsd
        </text>
        <text
          x="670"
          y="198"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          (ubuntu, amd64)
        </text>

        {/* rsyslog -> wazah arrow */}
        <line
          x1="560"
          y1="178"
          x2="580"
          y2="178"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#faArrow)"
        />

        {/* Docker stack box */}
        <rect
          x="370"
          y="230"
          width="390"
          height="200"
          rx="8"
          className="fill-amber-500/6 stroke-amber-500/50"
          strokeWidth="1"
        />
        <text
          x="565"
          y="250"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          Docker Compose: Wazuh stack 4.12.0
        </text>

        {/* manager */}
        <rect
          x="385"
          y="262"
          width="360"
          height="50"
          rx="6"
          className="fill-amber-500/12 stroke-amber-500/70"
          strokeWidth="1"
        />
        <text
          x="565"
          y="280"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          wazuh.manager (000, amzn)
        </text>
        <text
          x="565"
          y="296"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          analysisd + UniFi/Pi-hole/apcupsd decoders (PCRE2)
        </text>

        {/* indexer */}
        <rect
          x="385"
          y="322"
          width="360"
          height="50"
          rx="6"
          className="fill-amber-500/12 stroke-amber-500/70"
          strokeWidth="1"
        />
        <text
          x="565"
          y="340"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          wazuh.indexer
        </text>
        <text
          x="565"
          y="356"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          loopback-only 9200, ISM 30-day delete
        </text>

        {/* dashboard */}
        <rect
          x="385"
          y="382"
          width="360"
          height="40"
          rx="6"
          className="fill-amber-500/12 stroke-amber-500/70"
          strokeWidth="1"
        />
        <text
          x="565"
          y="400"
          textAnchor="middle"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          wazuh.dashboard
        </text>
        <text
          x="565"
          y="414"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          HTTPS 443 LAN-only (https://172.16.27.210/)
        </text>

        {/* wazah agent -> manager */}
        <line
          x1="670"
          y1="208"
          x2="670"
          y2="262"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#faArrowAmber)"
        />

        {/* remote agents -> manager (entry into HUNSN) */}
        <line
          x1="350"
          y1="260"
          x2="385"
          y2="280"
          className="stroke-emerald-500/70"
          strokeWidth="1.5"
          markerEnd="url(#faArrow)"
        />
        <line
          x1="350"
          y1="320"
          x2="385"
          y2="295"
          className="stroke-violet-500/70"
          strokeWidth="1.5"
          markerEnd="url(#faArrow)"
        />

        {/* Operator */}
        <rect
          x="800"
          y="382"
          width="130"
          height="60"
          rx="8"
          className="fill-muted/30 stroke-muted-foreground/50"
          strokeWidth="1"
        />
        <text
          x="865"
          y="402"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          Operator
        </text>
        <text
          x="865"
          y="418"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          LAN browser
        </text>
        <text
          x="865"
          y="432"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UDM Pro WireGuard
        </text>

        {/* dashboard -> operator */}
        <line
          x1="745"
          y1="402"
          x2="800"
          y2="402"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#faArrow)"
        />

        {/* footer */}
        <text
          x="480"
          y="555"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[10px]"
        >
          4 agents active. Manager 4.12.0. ISM 30-day. Real UDM Pro
          IPS alerts firing at level 10.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
