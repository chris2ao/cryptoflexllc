/** Encrypted DNS with a PoE Raspberry Pi 5 blog post diagrams: editorial SVG, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  StepBadge,
  elbowPath,
  monoWidth,
  type DiagramAccent,
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

/** A chip centered on `cx` instead of anchored to an edge. */
function CenterChip({
  cx,
  y,
  label,
  accent,
  filled = true,
  fontSize = 11,
}: {
  cx: number;
  y: number;
  label: string;
  accent: DiagramAccent;
  filled?: boolean;
  fontSize?: number;
}) {
  const w = monoWidth(label, fontSize) + 18;
  return (
    <Chip
      x={cx - w / 2}
      y={y}
      label={label}
      accent={accent}
      filled={filled}
      fontSize={fontSize}
    />
  );
}

/**
 * Devices ask one of three encrypted resolvers (two Pi-holes, then the
 * gateway). Every tier reaches Cloudflare and Quad9 over DoH on port 443.
 * Plain DNS to the internet (port 53, and DoT on 853) is blocked.
 */
export function EncryptedDnsTierChainDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Three encrypted resolvers in a chain: PiHoleMain first, PiHoleBackup second, the gateway last. Each one reaches Cloudflare and Quad9 over DNS over HTTPS, and plain DNS to the internet is blocked."
      }
    >
      <EditorialFrame
        id="edns1"
        w={880}
        h={500}
        eyebrow="Three Encrypted Resolver Tiers"
        chips={[
          { label: "3 tiers", accent: "primary" },
          { label: "0 plaintext", accent: "emerald" },
        ]}
        footerRight="DoH · Cloudflare · Quad9"
      >
        {/* Devices */}
        <NodePanel
          x={24}
          y={160}
          w={150}
          h={130}
          title="Devices"
          sub={["phones", "TVs", "laptops"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Devices -> tier bus */}
        <FlowLine id="edns1" d="M174,225 L196,225" accent="primary" arrow={false} />
        <path d="M196,120 L196,330" fill="none" className="stroke-primary/50" strokeWidth="1.5" />
        {[120, 225, 330].map((cy) => (
          <FlowLine key={cy} id="edns1" d={`M196,${cy} L214,${cy}`} accent="primary" />
        ))}

        {/* Tiers */}
        <NodePanel
          x={216}
          y={74}
          w={300}
          h={92}
          accent="emerald"
          emphasis
          align="left"
          title="PiHoleMain"
          sub={["Pi 5 · Pi-hole + dnscrypt-proxy", "ad blocking: yes"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={400} y={84} label="Tier 1" accent="emerald" filled fontSize={11} />
        </NodePanel>
        <NodePanel
          x={216}
          y={179}
          w={300}
          h={92}
          accent="primary"
          align="left"
          title="PiHoleBackup"
          sub={["Pi 3B+ · synced hourly", "ad blocking: yes"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={400} y={189} label="Tier 2" accent="primary" filled fontSize={11} />
        </NodePanel>
        <NodePanel
          x={216}
          y={284}
          w={300}
          h={92}
          accent="amber"
          align="left"
          title="UniFi gateway"
          sub={["Encrypted DNS, last resort", "ad blocking: no, still encrypted"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={400} y={294} label="Tier 3" accent="amber" filled fontSize={11} />
        </NodePanel>

        {/* Tiers -> resolvers bus */}
        {[120, 225, 330].map((cy) => (
          <FlowLine key={cy} id="edns1" d={`M516,${cy} L538,${cy}`} accent="emerald" arrow={false} />
        ))}
        <path d="M538,120 L538,330" fill="none" className="stroke-emerald-500/50" strokeWidth="1.5" />
        <FlowLine id="edns1" d="M538,225 L560,225" accent="emerald" width={2} />

        {/* Public resolvers */}
        <NodePanel
          x={562}
          y={150}
          w={294}
          h={150}
          accent="emerald"
          emphasis
          title="Cloudflare + Quad9"
          sub={["DNS over HTTPS · port 443", "TLS encrypted", "no-log, no-filter"]}
          titleSize={18}
          subSize={12.5}
        />

        {/* Blocked plaintext */}
        <FlowLine id="edns1" d="M99,290 L99,408" accent="red" dashed />
        <text
          x={111}
          y={360}
          className="fill-destructive font-mono font-semibold"
          style={{ fontSize: 12.5 }}
        >
          port 53
        </text>
        <NodePanel
          x={24}
          y={410}
          w={832}
          h={46}
          accent="red"
          emphasis
          align="left"
          title="Plain DNS to the internet"
          titleSize={15}
        >
          <text
            x={832}
            y={438}
            textAnchor="end"
            className="fill-muted-foreground font-mono"
            style={{ fontSize: 12.5 }}
          >
            port 53 and DoT 853: blocked or intercepted
          </text>
        </NodePanel>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * The same lookup, two ways. Plain DNS crosses the ISP as readable text.
 * DoH crosses it as opaque TLS to a resolver on 443.
 */
export function PlainVsDohDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The same lookup two ways. Plain DNS lets the ISP read the domain and tamper with the answer. DNS over HTTPS shows the ISP only an encrypted connection to a resolver. The resolver still sees the question, so it has to be one you trust."
      }
    >
      <EditorialFrame
        id="edns2"
        w={880}
        h={420}
        eyebrow="What The ISP Sees"
        chips={[
          { label: "port 53 vs 443", accent: "cyan" },
        ]}
        footerRight="Plain DNS vs DNS over HTTPS"
      >
        {/* Lane 1: plain DNS */}
        <SectionLabel x={24} y={84} label="Plain DNS" accent="red" fontSize={13} />
        <NodePanel
          x={24}
          y={100}
          w={170}
          h={96}
          title="Any device"
          sub={["asks for a domain"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="edns2" d="M194,148 L340,148" accent="red" width={2} />
        <CenterChip cx={267} y={112} label="A? example.com" accent="red" />
        <NodePanel
          x={340}
          y={100}
          w={250}
          h={96}
          accent="red"
          emphasis
          title="ISP on the path"
          sub={["reads every domain", "can tamper with answers"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="edns2" d="M590,148 L696,148" accent="red" width={2} />
        <CenterChip cx={643} y={112} label="port 53" accent="red" />
        <NodePanel
          x={696}
          y={100}
          w={160}
          h={96}
          title="Resolver"
          sub={["answers in clear"]}
          titleSize={17}
          subSize={12.5}
        />

        <line x1={24} y1={226} x2={856} y2={226} className="stroke-foreground/15" strokeWidth="1" strokeDasharray="6 5" />

        {/* Lane 2: DoH */}
        <SectionLabel x={24} y={262} label="DNS over HTTPS" accent="emerald" fontSize={13} />
        <NodePanel
          x={24}
          y={278}
          w={170}
          h={96}
          title="Any device"
          sub={["same question"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="edns2" d="M194,326 L340,326" accent="emerald" width={2} />
        <CenterChip cx={267} y={290} label="TLS · opaque" accent="emerald" />
        <NodePanel
          x={340}
          y={278}
          w={250}
          h={96}
          accent="emerald"
          emphasis
          title="ISP on the path"
          sub={["sees TLS to a resolver", "cannot read the domain"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="edns2" d="M590,326 L696,326" accent="emerald" width={2} />
        <CenterChip cx={643} y={290} label="port 443" accent="emerald" />
        <NodePanel
          x={696}
          y={278}
          w={160}
          h={96}
          accent="amber"
          title="Resolver"
          sub={["still sees queries", "pick a no-log one"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * Log2Ram holds /var/log in RAM and syncs to the SD card once a day at
 * 23:55. Pi-hole FTL's query database sits outside /var/log, so it needs
 * its own setting: DBinterval = 3600 (hourly).
 */
export function Log2RamFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Logs live in RAM and reach the SD card once a day at 23:55. The Pi-hole query database is outside /var/log, so FTL is told to write it hourly instead of every 60 seconds."
      }
    >
      <EditorialFrame
        id="edns3"
        w={880}
        h={480}
        eyebrow="Keeping The SD Card Alive"
        chips={[
          { label: "SIZE=512M", accent: "cyan" },
          { label: "DBinterval 3600", accent: "amber" },
        ]}
        footerRight="Log2Ram · Pi-hole FTL"
      >
        {/* Pi-hole FTL */}
        <NodePanel
          x={24}
          y={150}
          w={170}
          h={130}
          accent="violet"
          terminal
          title="Pi-hole FTL"
          sub={["logs + queries", "all day long"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* FTL -> two lanes */}
        <FlowLine id="edns3" d="M194,215 L216,215" accent="muted" arrow={false} />
        <path d="M216,130 L216,300" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id="edns3" d="M216,130 L238,130" accent="cyan" />
        <FlowLine id="edns3" d="M216,300 L238,300" accent="amber" />

        {/* Lane panels */}
        <NodePanel
          x={240}
          y={82}
          w={270}
          h={96}
          accent="cyan"
          emphasis
          title="/var/log in RAM"
          sub={["Log2Ram tmpfs, 512M", "no SD writes until sync"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={240}
          y={252}
          w={270}
          h={96}
          accent="amber"
          title="pihole-FTL.db"
          sub={["long-term query history", "outside /var/log"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Lanes -> SD card */}
        <FlowLine id="edns3" d="M510,130 L650,130" accent="cyan" arrow={false} />
        <FlowLine id="edns3" d="M510,300 L650,300" accent="amber" arrow={false} />
        <CenterChip cx={580} y={96} label="daily 23:55" accent="cyan" />
        <CenterChip cx={580} y={266} label="hourly" accent="amber" />
        <path d="M650,130 L650,300" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id="edns3" d="M650,215 L680,215" accent="emerald" width={2} />

        <NodePanel
          x={682}
          y={150}
          w={174}
          h={130}
          accent="emerald"
          emphasis
          title="SD card"
          sub={["64 GB microSD", "few, batched writes"]}
          titleSize={18}
          subSize={12.5}
        />

        {/* Trade-off band */}
        <NodePanel
          x={24}
          y={368}
          w={832}
          h={74}
          accent="muted"
          variant="dashed"
          align="left"
          title="The trade-off"
          sub={["power cut: up to 24 h of logs and 1 h of query history lost", "filtering and DNS answers are unaffected"]}
          titleSize={15}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * A device with a hardcoded resolver asks 8.8.8.8 on port 53. The gateway
 * intercepts the query and answers it over its own encrypted resolver, so
 * the firewall block rule never sees it. The cost: no Pi-hole filtering.
 */
export function GatewayInterceptDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "A device with a hardcoded resolver asks 8.8.8.8 over plain DNS. The gateway intercepts the query and answers through its own encrypted resolver, so the block rule never sees it. The price is that the device skips Pi-hole filtering."
      }
    >
      <EditorialFrame
        id="edns4"
        w={880}
        h={500}
        eyebrow="The Gateway Intercepts Port 53"
        eyebrowAccent="amber"
        chips={[
          { label: "surprise", accent: "amber" },
        ]}
        footerRight="UniFi Encrypted DNS · Predefined"
      >
        {/* Ghost: the intended destination */}
        <NodePanel
          x={666}
          y={72}
          w={190}
          h={58}
          accent="red"
          variant="ghost"
          title="8.8.8.8"
          sub={["never reached"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="edns4" d={elbowPath(119, 160, 666, 101, "v")} accent="red" dashed />
        <line x1={396} y1={95} x2={408} y2={107} className="stroke-red-500" strokeWidth="2.5" />
        <line x1={408} y1={95} x2={396} y2={107} className="stroke-red-500" strokeWidth="2.5" />
        <text
          x={402}
          y={86}
          textAnchor="middle"
          className="fill-destructive font-mono font-semibold"
          style={{ fontSize: 12.5 }}
        >
          what the device asked for
        </text>

        {/* Main row */}
        <NodePanel
          x={24}
          y={160}
          w={190}
          h={96}
          accent="red"
          title="Smart TV"
          sub={["hardcoded 8.8.8.8", "port 53, plaintext"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="edns4" d="M214,208 L326,208" accent="red" width={2} />
        <CenterChip cx={270} y={172} label="port 53" accent="red" />
        <NodePanel
          x={326}
          y={160}
          w={228}
          h={96}
          accent="amber"
          emphasis
          title="Gateway intercepts"
          sub={["answers over its own", "encrypted resolver"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="edns4" d="M554,208 L666,208" accent="emerald" width={2} />
        <CenterChip cx={610} y={172} label="DoH 443" accent="emerald" />
        <NodePanel
          x={666}
          y={160}
          w={190}
          h={96}
          accent="emerald"
          emphasis
          title="Cloudflare + Quad9"
          sub={["encrypted upstream"]}
          titleSize={16}
          subSize={12.5}
        />

        {/* Consequences row */}
        <FlowLine id="edns4" d="M119,256 L119,292" accent="muted" dashed arrow={false} />
        <FlowLine id="edns4" d="M440,256 L440,292" accent="muted" dashed arrow={false} />
        <FlowLine id="edns4" d="M761,256 L761,292" accent="muted" dashed arrow={false} />
        <NodePanel
          x={24}
          y={294}
          w={190}
          h={80}
          accent="amber"
          variant="dashed"
          title="Pi-hole skipped"
          sub={["no ad blocking", "for this device"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={326}
          y={294}
          w={228}
          h={80}
          variant="dashed"
          title="Firewall block rule"
          sub={["port 53 to internet", "backstop, never reached"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={666}
          y={294}
          w={190}
          h={80}
          accent="cyan"
          variant="dashed"
          title="Identity tests"
          sub={["same resolver as a", "direct gateway query"]}
          titleSize={16}
          subSize={12.5}
        />

        {/* Result band */}
        <NodePanel
          x={24}
          y={390}
          w={832}
          h={64}
          accent="emerald"
          emphasis
          align="left"
          title="Result: no plaintext DNS leaves the house"
          sub={["even hardcoded devices get encrypted lookups"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

const LEAK_ROWS = [
  {
    n: 1,
    before: { title: "DHCP hands out public fallbacks", sub: "Pi-hole + 9.9.9.9, 1.1.1.1, 8.8.8.8" },
    after: { title: "Three encrypted resolvers", sub: "PiHoleMain, PiHoleBackup, gateway" },
  },
  {
    n: 2,
    before: { title: "No outbound port 53 block", sub: "dig @8.8.8.8 worked from the Mac" },
    after: { title: "Port 53 and 853 blocked", sub: "gateway also intercepts strays" },
  },
  {
    n: 3,
    before: { title: "Pi resolv.conf: 8.8.8.8", sub: "static file from December 2023" },
    after: { title: "Pi uses its own Pi-hole", sub: "resolv.conf points at itself" },
  },
  {
    n: 4,
    before: { title: "Gateway WAN DNS fell back", sub: "Pi-hole + plaintext 1.1.1.1" },
    after: { title: "Gateway WAN DNS: the two Pis", sub: "failover link switched too" },
  },
] as const;

/**
 * The four leaks the 2026-10-04 audit found, paired with what replaced
 * each one.
 */
export function FourLeaksBeforeAfterDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The four leaks around a healthy Pi-hole, and what replaced each one. None were bugs. Each was a resilience choice that quietly traded away encryption."
      }
    >
      <EditorialFrame
        id="edns5"
        w={880}
        h={460}
        eyebrow="Four Leaks, Four Fixes"
        chips={[
          { label: "4 leaks", accent: "red" },
          { label: "4 closed", accent: "emerald" },
        ]}
        footerRight="2026-10-04 audit · 2026-10-18 build"
      >
        <SectionLabel x={64} y={86} label="Before" accent="red" fontSize={13} />
        <SectionLabel x={474} y={86} label="After" accent="emerald" fontSize={13} />

        {LEAK_ROWS.map((row, i) => {
          const y = 100 + i * 80;
          const cy = y + 34;
          return (
            <g key={row.n}>
              <StepBadge cx={40} cy={cy} n={row.n} accent="muted" />
              <NodePanel
                x={64}
                y={y}
                w={370}
                h={68}
                accent="red"
                align="left"
                title={row.before.title}
                sub={[row.before.sub]}
                titleSize={17}
                subSize={12.5}
              />
              <FlowLine id="edns5" d={`M434,${cy} L472,${cy}`} accent="emerald" width={2} />
              <NodePanel
                x={474}
                y={y}
                w={382}
                h={68}
                accent="emerald"
                emphasis
                align="left"
                title={row.after.title}
                sub={[row.after.sub]}
                titleSize={17}
                subSize={12.5}
              />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramWrapper>
  );
}
