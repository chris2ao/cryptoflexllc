/** Pi-hole + Tailscale blog post diagram: editorial SVG, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  elbowPath,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/**
 * A phone on cellular sends DNS to Tailscale, which fans each query out to
 * both Pi-holes over their Tailscale addresses. Each Pi-hole forwards
 * through dnscrypt-proxy to Cloudflare and Quad9 over DoH. A Split DNS
 * branch sends .home names to the same two Pi-holes.
 */
export function PiholeTailscaleDnsPathDiagram({ caption }: DiagramProps) {
  return (
    <DiagramLightbox
      caption={
        caption ??
        "A phone on cellular hands its DNS to Tailscale, which asks both Pi-holes over their Tailscale addresses. Each Pi-hole forwards through dnscrypt-proxy to Cloudflare and Quad9. Split DNS sends .home names to the same two Pi-holes."
      }
    >
      <EditorialFrame
        id="pts1"
        w={880}
        h={450}
        eyebrow="DNS Away From Home"
        chips={[
          { label: "2 Pi-holes", accent: "primary" },
          { label: "DNS only", accent: "cyan" },
        ]}
        footerRight="Phone · Tailscale · Pi-hole · DoH"
      >
        <SectionLabel x={24} y={82} label="Anywhere" accent="cyan" />
        <SectionLabel x={404} y={82} label="At home" accent="primary" />
        <SectionLabel x={684} y={82} label="Encrypted" accent="emerald" />

        {/* Phone -> Tailscale */}
        <NodePanel
          x={24}
          y={145}
          w={140}
          h={110}
          accent="cyan"
          title="Phone on 5G"
          sub={["Wi-Fi off", "Tailscale on"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="pts1" d="M164,200 L204,200" accent="cyan" width={2} />
        <NodePanel
          x={204}
          y={145}
          w={150}
          h={110}
          accent="violet"
          emphasis
          title="Tailscale"
          sub={["Override DNS", "set to Pi-holes"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Fan-out bus to both Pi-holes */}
        <FlowLine id="pts1" d="M354,200 L379,200" accent="primary" arrow={false} width={2} />
        <path d="M379,142 L379,258" fill="none" className="stroke-primary/50" strokeWidth="2" />
        <FlowLine id="pts1" d="M379,142 L402,142" accent="primary" width={2} />
        <FlowLine id="pts1" d="M379,258 L402,258" accent="primary" width={2} />

        {/* Pi-holes */}
        <NodePanel
          x={404}
          y={96}
          w={230}
          h={92}
          accent="primary"
          emphasis
          title="pihole-main"
          sub={["100.101.1.10", "dnscrypt-proxy :5053"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={404}
          y={212}
          w={230}
          h={92}
          accent="primary"
          title="pihole-backup"
          sub={["100.101.1.20", "dnscrypt-proxy :5053"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Fan-in bus to upstream */}
        <FlowLine id="pts1" d="M634,142 L659,142" accent="emerald" arrow={false} width={2} />
        <FlowLine id="pts1" d="M634,258 L659,258" accent="emerald" arrow={false} width={2} />
        <path d="M659,142 L659,258" fill="none" className="stroke-emerald-500/50" strokeWidth="2" />
        <FlowLine id="pts1" d="M659,200 L682,200" accent="emerald" width={2} />

        <NodePanel
          x={684}
          y={140}
          w={172}
          h={120}
          accent="emerald"
          emphasis
          title="Upstream"
          sub={["Cloudflare", "Quad9", "DNS over HTTPS"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Split DNS branch */}
        <FlowLine id="pts1" d={elbowPath(279, 255, 330, 375, "v")} accent="amber" dashed width={2} />
        <NodePanel
          x={330}
          y={346}
          w={304}
          h={58}
          accent="amber"
          align="left"
          title="Split DNS: home"
          sub={["*.home sent to both Pi-holes"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="pts1" d="M519,346 L519,304" accent="amber" dashed width={2} />
        <Chip x={856} y={362} label="Web traffic goes direct" accent="muted" anchor="end" fontSize={11} />
      </EditorialFrame>
    </DiagramLightbox>
  );
}
