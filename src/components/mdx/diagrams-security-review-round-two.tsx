/** Security Review Round Two blog post diagrams: editorial SVG, themed to site colors */

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

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return <DiagramLightbox caption={caption}>{children}</DiagramLightbox>;
}

/**
 * Recon feeds five parallel security lenses. Each lens's take flows into
 * an adversarial verify step and an advocate consensus step, which
 * reconcile into one ranked report, then remediation. The red-team lens
 * gets a red stroke to foreshadow which lens caught the Critical.
 */
export function ReviewPipelineDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Five security lenses in parallel, every finding challenged before it is trusted, then reconciled with an advocate for the owner's real-world priorities. The red-team lens is what caught the Critical the others missed."
      }
    >
      <EditorialFrame
        id="srr1"
        w={960}
        h={560}
        eyebrow="The Security Review Pipeline"
        chips={[
          { label: "6 agents", accent: "primary" },
          { label: "1 Critical found", accent: "red" },
        ]}
        footerRight="Five lenses · verify · consensus"
        maxWidthClass="max-w-4xl"
      >
        {/* Recon */}
        <NodePanel
          x={24}
          y={201}
          w={140}
          h={96}
          accent="cyan"
          title="Recon"
          sub={["live + static"]}
          terminal
        />

        {/* Recon -> lens bus */}
        <FlowLine id="srr1" d="M164,249 L196,249" accent="cyan" arrow={false} />
        <path d="M196,105 L196,393" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        {[105, 177, 249, 321, 393].map((cy) => (
          <FlowLine key={cy} id="srr1" d={`M196,${cy} L208,${cy}`} accent="cyan" />
        ))}

        {/* Five lens rows */}
        <NodePanel x={210} y={76} w={250} h={58} title="AppSec Pentester" sub={["captain · audit lens"]} />
        <NodePanel
          x={210}
          y={148}
          w={250}
          h={58}
          accent="red"
          emphasis
          title="Red Teamer"
          sub={["exploit lens · caught the Critical"]}
        />
        <NodePanel x={210} y={220} w={250} h={58} title="Security Researcher" sub={["novel bugs"]} />
        <NodePanel x={210} y={292} w={250} h={58} title="Threat Intel" sub={["OSINT & CVEs"]} />
        <NodePanel x={210} y={364} w={250} h={58} title="Security Engineer" sub={["fix design"]} />

        {/* Lenses -> verify/consensus bus */}
        {[105, 177, 249, 321, 393].map((cy) => (
          <FlowLine key={cy} id="srr1" d={`M460,${cy} L492,${cy}`} accent="muted" arrow={false} />
        ))}
        <path d="M492,105 L492,393" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id="srr1" d={elbowPath(492, 177, 504, 177)} accent="amber" />
        <FlowLine id="srr1" d={elbowPath(492, 321, 504, 321)} accent="primary" />

        {/* Adversarial verify + Advocate consensus */}
        <NodePanel
          x={506}
          y={134}
          w={186}
          h={86}
          accent="amber"
          emphasis
          title="Adversarial verify"
          sub={["every finding challenged"]}
        />
        <NodePanel
          x={506}
          y={278}
          w={186}
          h={86}
          accent="primary"
          title="Advocate consensus"
          sub={["cost vs. risk veto"]}
        />

        {/* -> ranked report */}
        <FlowLine id="srr1" d={elbowPath(692, 177, 790, 202, "h")} accent="muted" />
        <FlowLine id="srr1" d={elbowPath(692, 321, 790, 296, "h")} accent="muted" />
        <NodePanel
          x={750}
          y={206}
          w={186}
          h={86}
          title="Ranked report"
          sub={["consensus findings only"]}
        />

        {/* -> remediation band */}
        <FlowLine id="srr1" d="M843,292 L843,432" accent="emerald" width={2} />
        <NodePanel
          x={24}
          y={436}
          w={912}
          h={68}
          accent="emerald"
          emphasis
          align="left"
          title="Remediate + verify"
          sub={["every accepted finding fixed, re-tested, and re-reviewed before it ships"]}
        >
          <Chip x={920} y={458} label="Nothing ships without consensus" accent="emerald" filled anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * A plain --- fence is data, read by a YAML reader. A ---js fence is
 * handed to a JavaScript engine that runs it. The shared guard refuses
 * any labelled fence before the danger lane ever reaches the engine.
 */
