/** Security Review Round Two blog post diagrams: SVG-based, themed to site colors */

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
      <svg
        viewBox="0 0 1000 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl mx-auto"
      >
        <defs>
          <marker id="srr1ArrowCyan" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500" />
          </marker>
          <marker id="srr1ArrowAmber" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500" />
          </marker>
          <marker id="srr1ArrowMuted" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/50" />
          </marker>
          <marker id="srr1ArrowEmerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500" />
          </marker>
        </defs>

        <text x="500" y="24" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          The Security Review Pipeline
        </text>

        {/* Recon */}
        <rect x="20" y="190" width="130" height="100" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="85" y="232" textAnchor="middle" className="fill-cyan-500 text-[12px] font-semibold">Recon</text>
        <text x="85" y="250" textAnchor="middle" className="fill-muted-foreground text-[10px]">(live + static)</text>

        {/* Recon -> five lenses */}
        <line x1="150" y1="240" x2="198" y2="82.5" className="stroke-cyan-500/60" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="150" y1="240" x2="198" y2="152.5" className="stroke-cyan-500/60" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="150" y1="240" x2="198" y2="222.5" className="stroke-cyan-500/60" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="150" y1="240" x2="198" y2="292.5" className="stroke-cyan-500/60" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="150" y1="240" x2="198" y2="362.5" className="stroke-cyan-500/60" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />

        {/* Five lens boxes */}
        <rect x="200" y="55" width="180" height="55" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="290" y="87" textAnchor="middle" className="fill-foreground text-[11px] font-medium">AppSec Pentester</text>

        <rect x="200" y="125" width="180" height="55" rx="8" className="stroke-red-500" strokeWidth="2" />
        <text x="290" y="157" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">Red Teamer</text>

        <rect x="200" y="195" width="180" height="55" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="290" y="227" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Security Researcher</text>

        <rect x="200" y="265" width="180" height="55" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="290" y="297" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Threat Intel</text>

        <rect x="200" y="335" width="180" height="55" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="290" y="367" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Security Engineer</text>

        {/* lenses -> adversarial verify (amber) */}
        <line x1="380" y1="82.5" x2="428" y2="140" className="stroke-amber-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowAmber)" />
        <line x1="380" y1="152.5" x2="428" y2="140" className="stroke-amber-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowAmber)" />
        <line x1="380" y1="222.5" x2="428" y2="140" className="stroke-amber-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowAmber)" />
        <line x1="380" y1="292.5" x2="428" y2="140" className="stroke-amber-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowAmber)" />
        <line x1="380" y1="362.5" x2="428" y2="140" className="stroke-amber-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowAmber)" />

        {/* lenses -> advocate consensus (cyan) */}
        <line x1="380" y1="82.5" x2="428" y2="315" className="stroke-cyan-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="380" y1="152.5" x2="428" y2="315" className="stroke-cyan-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="380" y1="222.5" x2="428" y2="315" className="stroke-cyan-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="380" y1="292.5" x2="428" y2="315" className="stroke-cyan-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />
        <line x1="380" y1="362.5" x2="428" y2="315" className="stroke-cyan-500/50" strokeWidth="1.25" markerEnd="url(#srr1ArrowCyan)" />

        {/* Adversarial verify + Advocate consensus */}
        <rect x="430" y="95" width="180" height="90" rx="10" className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
        <text x="520" y="135" textAnchor="middle" className="fill-amber-500 text-[12px] font-semibold">Adversarial</text>
        <text x="520" y="153" textAnchor="middle" className="fill-amber-500 text-[12px] font-semibold">verify</text>

        <rect x="430" y="270" width="180" height="90" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="520" y="310" textAnchor="middle" className="fill-cyan-500 text-[12px] font-semibold">Advocate</text>
        <text x="520" y="328" textAnchor="middle" className="fill-cyan-500 text-[12px] font-semibold">consensus</text>

        {/* verify + consensus -> ranked report */}
        <line x1="610" y1="140" x2="698" y2="230" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#srr1ArrowMuted)" />
        <line x1="610" y1="315" x2="698" y2="250" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#srr1ArrowMuted)" />

        <rect x="700" y="195" width="140" height="90" rx="10" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="770" y="235" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">Ranked</text>
        <text x="770" y="253" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">report</text>

        {/* ranked -> remediate */}
        <line x1="840" y1="240" x2="878" y2="240" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#srr1ArrowEmerald)" />

        <rect x="880" y="195" width="100" height="90" rx="10" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="930" y="230" textAnchor="middle" className="fill-emerald-500 text-[11px] font-semibold">Remediate</text>
        <text x="930" y="246" textAnchor="middle" className="fill-emerald-500 text-[11px] font-semibold">+ verify</text>
      </svg>
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
      <svg
        viewBox="0 0 980 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl mx-auto"
      >
        <defs>
          <marker id="srr2ArrowEmerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500" />
          </marker>
          <marker id="srr2ArrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500" />
          </marker>
        </defs>

        <text x="490" y="22" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Data Reader vs. Code Engine
        </text>

        {/* lane backgrounds */}
        <rect x="10" y="40" width="630" height="110" rx="10" className="fill-emerald-500/5" />
        <rect x="10" y="220" width="630" height="110" rx="10" className="fill-red-500/5" />

        <text x="20" y="34" className="fill-emerald-500 text-[10px] font-semibold tracking-wide">SAFE</text>
        <text x="20" y="214" className="fill-red-500 text-[10px] font-semibold tracking-wide">DANGER</text>

        {/* SAFE lane */}
        <rect x="20" y="50" width="150" height="90" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="95" y="88" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Normal post</text>
        <text x="95" y="108" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">--- (plain)</text>

        <line x1="170" y1="95" x2="228" y2="95" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#srr2ArrowEmerald)" />

        <rect x="230" y="50" width="170" height="90" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="315" y="100" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">YAML reader</text>

        <line x1="400" y1="95" x2="458" y2="95" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#srr2ArrowEmerald)" />

        <rect x="460" y="50" width="150" height="90" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="535" y="100" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Data (safe)</text>

        {/* DANGER lane */}
        <rect x="20" y="230" width="150" height="90" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="95" y="268" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Crafted post</text>
        <text x="95" y="288" textAnchor="middle" className="fill-red-500 text-[10px] font-mono">---js</text>

        <line x1="170" y1="275" x2="228" y2="275" className="stroke-red-500" strokeWidth="2" markerEnd="url(#srr2ArrowRed)" />

        <rect x="230" y="230" width="170" height="90" rx="8" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="315" y="268" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">JavaScript engine</text>
        <text x="315" y="288" textAnchor="middle" className="fill-red-500 text-[10px] font-mono">eval()</text>

        <line x1="400" y1="275" x2="458" y2="275" className="stroke-red-500" strokeWidth="2" markerEnd="url(#srr2ArrowRed)" />

        <rect x="460" y="230" width="150" height="90" rx="8" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="535" y="268" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">Code runs =</text>
        <text x="535" y="288" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">server takeover</text>

        {/* dashed danger path intercepted before the guard */}
        <path d="M175,232 Q420,120 648,150" fill="none" className="stroke-red-500/70" strokeWidth="1.5" strokeDasharray="5 4" />
        <line x1="592" y1="132" x2="608" y2="148" className="stroke-red-500" strokeWidth="2" />
        <line x1="608" y1="132" x2="592" y2="148" className="stroke-red-500" strokeWidth="2" />
        <text x="600" y="118" textAnchor="middle" className="fill-red-500 text-[10px] font-semibold">blocked</text>

        {/* guard */}
        <rect x="650" y="20" width="300" height="340" rx="12" className="fill-cyan-500/5 stroke-cyan-500" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="800" y="60" textAnchor="middle" className="fill-cyan-500 text-[13px] font-semibold">New guard</text>
        <text x="800" y="100" textAnchor="middle" className="fill-cyan-500 text-[11px] font-mono">parseFrontmatter()</text>
        <text x="800" y="140" textAnchor="middle" className="fill-muted-foreground text-[10px]">refuses any labelled fence</text>
        <text x="800" y="170" textAnchor="middle" className="fill-muted-foreground text-[10px]">disables the code engine</text>
      </svg>
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
      <svg
        viewBox="0 0 760 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="srr3ArrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500" />
          </marker>
        </defs>

        <text x="380" y="24" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Why This Was Rated Critical
        </text>

        {/* payload source */}
        <rect x="30" y="195" width="170" height="100" rx="10" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="115" y="235" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">Content pull</text>
        <text x="115" y="253" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">request</text>
        <text x="115" y="273" textAnchor="middle" className="fill-muted-foreground text-[10px]">(the payload)</text>

        {/* fan to three targets */}
        <line x1="200" y1="230" x2="298" y2="100" className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#srr3ArrowRed)" />
        <line x1="200" y1="245" x2="298" y2="240" className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#srr3ArrowRed)" />
        <line x1="200" y1="260" x2="298" y2="380" className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#srr3ArrowRed)" />

        <rect x="300" y="60" width="250" height="80" rx="10" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="425" y="104" textAnchor="middle" className="fill-foreground text-[12px] font-medium">CI build runner</text>

        <rect x="300" y="200" width="250" height="80" rx="10" className="fill-red-500/10 stroke-red-500" strokeWidth="2" />
        <text x="425" y="232" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">Preview build</text>
        <text x="425" y="250" textAnchor="middle" className="fill-red-500 text-[11px] font-medium">holds real secrets</text>

        <rect x="300" y="340" width="250" height="80" rx="10" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="425" y="384" textAnchor="middle" className="fill-foreground text-[12px] font-medium">Production function</text>

        <text x="380" y="450" textAnchor="middle" className="fill-muted-foreground text-[11px]">
          → could reach GitHub token, database URL, mail + signing secrets
        </text>
        <text x="380" y="478" textAnchor="middle" className="fill-emerald-500 text-[11px] font-semibold">
          Now closed at the parser + CI gate
        </text>
      </svg>
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
      <svg
        viewBox="0 0 1000 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl mx-auto"
      >
        <defs>
          <marker id="srr4ArrowAmber" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500" />
          </marker>
          <marker id="srr4ArrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500" />
          </marker>
          <marker id="srr4ArrowEmerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500" />
          </marker>
        </defs>

        <text x="20" y="34" className="fill-red-500 text-[11px] font-semibold tracking-wide">BEFORE</text>

        {/* BEFORE row */}
        <rect x="20" y="50" width="170" height="90" rx="8" className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
        <text x="105" y="88" textAnchor="middle" className="fill-amber-500 text-[12px] font-semibold">Attacker</text>
        <text x="105" y="108" textAnchor="middle" className="fill-muted-foreground text-[10px]">fresh fake ID</text>
        <text x="105" y="124" textAnchor="middle" className="fill-muted-foreground text-[10px]">each request</text>

        <line x1="190" y1="95" x2="208" y2="95" className="stroke-amber-500" strokeWidth="2" markerEnd="url(#srr4ArrowAmber)" />

        <rect x="210" y="50" width="230" height="90" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="325" y="98" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Limiter reads the</text>
        <text x="325" y="116" textAnchor="middle" className="fill-foreground text-[11px] font-medium">spoofable header</text>

        <line x1="440" y1="95" x2="458" y2="95" className="stroke-red-500" strokeWidth="2" markerEnd="url(#srr4ArrowRed)" />

        <rect x="460" y="50" width="250" height="90" rx="8" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="585" y="98" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">New bucket every time,</text>
        <text x="585" y="116" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">limit never trips</text>

        <line x1="710" y1="95" x2="728" y2="95" className="stroke-red-500" strokeWidth="2" markerEnd="url(#srr4ArrowRed)" />

        <rect x="730" y="50" width="250" height="90" rx="8" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="855" y="98" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">Unlimited tries at the</text>
        <text x="855" y="116" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">admin login</text>

        <text x="20" y="204" className="fill-emerald-500 text-[11px] font-semibold tracking-wide">AFTER</text>

        {/* AFTER row */}
        <rect x="20" y="220" width="170" height="90" rx="8" className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
        <text x="105" y="258" textAnchor="middle" className="fill-amber-500 text-[12px] font-semibold">Attacker</text>
        <text x="105" y="278" textAnchor="middle" className="fill-muted-foreground text-[10px]">still spoofs...</text>

        <line x1="190" y1="265" x2="208" y2="265" className="stroke-amber-500" strokeWidth="2" markerEnd="url(#srr4ArrowAmber)" />

        <rect x="210" y="220" width="340" height="90" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="380" y="254" textAnchor="middle" className="fill-emerald-500 text-[11px] font-semibold">Limiter reads the</text>
        <text x="380" y="272" textAnchor="middle" className="fill-emerald-500 text-[11px] font-semibold">platform-set ID</text>
        <text x="380" y="290" textAnchor="middle" className="fill-muted-foreground text-[10px]">(cannot be forged)</text>

        <line x1="550" y1="265" x2="568" y2="265" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#srr4ArrowEmerald)" />

        <rect x="570" y="220" width="220" height="90" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="680" y="258" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">Real limit</text>
        <text x="680" y="276" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">enforced</text>
      </svg>
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
      <svg
        viewBox="0 0 900 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="srr5ArrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500" />
          </marker>
          <marker id="srr5ArrowEmerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500" />
          </marker>
        </defs>

        <text x="205" y="20" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold tracking-wide">BEFORE</text>
        <text x="695" y="20" textAnchor="middle" className="fill-emerald-500 text-[11px] font-semibold tracking-wide">AFTER</text>

        <line x1="450" y1="10" x2="450" y2="310" className="stroke-muted-foreground/30" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* BEFORE sources */}
        <rect x="30" y="40" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="105" y="70" textAnchor="middle" className="fill-foreground text-[11px]">comments</text>
        <rect x="30" y="110" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="105" y="140" textAnchor="middle" className="fill-foreground text-[11px]">login</text>
        <rect x="30" y="180" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="105" y="210" textAnchor="middle" className="fill-foreground text-[11px]">subscribe</text>
        <rect x="30" y="250" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="105" y="280" textAnchor="middle" className="fill-foreground text-[11px]">...10 more</text>

        {/* BEFORE converge */}
        <line x1="180" y1="65" x2="278" y2="170" className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#srr5ArrowRed)" />
        <line x1="180" y1="135" x2="278" y2="170" className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#srr5ArrowRed)" />
        <line x1="180" y1="205" x2="278" y2="170" className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#srr5ArrowRed)" />
        <line x1="180" y1="275" x2="278" y2="170" className="stroke-red-500/60" strokeWidth="1.5" markerEnd="url(#srr5ArrowRed)" />

        <rect x="280" y="105" width="170" height="130" rx="10" className="fill-red-500/10 stroke-red-500" strokeWidth="2" />
        <text x="365" y="163" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">one shared</text>
        <text x="365" y="181" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">bucket</text>

        {/* AFTER sources */}
        <rect x="490" y="40" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="565" y="70" textAnchor="middle" className="fill-foreground text-[11px]">comments</text>
        <rect x="490" y="110" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="565" y="140" textAnchor="middle" className="fill-foreground text-[11px]">login</text>
        <rect x="490" y="180" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="565" y="210" textAnchor="middle" className="fill-foreground text-[11px]">subscribe</text>
        <rect x="490" y="250" width="150" height="50" rx="6" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="565" y="280" textAnchor="middle" className="fill-foreground text-[11px]">...10 more</text>

        {/* AFTER 1:1 */}
        <line x1="640" y1="65" x2="718" y2="65" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#srr5ArrowEmerald)" />
        <line x1="640" y1="135" x2="718" y2="135" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#srr5ArrowEmerald)" />
        <line x1="640" y1="205" x2="718" y2="205" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#srr5ArrowEmerald)" />
        <line x1="640" y1="275" x2="718" y2="275" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#srr5ArrowEmerald)" />

        <rect x="720" y="40" width="150" height="50" rx="6" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="795" y="70" textAnchor="middle" className="fill-emerald-500 text-[11px] font-medium">bucket A</text>
        <rect x="720" y="110" width="150" height="50" rx="6" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="795" y="140" textAnchor="middle" className="fill-emerald-500 text-[11px] font-medium">bucket B</text>
        <rect x="720" y="180" width="150" height="50" rx="6" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="795" y="210" textAnchor="middle" className="fill-emerald-500 text-[11px] font-medium">bucket C</text>
        <rect x="720" y="250" width="150" height="50" rx="6" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="795" y="280" textAnchor="middle" className="fill-emerald-500 text-[11px] font-medium">bucket ...</text>
      </svg>
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
      <svg
        viewBox="0 0 780 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="srr6ArrowMuted" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker id="srr6ArrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500" />
          </marker>
          <marker id="srr6ArrowEmerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500" />
          </marker>
        </defs>

        <text x="390" y="22" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          A Silent CSP Failure
        </text>

        <rect x="20" y="60" width="170" height="90" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="105" y="110" textAnchor="middle" className="fill-foreground text-[12px] font-medium">Click the video</text>

        <line x1="190" y1="105" x2="248" y2="105" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#srr6ArrowMuted)" />

        <rect x="250" y="60" width="230" height="90" rx="8" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="365" y="95" textAnchor="middle" className="fill-red-500 text-[11px] font-semibold">Policy:</text>
        <text x="365" y="113" textAnchor="middle" className="fill-red-500 text-[11px] font-mono font-semibold">frame-src &apos;self&apos;</text>
        <text x="365" y="131" textAnchor="middle" className="fill-muted-foreground text-[10px]">blocks youtube-nocookie</text>

        <line x1="480" y1="105" x2="538" y2="105" className="stroke-red-500" strokeWidth="2" markerEnd="url(#srr6ArrowRed)" />

        <rect x="540" y="60" width="200" height="90" rx="8" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
        <text x="640" y="100" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">Dead frame</text>
        <text x="640" y="118" textAnchor="middle" className="fill-muted-foreground text-[10px]">HTTP 200,</text>
        <text x="640" y="134" textAnchor="middle" className="fill-muted-foreground text-[10px]">console-only error</text>

        {/* fix path */}
        <path d="M600,150 Q500,190 400,218" fill="none" className="stroke-emerald-500/70" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#srr6ArrowEmerald)" />
        <text x="500" y="185" textAnchor="middle" className="fill-emerald-500 text-[10px] font-semibold">the fix</text>

        <rect x="250" y="220" width="280" height="90" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="390" y="260" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">Fix: allow the domain</text>
        <text x="390" y="280" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">→ video plays</text>
      </svg>
    </DiagramWrapper>
  );
}