export function FrontmatterEvalDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "A plain --- fence is read as harmless data. A ---js fence gets handed to a code engine that runs it. The shared guard refuses any labelled fence, so only the safe reader is ever reached."
      }
    >
      <EditorialFrame
        id="srr2"
        w={940}
        h={400}
        eyebrow="Data Reader vs. Code Engine"
        chips={[{ label: "1 shared guard", accent: "cyan" }]}
        footerRight="Frontmatter parser · eval() removed"
        maxWidthClass="max-w-4xl"
      >
        {/* SAFE lane */}
        <SectionLabel x={20} y={78} label="Safe" accent="emerald" />
        <NodePanel x={20} y={92} w={150} h={86} title="Normal post" sub={["--- (plain)"]} terminal />
        <FlowLine id="srr2" d="M170,135 L230,135" accent="emerald" />
        <NodePanel x={230} y={92} w={200} h={86} accent="emerald" title="YAML reader" sub={["reads data only"]} />

        {/* DANGER lane */}
        <SectionLabel x={20} y={210} label="Danger" accent="red" />
        <NodePanel x={20} y={224} w={150} h={86} title="Crafted post" sub={["---js"]} terminal />
        <FlowLine id="srr2" d="M170,267 L230,267" accent="red" />
        <NodePanel
          x={230}
          y={224}
          w={200}
          h={86}
          accent="red"
          emphasis
          title="JavaScript engine"
          sub={["eval()", "server takeover"]}
        />

        {/* danger path is cut off before it ever reaches the guard */}
        <FlowLine id="srr2" d={elbowPath(130, 224, 640, 200, "v")} accent="red" dashed arrow={false} />
        <line x1="634" y1="194" x2="646" y2="206" className="stroke-red-500" strokeWidth="2" />
        <line x1="646" y1="194" x2="634" y2="206" className="stroke-red-500" strokeWidth="2" />
        <text x="640" y="218" textAnchor="middle" className="fill-red-500 font-mono font-semibold" style={{ fontSize: 10.5 }}>
          blocked
        </text>

        {/* guard */}
        <NodePanel
          x={690}
          y={64}
          w={230}
          h={282}
          accent="cyan"
          variant="dashed"
          emphasis
          title="New guard"
          sub={["parseFrontmatter()", "refuses any labelled fence", "disables the code engine"]}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * The crafted-post payload could fire in three places, and the preview
 * build is the one that carries real production secrets. Closed at the
 * content parser and a CI gate on every push.
 */
export function CriticalBlastRadiusDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Why it was rated Critical: the code could fire in three places, and the preview build carries the real production secrets. Closed at the content parser and a CI check on every push."
      }
    >
      <EditorialFrame
        id="srr3"
        w={880}
        h={560}
        eyebrow="Why This Was Rated Critical"
        chips={[{ label: "3 reachable targets", accent: "red" }]}
        footerRight="Blast radius · closed at parser + CI"
      >
        {/* payload source */}
        <NodePanel
          x={24}
          y={155}
          w={190}
          h={140}
          accent="red"
          emphasis
          title="Content pull request"
          sub={["(the payload)"]}
          terminal
        />

        {/* orthogonal bus fanning to three targets */}
        <FlowLine id="srr3" d="M214,225 L250,225" accent="red" arrow={false} />
        <path d="M250,109 L250,341" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <FlowLine id="srr3" d="M250,109 L280,109" accent="red" />
        <FlowLine id="srr3" d="M250,225 L280,225" accent="red" />
        <FlowLine id="srr3" d="M250,341 L280,341" accent="red" />

        <NodePanel x={280} y={64} w={560} h={90} title="CI build runner" />
        <NodePanel
          x={280}
          y={180}
          w={560}
          h={90}
          accent="red"
          emphasis
          title="Preview build"
          sub={["holds real secrets"]}
        />
        <NodePanel x={280} y={296} w={560} h={90} title="Production function" />

        <text x={440} y={412} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 11.5 }}>
          Reachable: GitHub token · database URL · mail + signing secrets
        </text>

        <NodePanel
          x={24}
          y={432}
          w={832}
          h={64}
          accent="emerald"
          emphasis
          title="Now closed at the parser + CI gate"
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * Before/after: trusting a client-supplied identity header lets an
 * attacker mint a fresh bucket every request, so the limit never trips.
 * Reading the platform-set identity (which cannot be forged) fixes it.
 */
export function SpoofedIdentityRateLimitDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Trust the identity the hosting platform sets, not the one the visitor sends. Same attacker, but now every request maps to the same real bucket, so the limit finally holds."
      }
    >
      <EditorialFrame
        id="srr4"
        w={940}
        h={400}
        eyebrow="Spoofed Identity vs. Real Rate Limits"
        chips={[
          { label: "spoofable header", accent: "red" },
          { label: "platform-set id", accent: "emerald" },
        ]}
        footerRight="Rate limiter · identity source fixed"
        maxWidthClass="max-w-4xl"
      >
        {/* BEFORE */}
        <SectionLabel x={20} y={78} label="Before" accent="red" />
        <NodePanel x={20} y={92} w={160} h={100} accent="amber" title="Attacker" sub={["fresh fake ID,", "each request"]} />
        <FlowLine id="srr4" d="M180,142 L200,142" accent="amber" />
        <NodePanel x={200} y={92} w={210} h={100} title="Limiter" sub={["reads the spoofable header"]} />
        <FlowLine id="srr4" d="M410,142 L430,142" accent="red" />
        <NodePanel
          x={430}
          y={92}
          w={230}
          h={100}
          accent="red"
          title="New bucket every time"
          sub={["limit never trips"]}
        />
        <FlowLine id="srr4" d="M660,142 L680,142" accent="red" />
        <NodePanel
          x={680}
          y={92}
          w={240}
          h={100}
          accent="red"
          emphasis
          title="Unlimited tries"
          sub={["at the admin login"]}
        />

        {/* AFTER */}
        <SectionLabel x={20} y={224} label="After" accent="emerald" />
        <NodePanel x={20} y={238} w={160} h={100} accent="amber" title="Attacker" sub={["still spoofs the header"]} />
        <FlowLine id="srr4" d="M180,288 L200,288" accent="amber" />
        <NodePanel
          x={200}
          y={238}
          w={300}
          h={100}
          accent="emerald"
          title="Limiter"
          sub={["reads the platform-set ID", "cannot be forged"]}
        />
        <FlowLine id="srr4" d="M500,288 L520,288" accent="emerald" />
        <NodePanel
          x={520}
          y={238}
          w={280}
          h={100}
          accent="emerald"
          emphasis
          title="Real limit enforced"
          sub={["per real visitor"]}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * Before/after: thirteen "separate" rate limits all wrote to one shared
 * counter key, so the smallest limit governed everything. Namespacing
 * gives each limit its own bucket.
 */
export function SharedCounterBucketsDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Before, thirteen 'separate' limits quietly wrote to one counter, so the smallest limit won and ordinary browsing ate the login budget. Namespacing gives each its own counter, so the documented limits finally hold."
      }
    >
      <EditorialFrame
        id="srr5"
        w={940}
        h={400}
        eyebrow="One Bucket, Thirteen Features"
        chips={[
          { label: "13 limits", accent: "red" },
          { label: "namespaced", accent: "emerald" },
        ]}
        footerRight="Rate limit keys · now namespaced"
        maxWidthClass="max-w-4xl"
      >
        <SectionLabel x={20} y={78} label="Before" accent="red" />
        <SectionLabel x={490} y={78} label="After" accent="emerald" />
        <line x1="460" y1="64" x2="460" y2="346" className="stroke-foreground/20" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* BEFORE sources */}
        <NodePanel x={20} y={94} w={150} h={50} title="comments" titleSize={13} />
        <NodePanel x={20} y={160} w={150} h={50} title="login" titleSize={13} />
        <NodePanel x={20} y={226} w={150} h={50} title="subscribe" titleSize={13} />
        <NodePanel x={20} y={292} w={150} h={50} title="...10 more" titleSize={13} />

        {/* BEFORE bus: four sources converge on one bucket */}
        <FlowLine id="srr5" d="M170,119 L200,119" accent="red" arrow={false} />
        <FlowLine id="srr5" d="M170,185 L200,185" accent="red" arrow={false} />
        <FlowLine id="srr5" d="M170,251 L200,251" accent="red" arrow={false} />
        <FlowLine id="srr5" d="M170,317 L200,317" accent="red" arrow={false} />
        <path d="M200,119 L200,317" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <FlowLine id="srr5" d="M200,218 L230,218" accent="red" />

        <NodePanel
          x={230}
          y={160}
          w={190}
          h={120}
          accent="red"
          emphasis
          title="One shared bucket"
          sub={["smallest limit wins"]}
        />

        {/* AFTER: direct 1:1 arrows */}
        <NodePanel x={490} y={94} w={140} h={50} title="comments" titleSize={13} />
        <NodePanel x={490} y={160} w={140} h={50} title="login" titleSize={13} />
        <NodePanel x={490} y={226} w={140} h={50} title="subscribe" titleSize={13} />
        <NodePanel x={490} y={292} w={140} h={50} title="...10 more" titleSize={13} />

        <FlowLine id="srr5" d="M630,119 L680,119" accent="emerald" />
        <FlowLine id="srr5" d="M630,185 L680,185" accent="emerald" />
        <FlowLine id="srr5" d="M630,251 L680,251" accent="emerald" />
        <FlowLine id="srr5" d="M630,317 L680,317" accent="emerald" />

        <NodePanel x={680} y={94} w={160} h={50} accent="emerald" title="Bucket A" titleSize={13} />
        <NodePanel x={680} y={160} w={160} h={50} accent="emerald" title="Bucket B" titleSize={13} />
        <NodePanel x={680} y={226} w={160} h={50} accent="emerald" title="Bucket C" titleSize={13} />
        <NodePanel x={680} y={292} w={160} h={50} accent="emerald" title="Bucket ..." titleSize={13} />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * Clicking the video hits a frame-src policy that never listed the
 * video domain, so the frame silently dies at HTTP 200 with only a
 * console error. The fix is a one-line policy addition.
 */
export function SilentCSPFailureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The thumbnail loaded, so it looked fine; pressing play hit a policy that never listed our video domain. HTTP 200, a console-only error, and a feature broken in plain sight. The fix was one line: allow the domain."
      }
    >
      <EditorialFrame
        id="srr6"
        w={900}
        h={420}
        eyebrow="A Silent CSP Failure"
        chips={[{ label: "1 line fix", accent: "emerald" }]}
        footerRight="CSP directive · frame-src fixed"
      >
        <NodePanel x={20} y={90} w={170} h={100} title="Click the video" />
        <FlowLine id="srr6" d="M190,140 L220,140" accent="muted" />

        <NodePanel
          x={220}
          y={90}
          w={250}
          h={100}
          accent="red"
          title="Policy"
          sub={["frame-src 'self'", "blocks youtube-nocookie"]}
        />
        <FlowLine id="srr6" d="M470,140 L500,140" accent="red" />

        <NodePanel
          x={500}
          y={90}
          w={200}
          h={100}
          accent="red"
          emphasis
          title="Dead frame"
          sub={["HTTP 200", "console-only error"]}
        />

        {/* fix path elbows down to the remediation panel */}
        <FlowLine id="srr6" d={elbowPath(345, 190, 440, 250, "v")} accent="emerald" dashed />
        <text x="395" y="228" textAnchor="middle" className="fill-emerald-500 font-mono font-semibold" style={{ fontSize: 10.5 }}>
          the fix
        </text>

        <NodePanel
          x={300}
          y={250}
          w={280}
          h={100}
          accent="emerald"
          emphasis
          title="Fix: allow the domain"
          sub={["video plays"]}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}
